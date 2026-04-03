import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getGuideData, getMessages } from "@/app/actions/guide";
import GuideClient from "@/components/guide/GuideClient";

export default async function GuidePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch member name for chat avatar initials
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const [guideData, messages] = await Promise.all([
    getGuideData(),
    getMessages(),
  ]);

  // Derive initials for the member's chat bubble (e.g. "Brook Lee" → "BL")
  const name = profile?.display_name ?? "";
  const memberInitials = name
    .split(" ")
    .filter(Boolean)
    .map((w: string) => w[0].toUpperCase())
    .slice(0, 2)
    .join("") || "ME";

  return (
    <GuideClient
      userId={user.id}
      memberInitials={memberInitials}
      guideData={guideData}
      initialMessages={messages}
    />
  );
}
