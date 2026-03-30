import Link from "next/link";
import {
  Leaf,
  Video,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
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
  description: "Start your day centered and present with this gentle breathing practice.",
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
    <div className="pb-8 md:max-w-4xl md:mx-auto md:px-8">

      {/* ── Hero ─────────────────────────────────────────────
          Brand spec p.25: "purple should remain dominant"
          Beige → lavender → medium purple (all dark-text safe)
      ──────────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pt-6 pb-10"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Decorative blobs — purple presence without blocking text */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,153,237,0.28) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 w-32 h-32 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(128,152,249,0.15) 0%, transparent 70%)" }}
        />

        {/* Greeting + week badge */}
        <div className="relative flex items-start justify-between gap-3">
          <Greeting name={MEMBER_NAME} />
          <Link
            href={`/program/${CURRENT_WEEK}`}
            className="shrink-0 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.55)",
              color: "#8370d4",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(167,153,237,0.30)",
            }}
          >
            Week {CURRENT_WEEK} of 8 <ChevronRight size={10} />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="relative mt-5 space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold" style={{ color: "#5e4eb8" }}>
            <span>Journey progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(131,112,212,0.18)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #8370d4 0%, #5e4eb8 100%)",
              }}
            />
          </div>
        </div>
      </header>

      <div className="px-4 mt-6 md:grid md:grid-cols-2 md:gap-6">

        {/* ── Left column: Today's Practice + Next Up ─── */}
        <div className="space-y-6">

        {/* ── Today's Practice ─────────────────────────────────
            Collage card (p.33): layered blobs, large radius,
            brand gradient, noise texture for tactile feel.
        ──────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            Today&apos;s Practice
          </h2>

          <Link
            href="/practice"
            className="relative block overflow-hidden rounded-[24px] p-6 active:scale-[0.98] transition-transform zine-card-purple soft-raise"
            style={{ background: "var(--gradient-practice)" }}
          >
            {/* Collage blobs */}
            <div aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.30) 0%, transparent 70%)" }} />
            <div aria-hidden className="pointer-events-none absolute bottom-4 right-6 w-20 h-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(128,152,249,0.20) 0%, transparent 70%)" }} />
            <div aria-hidden className="pointer-events-none absolute -bottom-4 -left-4 w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle, rgba(167,153,237,0.18) 0%, transparent 70%)" }} />

            {/* Icon badge */}
            <div
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)" }}
            >
              <Leaf size={24} style={{ color: "#8370d4" }} />
            </div>

            {/* Type + duration */}
            <div className="relative flex items-center gap-2 mb-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,0.55)", color: "#8370d4" }}
              >
                {TODAY_PRACTICE.type}
              </span>
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(65,70,81,0.70)" }}>
                <Clock size={11} />
                {TODAY_PRACTICE.duration}
              </span>
            </div>

            {/* Title — display font for key brand moments */}
            <h3 className="font-display relative text-[18px] font-bold leading-snug mb-2" style={{ color: "#414651" }}>
              {TODAY_PRACTICE.title}
            </h3>

            {/* Description */}
            <p className="relative text-sm leading-relaxed mb-5" style={{ color: "rgba(65,70,81,0.75)" }}>
              {TODAY_PRACTICE.description}
            </p>

            {/* CTA */}
            <div className="relative flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: "#8370d4" }}>Begin Practice</span>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)" }}
              >
                <ArrowRight size={18} style={{ color: "#8370d4" }} />
              </div>
            </div>
          </Link>
        </section>

        {/* ── Next Up ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
              Next Up
            </h2>
            <Link href="/schedule" className="text-xs font-medium" style={{ color: "#a799ed" }}>
              View schedule
            </Link>
          </div>

          <Link
            href={UPCOMING_EVENT.href}
            className="rounded-3xl p-4 flex items-center gap-4 active:scale-[0.99] transition-transform block zine-card soft-raise"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#ebe5fb" }}>
              <UPCOMING_EVENT.Icon size={18} style={{ color: "#a799ed" }} />
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
              <span
                className="shrink-0 rounded-2xl px-3 py-1.5 text-xs font-semibold"
                style={{ background: "#a799ed", color: "#2d1f70" }}
              >
                Join
              </span>
            )}
          </Link>
        </section>

        </div>{/* end left column */}

        {/* ── Right column: Your Journey + Check-in nudge ── */}
        <div className="space-y-6 mt-6 md:mt-0">

        {/* ── Your Journey ────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            Your Journey
          </h2>

          {/* Week strip — collage pill tiles */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {PROGRAM_WEEKS.map(({ week, theme, status }) => (
              <Link
                key={week}
                href={`/program/${week}`}
                className={[
                  "shrink-0 flex flex-col items-center gap-1.5 rounded-[18px] px-3 py-3 w-[72px] transition active:scale-95",
                ].join(" ")}
                style={
                  status === "current"
                    ? {
                        background: "linear-gradient(160deg, #c4b8f5 0%, #8370d4 100%)",
                        boxShadow: "0 4px 16px rgba(131,112,212,0.30)",
                      }
                    : status === "done"
                    ? { background: "#ebe5fb", border: "1px solid #d5ccf8" }
                    : { background: "var(--color-surface)", border: "1px solid var(--color-border)" }
                }
              >
                {status === "done" ? (
                  <CheckCircle2 size={16} style={{ color: "#a799ed" }} />
                ) : (
                  <span className="text-xs font-bold" style={{ color: status === "current" ? "#fff" : "var(--color-neutral-400)" }}>
                    W{week}
                  </span>
                )}
                <span
                  className="text-[10px] text-center leading-tight font-medium"
                  style={{
                    color: status === "current" ? "rgba(255,255,255,0.90)"
                          : status === "done"    ? "#a799ed"
                          : "var(--color-neutral-400)",
                  }}
                >
                  {theme}
                </span>
              </Link>
            ))}
          </div>

          {/* Current week focus */}
          <div
            className="mt-3 rounded-3xl p-4 zine-card soft-raise"
            style={{ borderLeft: "3px solid #a799ed" }}
          >
            <p className="text-[11px] text-[--color-muted] uppercase tracking-wide mb-1">
              This week&apos;s focus
            </p>
            <p className="font-semibold text-[--color-foreground]">
              Week {CURRENT_WEEK} — {currentWeekData.theme}
            </p>
            <p className="text-sm text-[--color-muted] mt-1.5 leading-relaxed">
              Exploring what it means to belong — in your Pod, your community, and yourself.
            </p>
            <Link
              href={`/program/${CURRENT_WEEK}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#a799ed" }}
            >
              Week {CURRENT_WEEK} details <ChevronRight size={13} />
            </Link>
          </div>
        </section>

        {/* ── Check-in nudge ───────────────────────────────── */}
        <Link
          href="/guide"
          className="flex items-center gap-3 rounded-3xl p-4 active:scale-[0.99] transition-transform block soft-raise"
          style={{
            background: "linear-gradient(135deg, #f5f2fe 0%, #ede5fb 100%)",
            border: "1px solid #d5ccf8",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl"
            style={{ background: "rgba(167,153,237,0.15)" }}
          >
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
          <Sparkles size={16} style={{ color: "#a799ed" }} className="shrink-0" />
        </Link>

        </div>{/* end right column */}

      </div>
    </div>
  );
}
