import BottomNav from "@/components/nav/BottomNav";
import TopBar from "@/components/nav/TopBar";
import { createServerClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let member = { name: "Member", pronouns: "", vibe: "🌱" };
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, pronouns, vibe_emoji")
      .eq("id", user.id)
      .single();
    if (profile) {
      member = {
        name:     profile.display_name ?? "Member",
        pronouns: profile.pronouns ?? "",
        vibe:     profile.vibe_emoji ?? "🌱",
      };
    }
  }

  return (
    /* Warm neutral desktop backdrop — phone frame centred on larger screens */
    <div className="w-full flex justify-center min-h-dvh" style={{ background: "#ddd9cc" }}>
      <div
        id="app-shell"
        className="relative w-full flex flex-col"
        style={{
          maxWidth:  430,
          minHeight: "100dvh",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 48px rgba(0,0,0,0.18)",
        }}
      >
        <TopBar member={member} />
        <main
          className="w-full flex-1"
          style={{
            paddingBottom: "var(--bottom-nav-height)",
          }}
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
