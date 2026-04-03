"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  Calendar,
  HeadphonesIcon,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import type { StaffRole } from "@/app/actions/staff";

// ── Nav items ────────────────────────────────────────────────────
type NavItem = {
  href:        string;
  label:       string;
  Icon:        React.ElementType;
  roles:       StaffRole[]; // empty = all staff
};

const NAV_ITEMS: NavItem[] = [
  { href: "/staff/dashboard", label: "Dashboard",      Icon: LayoutDashboard, roles: [] },
  { href: "/staff/members",   label: "Members",        Icon: Users,           roles: ["guide", "program_manager", "support_agent"] },
  { href: "/staff/pods",      label: "Pods",           Icon: Layers,          roles: ["program_manager"] },
  { href: "/staff/content",   label: "Content Library",Icon: BookOpen,        roles: ["content_manager", "program_manager", "support_agent"] },
  { href: "/staff/program",   label: "Program",        Icon: Calendar,        roles: ["program_manager"] },
  { href: "/staff/support",   label: "Support Queue",  Icon: HeadphonesIcon,  roles: ["support_agent"] },
  { href: "/staff/settings",  label: "Settings",       Icon: Settings,        roles: [] },
];

const ROLE_LABELS: Record<StaffRole, string> = {
  guide:           "Guide",
  program_manager: "Program Manager",
  content_manager: "Content Manager",
  support_agent:   "Support Agent",
};

const ROLE_COLORS: Record<StaffRole, { bg: string; text: string }> = {
  guide:           { bg: "#edf4ff", text: "#2563b0" },
  program_manager: { bg: "#f0ebff", text: "#6c3fd4" },
  content_manager: { bg: "#fff4e6", text: "#a05a00" },
  support_agent:   { bg: "#ecfdf5", text: "#166534" },
};

// ── Component ─────────────────────────────────────────────────────
interface StaffShellProps {
  member: {
    name:      string;
    role:      StaffRole;
    avatarUrl: string | null;
    email:     string;
  };
  children: React.ReactNode;
}

export default function StaffShell({ member, children }: StaffShellProps) {
  const pathname    = usePathname();
  const roleColor   = ROLE_COLORS[member.role];
  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles.length === 0 || item.roles.includes(member.role)
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#f4f4f5" }}>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col shrink-0 sticky top-0 h-screen"
        style={{
          width:       240,
          background:  "#ffffff",
          borderRight: "1px solid #e4e4e7",
        }}
      >
        {/* Brand */}
        <div
          className="px-5 h-14 flex items-center gap-3 shrink-0"
          style={{ borderBottom: "1px solid #e4e4e7" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)" }}
          >
            C
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold" style={{ color: "#18181b" }}>Care Team</p>
            <p className="text-[11px]"           style={{ color: "#a1a1aa" }}>Web Tools</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {visibleItems.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                style={
                  active
                    ? { background: "#f0ebff", color: "#6c3fd4", fontWeight: 600 }
                    : { color: "#52525b", fontWeight: 400 }
                }
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.5 : 2}
                  style={{ color: active ? "#6c3fd4" : "#71717a", flexShrink: 0 }}
                />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={13} style={{ color: "#a799ed", flexShrink: 0 }} />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="shrink-0 px-4 pb-4 pt-3 space-y-3" style={{ borderTop: "1px solid #e4e4e7" }}>
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)" }}
            >
              {member.avatarUrl
                ? <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                : member.name.charAt(0).toUpperCase()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#18181b" }}>
                {member.name}
              </p>
              <p className="text-[11px] truncate" style={{ color: "#a1a1aa" }}>
                {member.email}
              </p>
            </div>
          </div>

          {/* Role badge */}
          <span
            className="inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: roleColor.bg, color: roleColor.text }}
          >
            {ROLE_LABELS[member.role]}
          </span>

          {/* Sign out */}
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

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header
          className="h-14 shrink-0 flex items-center px-8 gap-4"
          style={{ background: "#ffffff", borderBottom: "1px solid #e4e4e7" }}
        >
          <h1 className="text-sm font-semibold flex-1" style={{ color: "#18181b" }}>
            {visibleItems.find(i => pathname.startsWith(i.href))?.label ?? "Care Team"}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
