import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Handles email magic links for:
 *   - Staff invitations  (type = 'invite')
 *   - Email confirmation (type = 'signup')
 *   - Password reset     (type = 'recovery')
 *
 * Supabase Auth → Email Templates should use:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type       = searchParams.get("type") as EmailOtpType | null;

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL("/login?error=missing_token", request.url)
    );
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  // After confirming, check which portal the user belongs to.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: memberProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (memberProfile) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Staff invite — first login lands on dashboard
  // (they'll be prompted to complete their profile there)
  return NextResponse.redirect(new URL("/staff/dashboard", request.url));
}
