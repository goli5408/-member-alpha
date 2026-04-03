"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  CheckSquare,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

// ── Nav ───────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/pa/dashboard", label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/pa/pod",       label: "My Pod",      Icon: Users           },
  { href: "/pa/messages",  label: "Messages",    Icon: MessageCircle   },
  { href: "/pa/checkins",  label: "Check-ins",   Icon: CheckSquare     },
  { href: "/pa/settings",  label: "Settings",    Icon: Settings        },
] as const;

// ── Props ─────────────────────────────────────────────────────────

export interface PAProp {
  id:        string;
  name:      string;
  avatarUrl: string | null;
  email:     string;
  pronouns:  string | null;
}

// ── Component ─────────────────────────────────────────────────────

export default function PAShell({
  pa,
  children,
}: {
  pa: PAProp;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{ background: "#f4f4f5" }}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col shrink-0 sticky top-0 h-screen"
        style={{ width: 240, background: "#ffffff", borderRight: "1px solid #e4e4e7" }}
      >
        {/* Brand */}
        <div
          className="px-5 h-14 flex items-center gap-3 shrink-0"
          style={{ borderBottom: "1px solid #e4e4e7" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #ffd5b4 0%, #ff9c60 100%)" }}
          >
            P
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold" style={{ color: "#18181b" }}>PA Portal</p>
            <p className="text-[11px]"           style={{ color: "#a1a1aa" }}>Peer Ambassador</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                style={
                  active
                    ? { background: "#fff4ec", color: "#c06020", fontWeight: 600 }
                    : { color: "#52525b", fontWeight: 400 }
                }
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.5 : 2}
                  style={{ color: active ? "#c06020" : "#71717a", flexShrink: 0 }}
                />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={13} style={{ color: "#ff9c60", flexShrink: 0 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 px-4 pb-4 pt-3 space-y-3" style={{ borderTop: "1px solid #e4e4e7" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #ffd5b4 0%, #ff9c60 100%)" }}
            >
              {pa.avatarUrl
                ? <img src={pa.avatarUrl} alt="" className="w-full h-full object-cover" />
                : pa.name.charAt(0).toUpperCase()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#18181b" }}>{pa.name}</p>
              <p className="text-[11px] truncate"           style={{ color: "#a1a1aa" }}>{pa.email}</p>
            </div>
          </div>

          <span
            className="inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: "#fff4ec", color: "#c06020" }}
          >
            Peer Ambassador
          </span>
          {pa.pronouns && (
            <p className="text-[11px]" style={{ color: "#a1a1aa" }}>{pa.pronouns}</p>
          )}

          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-red-50"
              style={{ color: "#dc2626" }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header
          className="h-14 shrink-0 flex items-center px-8 gap-4"
          style={{ background: "#ffffff", borderBottom: "1px solid #e4e4e7" }}
        >
          <h1 className="text-sm font-semibold flex-1" style={{ color: "#18181b" }}>
            {NAV_ITEMS.find(i => pathname.startsWith(i.href))?.label ?? "PA Portal"}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
