"use client";

import { useState } from "react";
import {
  CalendarDays,
  Globe,
  Bell,
  Smartphone,
  Mail,
  Moon,
  Lock,
  FileText,
  Shield,
  ChevronRight,
  LogOut,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────
const SECTIONS = [
  {
    title: "Communication",
    items: [
      { label: "1:1 Availability",   Icon: CalendarDays, value: "Weekdays",     iconBg: "rgba(128,152,249,0.18)", iconColor: "#5060c8" },
      { label: "Timezone",           Icon: Globe,        value: "EST (GMT-5)",   iconBg: "rgba(128,152,249,0.18)", iconColor: "#5060c8" },
    ],
  },
  {
    title: "Notifications",
    items: [
      { label: "Notification Frequency", Icon: Bell,        value: "Daily",   iconBg: "rgba(253,226,116,0.28)", iconColor: "#8a6a00" },
      { label: "Push Notifications",     Icon: Smartphone,  value: "On",      iconBg: "rgba(253,226,116,0.28)", iconColor: "#8a6a00" },
      { label: "Email Reminders",        Icon: Mail,        value: "Weekly",  iconBg: "rgba(253,226,116,0.28)", iconColor: "#8a6a00" },
      { label: "Quiet Hours",            Icon: Moon,        value: "10 PM – 7 AM", iconBg: "rgba(253,226,116,0.28)", iconColor: "#8a6a00" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Change Password", Icon: Lock,     value: "", iconBg: "rgba(167,153,237,0.18)", iconColor: "#8370d4" },
      { label: "Terms of Service", Icon: FileText, value: "", iconBg: "rgba(167,153,237,0.18)", iconColor: "#8370d4" },
      { label: "Privacy Policy",   Icon: Shield,  value: "", iconBg: "rgba(167,153,237,0.18)", iconColor: "#8370d4" },
    ],
  },
] as const;

export default function SettingsPage() {
  const [_dummy, setDummy] = useState(false); // keep client for future interactivity

  return (
    <div className="pb-10">

      {/* ── Hero header ──────────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pt-6 pb-8"
        style={{ background: "linear-gradient(160deg, #f3f1e9 0%, #fef8e0 60%, #fdf0b0 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(253,226,116,0.35) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 w-24 h-24 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(253,200,80,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8a6a00" }}>
            Soul Seated
          </p>
          <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: "#414651" }}>
            Preferences
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(65,70,81,0.70)" }}>
            Notifications &amp; availability
          </p>
        </div>
      </header>

      {/* ── Sections ─────────────────────────────────────────── */}
      <div className="px-4 mt-5 space-y-6">
        {SECTIONS.map(({ title, items }) => (
          <section key={title}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
              {title}
            </h2>
            <div className="space-y-2">
              {items.map(({ label, Icon, value, iconBg, iconColor }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-4 rounded-2xl p-4 transition active:scale-[0.99] zine-card soft-raise text-left"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: iconBg }}
                  >
                    <Icon size={17} style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[--color-foreground]">{label}</p>
                    {value && (
                      <p className="text-xs text-[--color-muted] mt-0.5">{value}</p>
                    )}
                  </div>
                  <ChevronRight size={15} style={{ color: "rgba(167,153,237,0.55)" }} className="shrink-0" />
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* ── Sign out ─────────────────────────────────────── */}
        <button
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition active:scale-[0.98]"
          style={{
            background: "rgba(200,53,56,0.06)",
            border: "1px solid rgba(200,53,56,0.18)",
            color: "var(--color-error)",
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>

    </div>
  );
}
