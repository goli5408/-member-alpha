-- ============================================================
-- Migration 003: Guide feature
--   • Extend staff_profiles with pronouns + focus_areas
--   • guide_assignments  — member ↔ guide relationship
--   • sessions           — 1:1 sessions (type='1on1' now; pod/live later)
--   • guide_messages     — direct messaging between member and guide
--   • RLS allowing members to read their assigned guide's profile
-- ============================================================

-- ── 1. Extend staff_profiles ─────────────────────────────────────
ALTER TABLE staff_profiles
  ADD COLUMN IF NOT EXISTS pronouns     TEXT,
  ADD COLUMN IF NOT EXISTS focus_areas  TEXT[] NOT NULL DEFAULT '{}';

-- ── 2. Guide assignments ──────────────────────────────────────────
CREATE TABLE guide_assignments (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id   UUID        NOT NULL REFERENCES public.profiles(id)       ON DELETE CASCADE,
  guide_id    UUID        NOT NULL REFERENCES public.staff_profiles(id)  ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active   BOOLEAN     NOT NULL DEFAULT true
);

-- Enforce only one *active* assignment per member
CREATE UNIQUE INDEX guide_assignments_one_active_per_member
  ON guide_assignments (member_id)
  WHERE is_active = true;

ALTER TABLE guide_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own guide assignment"
  ON guide_assignments FOR SELECT TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Guides can view their assignments"
  ON guide_assignments FOR SELECT TO authenticated
  USING (guide_id = auth.uid());

CREATE POLICY "PM can manage guide assignments"
  ON guide_assignments FOR ALL TO authenticated
  USING  (public.my_staff_role() = 'program_manager')
  WITH CHECK (public.my_staff_role() = 'program_manager');

-- ── 3. Allow members to read their assigned guide's staff profile ─
-- (depends on guide_assignments existing — ordered after step 2)
CREATE POLICY "Members can view assigned guide profile"
  ON staff_profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.guide_assignments ga
      WHERE ga.guide_id  = id
        AND ga.member_id = auth.uid()
        AND ga.is_active = true
    )
  );

-- ── 4. Sessions ───────────────────────────────────────────────────
CREATE TABLE sessions (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  type             TEXT        NOT NULL DEFAULT '1on1'
                               CHECK (type IN ('1on1', 'pod_gathering', 'live_group')),
  guide_id         UUID        REFERENCES public.staff_profiles(id) ON DELETE SET NULL,
  member_id        UUID        REFERENCES public.profiles(id)       ON DELETE CASCADE,
  title            TEXT        NOT NULL,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER     NOT NULL DEFAULT 30,
  status           TEXT        NOT NULL DEFAULT 'upcoming'
                               CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  meeting_url      TEXT,
  week_number      INTEGER,
  notes            TEXT,   -- visible to guide only (enforced via RLS SELECT)
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX sessions_member_idx ON sessions (member_id, scheduled_at);
CREATE INDEX sessions_guide_idx  ON sessions (guide_id,  scheduled_at);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Member sees their own sessions (notes column excluded via a view later if needed)
CREATE POLICY "Members can view own sessions"
  ON sessions FOR SELECT TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Guides can view their sessions"
  ON sessions FOR SELECT TO authenticated
  USING (guide_id = auth.uid());

CREATE POLICY "Guides can update their sessions"
  ON sessions FOR UPDATE TO authenticated
  USING (guide_id = auth.uid());

CREATE POLICY "PM can manage all sessions"
  ON sessions FOR ALL TO authenticated
  USING  (public.my_staff_role() = 'program_manager')
  WITH CHECK (public.my_staff_role() = 'program_manager');

-- ── 5. Guide messages ─────────────────────────────────────────────
CREATE TABLE guide_messages (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content      TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 4000),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at      TIMESTAMPTZ
);

-- Efficiently fetch all messages for a conversation (order-independent pair)
CREATE INDEX guide_messages_conversation_idx
  ON guide_messages (
    LEAST(sender_id, recipient_id),
    GREATEST(sender_id, recipient_id),
    created_at
  );

ALTER TABLE guide_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON guide_messages FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages as themselves"
  ON guide_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Recipients can mark messages as read (set read_at, nothing else)
CREATE POLICY "Recipients can mark messages read"
  ON guide_messages FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());
