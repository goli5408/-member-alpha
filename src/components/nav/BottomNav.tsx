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
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50
                 border-t border-[--color-border] bg-[--color-surface]/95 backdrop-blur-sm"
      style={{ height: "var(--bottom-nav-height)" }}
    >
      <ul className="flex h-full items-center justify-around px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center gap-0.5 py-2 transition-opacity"
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.6}
                  className={active ? "text-[--color-brand]" : "text-[--color-neutral-400]"}
                />
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-[--color-brand]" : "text-[--color-neutral-400]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
