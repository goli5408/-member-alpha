"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  pronouns: string | null;
  hometown: string | null;
  vibe_emoji: string | null;
  vibe_label: string | null;
  avatar_url: string | null;
};

export type ProfileState = { error: string } | { success: true } | null;

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Partial<Profile> = {
    display_name: formData.get("display_name") as string || null,
    bio:          formData.get("bio") as string || null,
    pronouns:     formData.get("pronouns") as string || null,
    hometown:     formData.get("hometown") as string || null,
    vibe_emoji:   formData.get("vibe_emoji") as string || null,
    vibe_label:   formData.get("vibe_label") as string || null,
    avatar_url:   formData.get("avatar_url") as string || null,
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/home");
  return { success: true };
}
