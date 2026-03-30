import BottomNav from "@/components/nav/BottomNav";
import TopBar from "@/components/nav/TopBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="app-shell">
      <TopBar />
      <main
        className="min-h-dvh overflow-y-auto"
        style={{
          paddingTop:    "var(--top-bar-height)",
          paddingBottom: "var(--bottom-nav-height)",
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
