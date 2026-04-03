"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ─────────────────────────────────────────────────────────

export interface GuideProfile {
  id: string;
  display_name: string | null;
  bio:          string | null;
  avatar_url:   string | null;
  pronouns:     string | null;
  focus_areas:  string[];
}

export interface Session {
  id:               string;
  title:            string;
  scheduled_at:     string;
  duration_minutes: number;
  status:           "upcoming" | "completed" | "cancelled";
  meeting_url:      string | null;
  week_number:      number | null;
}

export interface GuideMessage {
  id:           string;
  sender_id:    string;
  content:      string;
  created_at:   string;
  read_at:      string | null;
}

export interface GuideData {
  guide:           GuideProfile | null;
  upcomingSession: Session | null;
  pastSessions:    Session[];
}

// ── Actions ───────────────────────────────────────────────────────

/** Fetch the current member's assigned guide + sessions. */
export async function getGuideData(): Promise<GuideData> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { guide: null, upcomingSession: null, pastSessions: [] };

  // Assignment + guide profile in one query
  const { data: assignment } = await supabase
    .from("guide_assignments")
    .select(`
      guide_id,
      staff_profiles (
        id, display_name, bio, avatar_url, pronouns, focus_areas
      )
    `)
    .eq("member_id", user.id)
    .eq("is_active", true)
    .single();

  if (!assignment?.staff_profiles) {
    return { guide: null, upcomingSession: null, pastSessions: [] };
  }

  const guide = assignment.staff_profiles as unknown as GuideProfile;

  // Parallel fetch: next upcoming + recent past sessions
  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, title, scheduled_at, duration_minutes, status, meeting_url, week_number")
      .eq("member_id", user.id)
      .eq("type", "1on1")
      .eq("status", "upcoming")
      .order("scheduled_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sessions")
      .select("id, title, scheduled_at, duration_minutes, status, week_number")
      .eq("member_id", user.id)
      .eq("type", "1on1")
      .eq("status", "completed")
      .order("scheduled_at", { ascending: false })
      .limit(10),
  ]);

  return {
    guide,
    upcomingSession: (upcoming as Session | null) ?? null,
    pastSessions:    (past    as Session[] | null) ?? [],
  };
}

/** Fetch all messages in the member ↔ guide conversation. */
export async function getMessages(): Promise<GuideMessage[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: assignment } = await supabase
    .from("guide_assignments")
    .select("guide_id")
    .eq("member_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!assignment) return [];

  const { data: messages } = await supabase
    .from("direct_messages")
    .select("id, sender_id, content, created_at, read_at")
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${assignment.guide_id}),` +
      `and(sender_id.eq.${assignment.guide_id},recipient_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  return (messages as GuideMessage[] | null) ?? [];
}

/** Send a message from the current member to their assigned guide. */
export async function sendMessage(content: string): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) return;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: assignment } = await supabase
    .from("guide_assignments")
    .select("guide_id")
    .eq("member_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!assignment) throw new Error("No guide assigned");

  const { error } = await supabase
    .from("direct_messages")
    .insert({ sender_id: user.id, recipient_id: assignment.guide_id, content: trimmed });

  if (error) throw new Error(error.message);

  revalidatePath("/guide");
}
