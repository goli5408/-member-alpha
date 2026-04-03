-- ============================================================
-- Migration 002: Role system
-- Decisions locked in spec conflict review:
--   • PA lives in profiles (role = 'peer_ambassador'), not staff_profiles
--   • 'care_team' is a display label only — not a DB role
--   • Trigger routes new users to the correct table via user_type metadata
--   • PM + Support Agent can view all staff profiles
--   • check_ins.type distinguishes 'self' (→ Guide) vs 'peer' (→ Pod)
-- ============================================================

-- ── 1. Add role column to profiles (members + peer ambassadors) ──
ALTER TABLE profiles
  ADD COLUMN role TEXT NOT NULL DEFAULT 'member'
  CHECK (role IN ('member', 'peer_ambassador'));

-- ── 2. Staff profiles table ───────────────────────────────────────
CREATE TABLE staff_profiles (
  id            UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name  TEXT,
  role          TEXT NOT NULL CHECK (role IN (
                  'guide',
                  'program_manager',
                  'content_manager',
                  'support_agent'
                )),
  bio           TEXT,
  avatar_url    TEXT,
  timezone      TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  invited_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- Helper: read caller's staff role without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.my_staff_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT role FROM public.staff_profiles WHERE id = auth.uid()
$$;

-- Own row always visible
CREATE POLICY "Staff can view own profile"
  ON staff_profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- PM and Support Agent can view all staff (spec conflict #4 fix)
CREATE POLICY "PM and SA can view all staff profiles"
  ON staff_profiles FOR SELECT TO authenticated
  USING (public.my_staff_role() IN ('program_manager', 'support_agent'));

-- Own row updatable
CREATE POLICY "Staff can update own profile"
  ON staff_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- PM can insert (when creating staff via invite metadata)
CREATE POLICY "System can insert staff profiles"
  ON staff_profiles FOR INSERT TO authenticated, service_role
  WITH CHECK (true);

-- PM can deactivate / edit roles
CREATE POLICY "PM can update any staff profile"
  ON staff_profiles FOR UPDATE TO authenticated
  USING (public.my_staff_role() = 'program_manager');

-- ── 3. Update handle_new_user trigger ────────────────────────────
-- Routes new auth.users rows to the correct table based on
-- raw_user_meta_data.user_type:
--   'staff'            → staff_profiles (role = staff_role metadata)
--   'peer_ambassador'  → profiles       (role = 'peer_ambassador')
--   anything else      → profiles       (role = 'member')  ← default
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.raw_user_meta_data ->> 'user_type' = 'staff' THEN

    INSERT INTO public.staff_profiles (id, display_name, role, invited_by)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'display_name',
      NEW.raw_user_meta_data ->> 'staff_role',
      (NEW.raw_user_meta_data ->> 'invited_by')::UUID
    );

  ELSIF NEW.raw_user_meta_data ->> 'user_type' = 'peer_ambassador' THEN

    INSERT INTO public.profiles (id, display_name, role)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'display_name',
      'peer_ambassador'
    );

  ELSE

    -- Regular member self-signup
    INSERT INTO public.profiles (id, display_name, role)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'display_name',
      'member'
    );

  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
