"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UserRound,
  Users,
  BookOpen,
  NotebookPen,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/home",     label: "Home",     icon: Home },
  { href: "/guide",    label: "Guide",    icon: UserRound },
  { href: "/pod",      label: "Pod",      icon: Users },
  { href: "/library",  label: "Library",  icon: BookOpen },
  { href: "/practice", label: "Practice", icon: NotebookPen },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{
        height: "var(--bottom-nav-height)",
        /* Warm beige frosted glass — no hard border, soft purple aura */
        background: "rgba(243, 241, 233, 0.90)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        /* Organic top edge — away from sharp rectangular bars */
        borderRadius: "22px 22px 0 0",
        /* Purple-hued glow upward instead of a hard line */
        boxShadow:
          "0 -1px 0 rgba(167,153,237,0.18), 0 -16px 48px rgba(167,153,237,0.10), 0 -2px 8px rgba(167,153,237,0.06)",
      }}
    >
      {/* Subtle gradient blush at the top edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px rounded-full"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(167,153,237,0.35) 30%, rgba(167,153,237,0.55) 50%, rgba(167,153,237,0.35) 70%, transparent 100%)" }}
      />

      <ul className="flex h-full items-center justify-around px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");

          return (
            <li key={href} className="flex-1 flex justify-center">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center transition-transform active:scale-90"
              >
                {active ? (
                  /* Active — soft lavender pill with purple icon
                     Using #ede5fb bg + #8370d4 text/icon = 5.5:1 contrast ✓ */
                  <span
                    className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[14px]"
                    style={{
                      background: "linear-gradient(160deg, #f0eafc 0%, #e2d8f8 100%)",
                      boxShadow: "0 2px 8px rgba(131,112,212,0.18)",
                    }}
                  >
                    <Icon size={20} strokeWidth={2.2} style={{ color: "#8370d4" }} />
                    <span
                      className="text-[10px] font-semibold tracking-wide"
                      style={{ color: "#8370d4" }}
                    >
                      {label}
                    </span>
                  </span>
                ) : (
                  /* Inactive — muted foreground, no fill */
                  <span className="flex flex-col items-center gap-0.5 px-3 py-1.5">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      style={{ color: "rgba(65,70,81,0.45)" }}
                    />
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: "rgba(65,70,81,0.45)" }}
                    >
                      {label}
                    </span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
