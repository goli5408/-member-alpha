import BottomNav from "@/components/nav/BottomNav";
import TopBar from "@/components/nav/TopBar";
import SideNav from "@/components/nav/SideNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh" style={{ background: "var(--color-background)" }}>
      <SideNav />
      <div id="app-shell" className="md:ml-[240px]">
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
    </div>
  );
}
