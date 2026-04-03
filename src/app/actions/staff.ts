"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type StaffRole =
  | "guide"
  | "program_manager"
  | "content_manager"
  | "support_agent";

export type InviteState = { error: string } | { success: true } | null;

/**
 * Invite a new staff member via email.
 * Only Program Managers may call this action.
 * The invited user receives an email with a magic link.
 * On click, handle_new_user trigger routes them to staff_profiles.
 */
export async function inviteStaff(
  _prevState: InviteState,
  formData: FormData
): Promise<InviteState> {
  // 1. Verify caller is a Program Manager
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: caller } = await supabase
    .from("staff_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (caller?.role !== "program_manager") {
    return { error: "Only Program Managers can invite staff." };
  }

  // 2. Validate inputs
  const email       = (formData.get("email") as string)?.trim();
  const displayName = (formData.get("display_name") as string)?.trim();
  const role        = formData.get("role") as StaffRole;

  if (!email || !displayName || !role) {
    return { error: "Email, display name, and role are all required." };
  }

  const validRoles: StaffRole[] = [
    "guide",
    "program_manager",
    "content_manager",
    "support_agent",
  ];
  if (!validRoles.includes(role)) {
    return { error: "Invalid role." };
  }

  // 3. Send invite via Admin API
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      user_type:    "staff",
      staff_role:   role,
      display_name: displayName,
      invited_by:   user.id,
    },
    // After clicking the invite link, user lands on /auth/confirm
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
  });

  if (error) return { error: error.message };

  revalidatePath("/staff/members");
  return { success: true };
}

/**
 * Deactivate a staff member's account (preserves all historical data).
 * Only Program Managers may call this action.
 */
export async function deactivateStaff(
  staffId: string
): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: caller } = await supabase
    .from("staff_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (caller?.role !== "program_manager") {
    return { error: "Only Program Managers can deactivate staff." };
  }

  const { error } = await supabase
    .from("staff_profiles")
    .update({ is_active: false })
    .eq("id", staffId);

  if (error) return { error: error.message };

  revalidatePath("/staff/members");
  return {};
}
