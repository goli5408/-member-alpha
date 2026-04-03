-- ============================================================
-- Migration 005: Programs, Pods, Pod Members & Check-ins
--
-- Data model decisions:
--   • programs     — the 8-week journey instance (one active at a time)
--   • pods         — 8 pods × 6 members + 1 PA per program
--   • pod_members  — membership join table (Members + PAs, all in profiles)
--       program_id is denormalised onto pod_members so we can enforce
--       "one pod per user per program" with a simple unique index.
--       A BEFORE INSERT trigger auto-fills it from pods.program_id.
--   • sessions     — gains pod_id FK for pod_gathering type sessions
--   • check_ins    — single table for both guide (type='guide') and
--       pod (type='pod') check-ins (spec: mood_score, note, program_week)
--       anticipated in migration 002 comment: check_ins.type
--
-- RLS note: pod_members has a self-referential SELECT policy.
--   To avoid infinite recursion we use a SECURITY DEFINER helper
--   function (my_pod_id()) instead of an inline subquery.
-- ============================================================


-- ── 1. Programs ───────────────────────────────────────────────────

CREATE TABLE programs (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  start_date   DATE        NOT NULL,
  end_date     DATE        NOT NULL,
  cohort_size  INTEGER     NOT NULL DEFAULT 48,
  status       TEXT        NOT NULL DEFAULT 'draft'
                           CHECK (status IN ('draft', 'active', 'completed')),
  created_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read active programs
CREATE POLICY "Anyone can view active programs"
  ON programs FOR SELECT TO authenticated
  USING (status = 'active');

-- PM can read all (including draft/completed)
CREATE POLICY "PM can view all programs"
  ON programs FOR SELECT TO authenticated
  USING (public.my_staff_role() = 'program_manager');

-- SA can read all
CREATE POLICY "SA can view all programs"
  ON programs FOR SELECT TO authenticated
  USING (public.my_staff_role() = 'support_agent');

-- PM can create/edit/delete
CREATE POLICY "PM can manage programs"
  ON programs FOR ALL TO authenticated
  USING  (public.my_staff_role() = 'program_manager')
  WITH CHECK (public.my_staff_role() = 'program_manager');


-- ── 2. Pods ───────────────────────────────────────────────────────

CREATE TABLE pods (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id   UUID        NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  display_name TEXT        NOT NULL,
  avatar_url   TEXT,
  hero_url     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX pods_program_idx ON pods (program_id);

ALTER TABLE pods ENABLE ROW LEVEL SECURITY;

-- Helper: return current user's pod_id without triggering RLS recursion
-- (SECURITY DEFINER so it bypasses RLS on pod_members)
CREATE OR REPLACE FUNCTION public.my_pod_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT pod_id FROM public.pod_members WHERE user_id = auth.uid() LIMIT 1
$$;

-- Members/PAs can see their own pod
CREATE POLICY "Members can view their own pod"
  ON pods FOR SELECT TO authenticated
  USING (id = public.my_pod_id());

-- Guides can see pods that contain their assigned members
CREATE POLICY "Guides can view pods of their members"
  ON pods FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.pod_members   pm
      JOIN public.guide_assignments ga
        ON ga.member_id = pm.user_id AND ga.is_active = true
      WHERE pm.pod_id = id
        AND ga.guide_id = auth.uid()
    )
  );

-- PM and SA can see all pods
CREATE POLICY "PM and SA can view all pods"
  ON pods FOR SELECT TO authenticated
  USING (public.my_staff_role() IN ('program_manager', 'support_agent'));

-- PM can manage pods
CREATE POLICY "PM can manage pods"
  ON pods FOR ALL TO authenticated
  USING  (public.my_staff_role() = 'program_manager')
  WITH CHECK (public.my_staff_role() = 'program_manager');


-- ── 3. Pod Members ────────────────────────────────────────────────

CREATE TABLE pod_members (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pod_id      UUID        NOT NULL REFERENCES pods(id)              ON DELETE CASCADE,
  -- program_id is denormalised from pods to allow a simple unique index
  program_id  UUID        NOT NULL REFERENCES programs(id)          ON DELETE CASCADE,
  -- user_id references profiles because both Members and PAs live there
  user_id     UUID        NOT NULL REFERENCES public.profiles(id)   ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'member'
                          CHECK (role IN ('member', 'peer_ambassador')),
  joined_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Enforce data integrity
CREATE UNIQUE INDEX pod_members_unique_user_pod
  ON pod_members (pod_id, user_id);

CREATE UNIQUE INDEX pod_members_one_pod_per_program
  ON pod_members (user_id, program_id);

-- Only one Peer Ambassador per pod
CREATE UNIQUE INDEX pod_members_one_pa_per_pod
  ON pod_members (pod_id)
  WHERE role = 'peer_ambassador';

CREATE INDEX pod_members_pod_idx     ON pod_members (pod_id);
CREATE INDEX pod_members_user_idx    ON pod_members (user_id);
CREATE INDEX pod_members_program_idx ON pod_members (program_id);

-- Auto-fill program_id from pods on INSERT / pod_id UPDATE
CREATE OR REPLACE FUNCTION public.fill_pod_member_program_id()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  SELECT program_id INTO NEW.program_id
  FROM public.pods WHERE id = NEW.pod_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER pod_members_fill_program_id
  BEFORE INSERT OR UPDATE OF pod_id ON pod_members
  FOR EACH ROW EXECUTE FUNCTION public.fill_pod_member_program_id();

ALTER TABLE pod_members ENABLE ROW LEVEL SECURITY;

-- Members/PAs use my_pod_id() to avoid self-referential recursion
CREATE POLICY "Users can view members in their own pod"
  ON pod_members FOR SELECT TO authenticated
  USING (pod_id = public.my_pod_id());

-- Guides can view members in pods that contain their assigned members
CREATE POLICY "Guides can view pod members of their assigned members"
  ON pod_members FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.guide_assignments ga
      WHERE ga.member_id = user_id
        AND ga.guide_id  = auth.uid()
        AND ga.is_active = true
    )
  );

-- PM and SA can view all
CREATE POLICY "PM and SA can view all pod members"
  ON pod_members FOR SELECT TO authenticated
  USING (public.my_staff_role() IN ('program_manager', 'support_agent'));

-- PM can manage all pod members
CREATE POLICY "PM can manage pod members"
  ON pod_members FOR ALL TO authenticated
  USING  (public.my_staff_role() = 'program_manager')
  WITH CHECK (public.my_staff_role() = 'program_manager');


-- ── 4. Add pod_id to sessions ─────────────────────────────────────
-- Needed for pod_gathering session type (type already in CHECK constraint)

ALTER TABLE sessions
  ADD COLUMN pod_id UUID REFERENCES pods(id) ON DELETE SET NULL;

CREATE INDEX sessions_pod_idx ON sessions (pod_id, scheduled_at);

-- Members can now also find their pod sessions
CREATE POLICY "Members can view sessions for their pod"
  ON sessions FOR SELECT TO authenticated
  USING (pod_id = public.my_pod_id());


-- ── 5. Check-ins ──────────────────────────────────────────────────
-- Single table for both guide check-ins (type='guide') and
-- pod check-ins (type='pod'). Anticipated in migration 002 comment.

CREATE TABLE check_ins (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  type          TEXT        NOT NULL CHECK (type IN ('guide', 'pod')),
  member_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Exactly one of guide_id / pod_id must be set, enforced by constraint below
  guide_id      UUID        REFERENCES public.staff_profiles(id)    ON DELETE SET NULL,
  pod_id        UUID        REFERENCES pods(id)                      ON DELETE SET NULL,
  mood_score    INTEGER     NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  note          TEXT,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  program_week  INTEGER     NOT NULL CHECK (program_week BETWEEN 1 AND 8),

  CONSTRAINT check_ins_target_matches_type CHECK (
    (type = 'guide' AND guide_id IS NOT NULL AND pod_id IS NULL) OR
    (type = 'pod'   AND pod_id   IS NOT NULL AND guide_id IS NULL)
  )
);

CREATE INDEX check_ins_member_idx ON check_ins (member_id, submitted_at);
CREATE INDEX check_ins_guide_idx  ON check_ins (guide_id,  submitted_at);
CREATE INDEX check_ins_pod_idx    ON check_ins (pod_id,    submitted_at);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Members can read and submit their own check-ins
CREATE POLICY "Members can view own check-ins"
  ON check_ins FOR SELECT TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can submit check-ins"
  ON check_ins FOR INSERT TO authenticated
  WITH CHECK (member_id = auth.uid());

-- Guides can read check-ins submitted to them
CREATE POLICY "Guides can view their check-ins"
  ON check_ins FOR SELECT TO authenticated
  USING (guide_id = auth.uid());

-- PAs can read pod check-ins for their pod
CREATE POLICY "PA can view their pod check-ins"
  ON check_ins FOR SELECT TO authenticated
  USING (
    type = 'pod'
    AND pod_id = public.my_pod_id()
    AND EXISTS (
      SELECT 1 FROM public.pod_members
      WHERE pod_id   = check_ins.pod_id
        AND user_id  = auth.uid()
        AND role     = 'peer_ambassador'
    )
  );

-- PM and SA can read all
CREATE POLICY "PM and SA can view all check-ins"
  ON check_ins FOR SELECT TO authenticated
  USING (public.my_staff_role() IN ('program_manager', 'support_agent'));
