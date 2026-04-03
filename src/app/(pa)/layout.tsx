import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import PAShell from "@/components/pa/PAShell";

/**
 * Layout for the Peer Ambassador portal (/pa/*).
 *
 * PAs live in `profiles` (role = 'peer_ambassador'), not `staff_profiles`.
 * This layout verifies that role before rendering any PA route.
 */
export default async function PALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, pronouns, role")
    .eq("id", user.id)
    .single();

  // Only peer ambassadors may access this portal
  if (!profile || profile.role !== "peer_ambassador") {
    redirect("/login");
  }

  return (
    <PAShell
      pa={{
        id:        user.id,
        name:      profile.display_name ?? "Peer Ambassador",
        avatarUrl: profile.avatar_url   ?? null,
        email:     user.email           ?? "",
        pronouns:  profile.pronouns     ?? null,
      }}
    >
      {children}
    </PAShell>
  );
}
