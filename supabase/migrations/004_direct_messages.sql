-- ============================================================
-- Migration 004: Rename guide_messages → direct_messages
--
-- Rationale: Guide, Peer Ambassador, and Support Agent all need
-- async messaging with Members.  The table is no longer
-- guide-specific so we give it a generic name.
--
-- PostgreSQL keeps all existing policies, indexes, and FK
-- constraints attached when a table is renamed; we only need
-- to rename the index separately.
-- ============================================================

ALTER TABLE guide_messages RENAME TO direct_messages;

ALTER INDEX guide_messages_conversation_idx
  RENAME TO direct_messages_conversation_idx;
