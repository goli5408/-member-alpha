"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ─────────────────────────────────────────────────────────

export interface Program {
  id:          string;
  name:        string;
  start_date:  string;
  end_date:    string;
  cohort_size: number;
  status:      "draft" | "active" | "completed";
}

export interface PodMember {
  id:           string;
  display_name: string | null;
  avatar_url:   string | null;
  pronouns:     string | null;
  vibe_emoji:   string | null;
  vibe_label:   string | null;
  role:         "member" | "peer_ambassador";
}

export interface Pod {
  id:           string;
  display_name: string;
  avatar_url:   string | null;
  hero_url:     string | null;
  program_id:   string;
}

export interface PodWithMembers extends Pod {
  members: PodMember[];
}

export interface PodSession {
  id:               string;
  title:            string;
  scheduled_at:     string;
  duration_minutes: number;
  status:           "upcoming" | "completed" | "cancelled";
  meeting_url:      string | null;
  week_number:      number | null;
}

export interface CheckIn {
  id:           string;
  type:         "guide" | "pod";
  member_id:    string;
  mood_score:   number;
  note:         string | null;
  submitted_at: string;
  program_week: number;
}

// ── Helpers ───────────────────────────────────────────────────────

/** Return the current user's pod membership row, or null. */
async function getMyPodMembership(supabase: Awaited<ReturnType<typeof createServerClient>>, userId: string) {
  const { data } = await supabase
    .from("pod_members")
    .select("pod_id, program_id, role")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

// ── Member / PA actions ───────────────────────────────────────────

/**
 * Return the current user's pod with all its members.
 * Works for both Members (role='member') and PAs (role='peer_ambassador').
 */
export async function getMyPod(): Promise<PodWithMembers | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const membership = await getMyPodMembership(supabase, user.id);
  if (!membership) return null;

  // Fetch pod details
  const { data: pod } = await supabase
    .from("pods")
    .select("id, display_name, avatar_url, hero_url, program_id")
    .eq("id", membership.pod_id)
    .single();

  if (!pod) return null;

  // Fetch all members with their profiles
  const { data: memberRows } = await supabase
    .from("pod_members")
    .select(`
      role,
      profiles (
        id, display_name, avatar_url, pronouns, vibe_emoji, vibe_label
      )
    `)
    .eq("pod_id", membership.pod_id);

  const members: PodMember[] = (memberRows ?? []).flatMap((row) => {
    const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    if (!p) return [];
    return [{
      id:           p.id,
      display_name: p.display_name,
      avatar_url:   p.avatar_url,
      pronouns:     p.pronouns,
      vibe_emoji:   p.vibe_emoji,
      vibe_label:   p.vibe_label,
      role:         row.role as "member" | "peer_ambassador",
    }];
  });

  return { ...pod, members };
}

/**
 * Return the next upcoming session for the current user's pod.
 */
export async function getUpcomingPodSession(): Promise<PodSession | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const membership = await getMyPodMembership(supabase, user.id);
  if (!membership) return null;

  const { data } = await supabase
    .from("sessions")
    .select("id, title, scheduled_at, duration_minutes, status, meeting_url, week_number")
    .eq("pod_id", membership.pod_id)
    .eq("type", "pod_gathering")
    .eq("status", "upcoming")
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (data as PodSession | null) ?? null;
}

/**
 * Return pod check-ins for the current user's pod (PA view).
 * Only returns results when the caller is the pod's Peer Ambassador.
 */
export async function getPodCheckIns(limit = 20): Promise<CheckIn[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const membership = await getMyPodMembership(supabase, user.id);
  if (!membership || membership.role !== "peer_ambassador") return [];

  const { data } = await supabase
    .from("check_ins")
    .select("id, type, member_id, mood_score, note, submitted_at, program_week")
    .eq("pod_id", membership.pod_id)
    .eq("type", "pod")
    .order("submitted_at", { ascending: false })
    .limit(limit);

  return (data as CheckIn[] | null) ?? [];
}

/**
 * Submit a pod check-in from the current member.
 */
export async function submitPodCheckIn(
  moodScore: number,
  programWeek: number,
  note?: string
): Promise<{ error?: string }> {
  if (moodScore < 1 || moodScore > 5) return { error: "mood_score must be 1–5" };
  if (programWeek < 1 || programWeek > 8) return { error: "program_week must be 1–8" };

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const membership = await getMyPodMembership(supabase, user.id);
  if (!membership) return { error: "No pod assigned" };

  const { error } = await supabase.from("check_ins").insert({
    type:         "pod",
    member_id:    user.id,
    pod_id:       membership.pod_id,
    mood_score:   moodScore,
    program_week: programWeek,
    note:         note?.trim() ?? null,
  });

  return error ? { error: error.message } : {};
}

// ── Additional types ──────────────────────────────────────────────

export interface MemberWithPod {
  id:           string;
  display_name: string | null;
  avatar_url:   string | null;
  role:         "member" | "peer_ambassador";
  pod_id:       string | null;
  pod_name:     string | null;
}

// ── Program Manager actions ───────────────────────────────────────

/**
 * Return the currently active program, or null.
 */
export async function getActiveProgram(): Promise<Program | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("programs")
    .select("id, name, start_date, end_date, cohort_size, status")
    .eq("status", "active")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as Program | null) ?? null;
}

/**
 * Return all programs ordered by most recent first.
 */
export async function getPrograms(): Promise<Program[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("programs")
    .select("id, name, start_date, end_date, cohort_size, status")
    .order("start_date", { ascending: false });

  return (data as Program[] | null) ?? [];
}

/**
 * Return all pods (with member counts) for a given program.
 * Intended for PM staff views.
 */
export async function getProgramPods(
  programId: string
): Promise<(Pod & { member_count: number })[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: pods } = await supabase
    .from("pods")
    .select("id, display_name, avatar_url, hero_url, program_id")
    .eq("program_id", programId)
    .order("display_name");

  if (!pods) return [];

  // Fetch member counts in parallel
  const counts = await Promise.all(
    pods.map((pod) =>
      supabase
        .from("pod_members")
        .select("*", { count: "exact", head: true })
        .eq("pod_id", pod.id)
        .then(({ count }) => ({ pod_id: pod.id, count: count ?? 0 }))
    )
  );

  const countMap = Object.fromEntries(counts.map(c => [c.pod_id, c.count]));

  return pods.map((pod) => ({
    ...pod,
    member_count: countMap[pod.id] ?? 0,
  }));
}

/**
 * Assign a member (or PA) to a pod.
 * Caller must be a Program Manager.
 */
export async function assignMemberToPod(
  podId: string,
  userId: string,
  role: "member" | "peer_ambassador" = "member"
): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("pod_members")
    .insert({
      pod_id:  podId,
      user_id: userId,
      role,
      // program_id filled automatically by trigger
    });

  if (error) return { error: error.message };
  revalidatePath("/staff/pods", "layout");
  revalidatePath("/staff/members");
  return {};
}

/**
 * Remove a member from their pod.
 * Caller must be a Program Manager.
 */
export async function removeMemberFromPod(
  podId: string,
  userId: string
): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("pod_members")
    .delete()
    .eq("pod_id", podId)
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/staff/pods", "layout");
  revalidatePath("/staff/members");
  return {};
}

/**
 * Create a new program.
 * Caller must be a Program Manager.
 */
export async function createProgram(
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name       = (formData.get("name") as string)?.trim();
  const start_date = (formData.get("start_date") as string)?.trim();
  const end_date   = (formData.get("end_date") as string)?.trim();
  const cohort_size = parseInt(formData.get("cohort_size") as string, 10) || 48;

  if (!name || !start_date || !end_date) return { error: "Name, start date, and end date are required" };
  if (new Date(end_date) <= new Date(start_date)) return { error: "End date must be after start date" };

  const { data, error } = await supabase
    .from("programs")
    .insert({ name, start_date, end_date, cohort_size, status: "draft", created_by: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/staff/program");
  return { id: data.id };
}

/**
 * Update a program's status (draft → active → completed).
 * Caller must be a Program Manager.
 * Only one program can be active at a time.
 */
export async function updateProgramStatus(
  programId: string,
  status: "draft" | "active" | "completed"
): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // If activating, deactivate any currently active program first
  if (status === "active") {
    await supabase
      .from("programs")
      .update({ status: "completed" })
      .eq("status", "active")
      .neq("id", programId);
  }

  const { error } = await supabase
    .from("programs")
    .update({ status })
    .eq("id", programId);

  if (error) return { error: error.message };
  revalidatePath("/staff/program");
  return {};
}

/**
 * Create a new pod under a program.
 * Caller must be a Program Manager.
 */
export async function createPod(
  programId: string,
  displayName: string
): Promise<{ error?: string; id?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = displayName.trim();
  if (!name) return { error: "Pod name is required" };

  const { data, error } = await supabase
    .from("pods")
    .insert({ program_id: programId, display_name: name })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/staff/pods");
  return { id: data.id };
}

/**
 * Return a pod with all its members — PM view (no membership check).
 */
export async function getPodDetail(podId: string): Promise<PodWithMembers | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: pod } = await supabase
    .from("pods")
    .select("id, display_name, avatar_url, hero_url, program_id")
    .eq("id", podId)
    .single();

  if (!pod) return null;

  const { data: memberRows } = await supabase
    .from("pod_members")
    .select(`
      role,
      profiles (
        id, display_name, avatar_url, pronouns, vibe_emoji, vibe_label
      )
    `)
    .eq("pod_id", podId);

  const members: PodMember[] = (memberRows ?? []).flatMap((row) => {
    const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    if (!p) return [];
    return [{
      id:           p.id,
      display_name: p.display_name,
      avatar_url:   p.avatar_url,
      pronouns:     p.pronouns,
      vibe_emoji:   p.vibe_emoji,
      vibe_label:   p.vibe_label,
      role:         row.role as "member" | "peer_ambassador",
    }];
  });

  return { ...pod, members };
}

/**
 * Return all members/PAs with their pod assignment for a given program.
 * Intended for the PM roster view.
 */
export async function getMembersWithPodStatus(
  programId: string,
  search?: string
): Promise<MemberWithPod[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // 1. All member/PA profiles
  let query = supabase
    .from("profiles")
    .select("id, display_name, avatar_url, role")
    .in("role", ["member", "peer_ambassador"])
    .order("display_name");

  if (search?.trim()) {
    query = query.ilike("display_name", `%${search.trim()}%`);
  }

  const { data: profiles } = await query;
  if (!profiles) return [];

  // 2. Pod assignments for this program
  const { data: assignments } = await supabase
    .from("pod_members")
    .select("user_id, pod_id, pods(display_name)")
    .eq("program_id", programId);

  type AssignmentRow = {
    user_id: string;
    pod_id:  string;
    pods:    { display_name: string } | { display_name: string }[] | null;
  };

  const assignmentMap = Object.fromEntries(
    (assignments as AssignmentRow[] | null ?? []).map((a) => {
      const podName = Array.isArray(a.pods)
        ? (a.pods[0]?.display_name ?? null)
        : (a.pods?.display_name ?? null);
      return [a.user_id, { pod_id: a.pod_id, pod_name: podName }];
    })
  );

  return profiles.map((p) => ({
    id:           p.id,
    display_name: p.display_name,
    avatar_url:   p.avatar_url,
    role:         p.role as "member" | "peer_ambassador",
    pod_id:       assignmentMap[p.id]?.pod_id   ?? null,
    pod_name:     assignmentMap[p.id]?.pod_name ?? null,
  }));
}
