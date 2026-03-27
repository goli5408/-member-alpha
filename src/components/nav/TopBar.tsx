"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  CalendarDays,
  UserRound,
  SlidersHorizontal,
  LifeBuoy,
  ChevronRight,
  LogOut,
} from "lucide-react";

const MENU_ITEMS = [
  {
    href: "/schedule",
    label: "Schedule",
    Icon: CalendarDays,
    description: "Upcoming sessions & events",
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: UserRound,
    description: "Edit your name, bio & vibe",
  },
  {
    href: "/settings",
    label: "Preferences",
    Icon: SlidersHorizontal,
    description: "Notifications & availability",
  },
  {
    href: "/support",
    label: "Support",
    Icon: LifeBuoy,
    description: "Get help from the team",
  },
] as const;

// Mock member data
const MEMBER = { name: "Jordan", pronouns: "they/them", vibe: "🌱" };

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const pathname        = usePathname();

  function close() { setOpen(false); }

  return (
    <>
      {/* ── Fixed top bar ─────────────────────────────── */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-30 flex items-center justify-between px-4 bg-[--color-background]/90 backdrop-blur-md border-b border-[--color-border]"
        style={{ maxWidth: "var(--max-mobile-width)", height: "var(--top-bar-height)" }}
      >
        <span className="text-sm font-bold tracking-tight text-[--color-brand-600]">
          Soul Seated
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[--color-neutral-100] transition active:scale-95"
        >
          <Menu size={20} className="text-[--color-foreground]" />
        </button>
      </div>

      {/* ── Backdrop ──────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* ── Drawer (constrained to app shell) ─────────── */}
      <div
        className="fixed top-0 z-50 h-full pointer-events-none"
        style={{
          left:  "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "var(--max-mobile-width)",
        }}
      >
        <div
          className={[
            "absolute top-0 right-0 h-full w-4/5 max-w-xs bg-[--color-surface] shadow-2xl pointer-events-auto",
            "transition-transform duration-300 ease-in-out flex flex-col",
            open ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 pt-12 pb-5 border-b border-[--color-border]">
            {/* Member summary */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[--color-brand-100] flex items-center justify-center text-xl">
                {MEMBER.vibe}
              </div>
              <div>
                <p className="text-sm font-semibold text-[--color-foreground]">
                  {MEMBER.name}
                </p>
                <p className="text-xs text-[--color-muted]">{MEMBER.pronouns}</p>
              </div>
            </div>
            <button
              onClick={close}
              className="w-8 h-8 rounded-full bg-[--color-neutral-100] flex items-center justify-center hover:bg-[--color-neutral-200] transition"
              aria-label="Close menu"
            >
              <X size={15} className="text-[--color-muted]" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto py-3">
            {MENU_ITEMS.map(({ href, label, Icon, description }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={[
                    "flex items-center gap-4 px-5 py-4 transition",
                    active
                      ? "bg-[--color-brand-50]"
                      : "hover:bg-[--color-neutral-50]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                      active
                        ? "bg-[--color-brand-600]"
                        : "bg-[--color-neutral-100]",
                    ].join(" ")}
                  >
                    <Icon
                      size={18}
                      className={active ? "text-white" : "text-[--color-neutral-500]"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={[
                        "text-sm font-semibold",
                        active ? "text-[--color-brand-600]" : "text-[--color-foreground]",
                      ].join(" ")}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-[--color-muted] truncate">{description}</p>
                  </div>
                  <ChevronRight size={15} className="text-[--color-border] shrink-0" />
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="border-t border-[--color-border] p-5">
            <button className="flex items-center gap-3 w-full text-sm font-medium text-[--color-error] hover:opacity-80 transition">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
