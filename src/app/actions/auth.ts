"use server";

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthState = { error: string } | null;

/** Determine where to send a user after a successful sign-in. */
async function resolveHomeRoute(userId: string): Promise<string> {
  const supabase = await createServerClient();

  const { data: memberProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  // Member or Peer Ambassador → Soul Seated app
  if (memberProfile) return "/home";

  // Everyone else → Staff portal
  return "/staff/dashboard";
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email:    formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };

  const destination = await resolveHomeRoute(data.user.id);
  redirect(destination);
}

function validatePassword(password: string): string | null {
  if (password.length < 12)             return "密碼長度至少需要 12 個字元。";
  if (!/[A-Z]/.test(password))          return "密碼必須包含至少一個大寫字母。";
  if (!/[a-z]/.test(password))          return "密碼必須包含至少一個小寫字母。";
  if (!/[0-9]/.test(password))          return "密碼必須包含至少一個數字。";
  if (/^[A-Za-z0-9]+$/.test(password))  return "密碼必須包含至少一個符號（如 !@#$%^&*）。";
  return null;
}

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password") as string;
  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signUp({
    email:    formData.get("email") as string,
    password,
    options: {
      // No user_type → trigger writes to profiles as 'member'
      data: { display_name: formData.get("name") as string },
    },
  });
  if (error) return { error: error.message };

  redirect("/home");
}

export async function logout() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
