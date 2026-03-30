"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  Library,
  Leaf,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/home",     label: "Home",     Icon: Home },
  { href: "/guide",    label: "Guide",    Icon: BookOpen },
  { href: "/pod",      label: "Pod",      Icon: Users },
  { href: "/library",  label: "Library",  Icon: Library },
  { href: "/practice", label: "Practice", Icon: Leaf },
] as const;

const MEMBER = { name: "Jordan", initials: "JO" };

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex fixed top-0 left-0 h-full w-[240px] flex-col z-40"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5 shrink-0">
        <Link
          href="/home"
          className="font-display text-lg font-bold tracking-tight"
          style={{ color: "#8370d4" }}
        >
          Soul Seated
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition active:scale-[0.98]"
              style={
                active
                  ? {
                      background: "linear-gradient(160deg, #f0eafc 0%, #e2d8f8 100%)",
                      color: "#8370d4",
                      boxShadow: "0 2px 8px rgba(131,112,212,0.12)",
                    }
                  : {
                      color: "var(--color-foreground)",
                    }
              }
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.2 : 1.5}
                style={{ color: active ? "#8370d4" : "rgba(65,70,81,0.55)" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="shrink-0 px-4 py-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "#ebe5fb", color: "#5e4eb8" }}
          >
            {MEMBER.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>
              {MEMBER.name}
            </p>
          </div>
          <Link
            href="/settings"
            aria-label="Settings"
            className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-[--color-brand-100]"
            style={{ color: "rgba(65,70,81,0.50)" }}
          >
            <Settings size={15} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
