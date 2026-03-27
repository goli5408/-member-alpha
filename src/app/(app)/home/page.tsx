import Link from "next/link";
import {
  Leaf,
  Video,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import Greeting from "@/components/ui/Greeting";

// ── Mock data ────────────────────────────────────────────────────
const MEMBER_NAME = "Jordan";
const CURRENT_WEEK = 3;

const PROGRAM_WEEKS = [
  { week: 1, theme: "Foundations",      status: "done" },
  { week: 2, theme: "Identity & Roots", status: "done" },
  { week: 3, theme: "Community",        status: "current" },
  { week: 4, theme: "Purpose",          status: "upcoming" },
  { week: 5, theme: "Resilience",       status: "upcoming" },
  { week: 6, theme: "Connection",       status: "upcoming" },
  { week: 7, theme: "Vision",           status: "upcoming" },
  { week: 8, theme: "Integration",      status: "upcoming" },
] as const;

const TODAY_PRACTICE = {
  type: "Breathwork",
  title: "Morning Grounding Meditation",
  duration: "10 min",
  description:
    "Start your day centered and present with this gentle breathing practice.",
};

const UPCOMING_EVENT = {
  Icon: Video,
  type: "1:1 with Guide",
  title: "Check-in with Maya",
  date: "Today",
  time: "3:00 PM",
  href: "/guide",
  joinable: true,
};
// ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const currentWeekData = PROGRAM_WEEKS[CURRENT_WEEK - 1];
  const progressPct = Math.round(((CURRENT_WEEK - 1) / 8) * 100);

  return (
    <div className="pb-8">

      {/* ── Hero header ─────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pt-6 pb-8"
        style={{ background: "linear-gradient(145deg, #e0d3f1 0%, #caa4d4 60%, #b3c9af 100%)" }}
      >
        {/* Content */}
        <div className="relative flex items-start justify-between gap-3">
          <Greeting name={MEMBER_NAME} />
          <Link
            href={`/program/${CURRENT_WEEK}`}
            className="shrink-0 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 px-3 py-1 text-xs font-semibold text-[--color-brand-700] flex items-center gap-1"
          >
            Week {CURRENT_WEEK} of 8
            <ChevronRight size={11} />
          </Link>
        </div>

        {/* Progress */}
        <div className="relative mt-5 space-y-1.5">
          <div className="flex justify-between text-[11px] text-[--color-brand-700]">
            <span>Journey progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full rounded-full bg-white/70 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <div className="px-4 space-y-6 mt-6">

        {/* ── Today's Practice (full card link) ─────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            Today&apos;s Practice
          </h2>

          <Link
            href="/guide"
            className="relative block overflow-hidden rounded-3xl p-6 active:scale-[0.98] transition-transform"
            style={{ background: "linear-gradient(135deg, #c9ddc5 0%, #97b591 100%)" }}
          >
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20" />
            <div className="pointer-events-none absolute bottom-0 right-8 w-16 h-16 rounded-full bg-[--color-accent-400]/30" />

            {/* Icon badge */}
            <div className="relative w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center mb-5">
              <Leaf size={24} className="text-[--color-accent-500]" />
            </div>

            {/* Type + duration */}
            <div className="relative flex items-center gap-2 mb-2">
              <span className="rounded-full bg-white/50 px-2.5 py-0.5 text-[11px] font-semibold text-[--color-accent-500] uppercase tracking-wider">
                {TODAY_PRACTICE.type}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[--color-foreground]/70">
                <Clock size={11} />
                {TODAY_PRACTICE.duration}
              </span>
            </div>

            {/* Title */}
            <h3 className="relative text-[17px] font-bold text-[--color-foreground] leading-snug mb-2">
              {TODAY_PRACTICE.title}
            </h3>

            {/* Description */}
            <p className="relative text-sm text-[--color-foreground]/70 leading-relaxed mb-5">
              {TODAY_PRACTICE.description}
            </p>

            {/* CTA row */}
            <div className="relative flex items-center justify-between">
              <span className="text-sm font-bold text-[--color-accent-500]">Begin Practice</span>
              <div className="w-9 h-9 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                <ArrowRight size={18} className="text-[--color-accent-500]" />
              </div>
            </div>
          </Link>
        </section>

        {/* ── Next Up ───────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
              Next Up
            </h2>
            <Link href="/schedule" className="text-xs font-medium text-[--color-brand-600]">
              View schedule
            </Link>
          </div>

          <Link
            href={UPCOMING_EVENT.href}
            className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 flex items-center gap-4 hover:border-[--color-brand-300] transition block active:scale-[0.99]"
          >
            <div className="w-11 h-11 rounded-xl bg-[--color-brand-100] flex items-center justify-center shrink-0">
              <UPCOMING_EVENT.Icon size={18} className="text-[--color-brand-600]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[--color-muted] uppercase tracking-wide">{UPCOMING_EVENT.type}</p>
              <p className="text-sm font-semibold text-[--color-foreground] truncate mt-0.5">
                {UPCOMING_EVENT.title}
              </p>
              <p className="text-xs text-[--color-muted] mt-0.5">
                {UPCOMING_EVENT.date} · {UPCOMING_EVENT.time}
              </p>
            </div>
            {UPCOMING_EVENT.joinable && (
              <span className="shrink-0 rounded-xl bg-[--color-brand-600] px-3 py-1.5 text-xs font-semibold text-white">
                Join
              </span>
            )}
          </Link>
        </section>

        {/* ── Your Journey ──────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            Your Journey
          </h2>

          {/* Week strip */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {PROGRAM_WEEKS.map(({ week, theme, status }) => (
              <Link
                key={week}
                href={`/program/${week}`}
                className={[
                  "shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3 w-[72px]",
                  status === "current"
                    ? "bg-[--color-brand-600]"
                    : status === "done"
                    ? "bg-[--color-accent-100] border border-[--color-accent-200]"
                    : "bg-[--color-surface] border border-[--color-border]",
                ].join(" ")}
              >
                {status === "done" ? (
                  <CheckCircle2 size={16} className="text-[--color-accent-400]" />
                ) : (
                  <span className={`text-xs font-bold ${status === "current" ? "text-white" : "text-[--color-neutral-300]"}`}>
                    W{week}
                  </span>
                )}
                <span className={[
                  "text-[10px] text-center leading-tight font-medium",
                  status === "current" ? "text-white"
                    : status === "done" ? "text-[--color-accent-500]"
                    : "text-[--color-neutral-400]",
                ].join(" ")}>
                  {theme}
                </span>
              </Link>
            ))}
          </div>

          {/* Current week focus */}
          <div className="mt-3 rounded-2xl border border-[--color-border] bg-[--color-surface] p-4">
            <p className="text-[11px] text-[--color-muted] uppercase tracking-wide mb-1">
              This week&apos;s focus
            </p>
            <p className="font-semibold text-[--color-foreground]">
              Week {CURRENT_WEEK} — {currentWeekData.theme}
            </p>
            <p className="text-sm text-[--color-neutral-600] mt-1.5 leading-relaxed">
              Exploring what it means to belong — in your Pod, your community, and yourself.
            </p>
            <Link
              href={`/program/${CURRENT_WEEK}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[--color-brand-600]"
            >
              Week {CURRENT_WEEK} details <ChevronRight size={13} />
            </Link>
          </div>
        </section>

        {/* ── Check-in nudge ────────────────────────────── */}
        <Link
          href="/guide"
          className="flex items-center gap-3 rounded-2xl border border-dashed border-[--color-brand-300] bg-[--color-brand-50] p-4 active:scale-[0.99] transition-transform block"
        >
          <div className="w-10 h-10 rounded-full bg-[--color-brand-100] flex items-center justify-center shrink-0 text-xl">
            🌿
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[--color-foreground]">
              How are you feeling today?
            </p>
            <p className="text-xs text-[--color-muted]">
              Share a check-in with your Guide.
            </p>
          </div>
          <ChevronRight size={16} className="text-[--color-brand-300] shrink-0" />
        </Link>

      </div>
    </div>
  );
}
