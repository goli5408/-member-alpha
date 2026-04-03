"use server";

/**
 * Generic direct-messaging actions.
 *
 * Covers all staff roles that need async comms with Members:
 *   • Guide        — messages their assigned members
 *   • Peer Ambassador — messages members in their pod
 *   • Support Agent — can message any member
 *
 * All messages are stored in the `direct_messages` table.
 * The sender/recipient are raw auth.users UUIDs, so this works
 * regardless of whether the user row lives in `profiles` or
 * `staff_profiles`.
 */

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface DirectMessage {
  id:           string;
  sender_id:    string;
  recipient_id: string;
  content:      string;
  created_at:   string;
  read_at:      string | null;
}

export interface ConversationParticipant {
  id:           string;
  display_name: string | null;
  avatar_url:   string | null;
  /** "member" | "peer_ambassador" | "guide" | "program_manager" | "content_manager" | "support_agent" */
  role:         string;
}

// ── Fetch ─────────────────────────────────────────────────────────

/**
 * Return all messages between the current user and `otherUserId`,
 * ordered oldest → newest.
 */
export async function getConversation(
  otherUserId: string
): Promise<DirectMessage[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("direct_messages")
    .select("id, sender_id, recipient_id, content, created_at, read_at")
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  return (data as DirectMessage[] | null) ?? [];
}

/**
 * Mark all unread messages FROM `otherUserId` TO current user as read.
 */
export async function markConversationRead(otherUserId: string): Promise<void> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("direct_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("sender_id", otherUserId)
    .eq("recipient_id", user.id)
    .is("read_at", null);
}

// ── Send ──────────────────────────────────────────────────────────

/**
 * Send a direct message from the current user to `recipientId`.
 * Revalidates the given path on success.
 */
export async function sendDirectMessage(
  recipientId: string,
  content: string,
  revalidate = "/pa/messages"
): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) return;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("direct_messages")
    .insert({ sender_id: user.id, recipient_id: recipientId, content: trimmed });

  if (error) throw new Error(error.message);

  revalidatePath(revalidate);
}

// ── Roster helpers ────────────────────────────────────────────────

/**
 * For a Peer Ambassador: return all Members in their assigned pod.
 * Returns [] when the PA has no pod assignment yet.
 */
export async function getMyPodMembers(): Promise<ConversationParticipant[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // PA pod assignment: look up PA's pod_id, then fetch all other pod_members
  const { data: podMember } = await supabase
    .from("pod_members")
    .select("pod_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!podMember) return [];

  const { data: members } = await supabase
    .from("pod_members")
    .select(`
      profiles (
        id, display_name, avatar_url, role
      )
    `)
    .eq("pod_id", podMember.pod_id)
    .neq("user_id", user.id);   // exclude self

  if (!members) return [];

  return members
    .flatMap((r: { profiles: ConversationParticipant | ConversationParticipant[] | null }) =>
      Array.isArray(r.profiles) ? r.profiles : r.profiles ? [r.profiles] : []
    );
}

/**
 * For a Guide: return all Members assigned to them.
 */
export async function getMyAssignedMembers(): Promise<ConversationParticipant[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: assignments } = await supabase
    .from("guide_assignments")
    .select(`
      profiles (
        id, display_name, avatar_url, role
      )
    `)
    .eq("guide_id", user.id)
    .eq("is_active", true);

  if (!assignments) return [];

  return assignments
    .flatMap((r: { profiles: ConversationParticipant | ConversationParticipant[] | null }) =>
      Array.isArray(r.profiles) ? r.profiles : r.profiles ? [r.profiles] : []
    );
}

/**
 * For a Support Agent: return a paginated list of all Members.
 */
export async function getAllMembers(
  search = "",
  limit = 50
): Promise<ConversationParticipant[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("profiles")
    .select("id, display_name, avatar_url, role")
    .in("role", ["member", "peer_ambassador"])
    .order("display_name")
    .limit(limit);

  if (search.trim()) {
    query = query.ilike("display_name", `%${search.trim()}%`);
  }

  const { data } = await query;
  return (data as ConversationParticipant[] | null) ?? [];
}

/**
 * Count unread messages sent TO the current user across all conversations.
 */
export async function getUnreadCount(): Promise<number> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("direct_messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .is("read_at", null);

  return count ?? 0;
}
