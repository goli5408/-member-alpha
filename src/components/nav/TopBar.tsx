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
    /* blue — contemplative / time */
    iconBg: "rgba(128,152,249,0.18)",
    iconColor: "#5060c8",
    activeBg: "rgba(128,152,249,0.12)",
    activeBorder: "#8098f9",
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: UserRound,
    description: "Edit your name, bio & vibe",
    /* purple — identity */
    iconBg: "rgba(167,153,237,0.18)",
    iconColor: "#8370d4",
    activeBg: "rgba(167,153,237,0.10)",
    activeBorder: "#a799ed",
  },
  {
    href: "/settings",
    label: "Preferences",
    Icon: SlidersHorizontal,
    description: "Notifications & availability",
    /* yellow — warmth */
    iconBg: "rgba(253,226,116,0.28)",
    iconColor: "#8a6a00",
    activeBg: "rgba(253,226,116,0.15)",
    activeBorder: "#fde274",
  },
  {
    href: "/support",
    label: "Support",
    Icon: LifeBuoy,
    description: "Get help from the team",
    /* orange — energising */
    iconBg: "rgba(255,156,96,0.18)",
    iconColor: "#c06020",
    activeBg: "rgba(255,156,96,0.10)",
    activeBorder: "#ff9c60",
  },
] as const;

const MEMBER = { name: "Jordan", pronouns: "they/them", vibe: "🌱" };

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const pathname        = usePathname();

  function close() { setOpen(false); }

  return (
    <>
      {/* ── Fixed top bar ─────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-1/2 -translate-x-1/2 w-full z-30 flex items-center justify-between px-4"
        style={{
          maxWidth: "var(--max-mobile-width)",
          height: "var(--top-bar-height)",
          background: "rgba(243,241,233,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(167,153,237,0.15)",
        }}
      >
        <Link href="/home" className="font-display text-sm font-bold tracking-tight" style={{ color: "#8370d4" }}>
          Soul Seated
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-90"
          style={{ color: "var(--color-foreground)" }}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── Backdrop ──────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(55,40,90,0.35)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
          onClick={close}
        />
      )}

      {/* ── Drawer (constrained to app shell) ─────────────── */}
      <div
        className="fixed top-0 z-50 h-full pointer-events-none"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "var(--max-mobile-width)",
        }}
      >
        <div
          className={[
            "absolute top-0 right-0 h-full w-4/5 max-w-xs pointer-events-auto flex flex-col",
            "transition-transform duration-300 ease-in-out",
            open ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          style={{
            /* Warm beige + noise — same as app shell */
            backgroundColor: "var(--color-background)",
            backgroundImage: "var(--noise-svg)",
            backgroundSize: "200px 200px",
            backgroundBlendMode: "multiply",
            /* Purple aura on left edge */
            boxShadow:
              "-2px 0 0 rgba(167,153,237,0.20), -16px 0 48px rgba(131,112,212,0.14), -4px 0 16px rgba(131,112,212,0.08)",
            borderRadius: "22px 0 0 22px",
          }}
        >
          {/* ── Gradient header area ─────────────────────── */}
          <div
            className="relative overflow-hidden shrink-0 px-5 pt-12 pb-6"
            style={{ background: "var(--gradient-hero)" }}
          >
            {/* Decorative blob */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 w-36 h-36 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(167,153,237,0.28) 0%, transparent 70%)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/4 w-20 h-20 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(128,152,249,0.15) 0%, transparent 70%)" }}
            />

            <div className="relative flex items-center justify-between">
              {/* Member summary */}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(167,153,237,0.25)",
                  }}
                >
                  {MEMBER.vibe}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#414651" }}>
                    {MEMBER.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(65,70,81,0.60)" }}>
                    {MEMBER.pronouns}
                  </p>
                </div>
              </div>

              {/* Close button — frosted glass */}
              <button
                onClick={close}
                aria-label="Close menu"
                className="w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(167,153,237,0.20)",
                  color: "#8370d4",
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Subtle purple rule below header */}
          <div
            className="h-px shrink-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(167,153,237,0.40) 40%, rgba(167,153,237,0.55) 60%, transparent 100%)" }}
          />

          {/* ── Menu items ───────────────────────────────── */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {MENU_ITEMS.map(({ href, label, Icon, description, iconBg, iconColor, activeBg, activeBorder }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition active:scale-[0.98]"
                  style={
                    active
                      ? { background: activeBg, border: `1px solid ${activeBorder}`, borderLeftWidth: "3px" }
                      : { background: "rgba(255,255,255,0.45)", border: "1px solid rgba(167,153,237,0.12)" }
                  }
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: iconBg }}
                  >
                    <Icon size={18} style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: active ? iconColor : "#414651" }}>
                      {label}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--color-muted)" }}>
                      {description}
                    </p>
                  </div>
                  <ChevronRight size={14} style={{ color: "rgba(167,153,237,0.50)" }} className="shrink-0" />
                </Link>
              );
            })}
          </nav>

          {/* ── Sign out ─────────────────────────────────── */}
          <div
            className="shrink-0 px-5 py-5"
            style={{ borderTop: "1px solid rgba(167,153,237,0.15)" }}
          >
            <button
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-95"
              style={{
                background: "rgba(200,53,56,0.06)",
                border: "1px solid rgba(200,53,56,0.15)",
                color: "var(--color-error)",
              }}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
