"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  CalendarDays,
  FileText,
  Headphones,
  Video,
  NotebookPen,
  Users,
  Lock,
  Sparkles,
  MessageSquareQuote,
} from "lucide-react";
import { PROGRAM_WEEKS, WeekActivity } from "@/lib/mock/program";

const ACTIVITY_ICON: Record<WeekActivity["type"], React.ElementType> = {
  text:     FileText,
  audio:    Headphones,
  video:    Video,
  practice: NotebookPen,
  pod:      Users,
};

const ACTIVITY_COLOR: Record<WeekActivity["type"], string> = {
  text:     "bg-[--color-brand-100] text-[--color-brand-600]",
  audio:    "bg-[--color-accent-100] text-[--color-accent-500]",
  video:    "bg-[--color-brand-50] text-[--color-brand-600]",
  practice: "bg-amber-50 text-amber-600",
  pod:      "bg-teal-50 text-teal-600",
};

export default function WeekProgramPage({ params }: { params: Promise<{ week: string }> }) {
  const { week: weekParam } = use(params);
  const router = useRouter();
  const weekNum = parseInt(weekParam, 10);
  const weekData = PROGRAM_WEEKS.find((w) => w.week === weekNum);

  if (!weekData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-3">
        <p className="text-lg font-semibold text-[--color-foreground]">Week not found</p>
        <Link href="/program" className="text-sm text-[--color-brand-600] font-medium">
          ← Back to Program
        </Link>
      </div>
    );
  }

  const isLocked  = weekData.status === "upcoming";
  const isCurrent = weekData.status === "current";
  const isDone    = weekData.status === "done";
  const prevWeek  = weekNum > 1 ? weekNum - 1 : null;
  const nextWeek  = weekNum < 8 ? weekNum + 1 : null;

  const activitiesDone = weekData.activities.filter((a) => a.completed).length;
  const progressPct    = Math.round((activitiesDone / weekData.activities.length) * 100);

  const headerGradient = isDone
    ? "linear-gradient(145deg, #c9ddc5 0%, #97b591 100%)"
    : isCurrent
    ? "linear-gradient(145deg, #e0d3f1 0%, #caa4d4 60%, #b3c9af 100%)"
    : "linear-gradient(145deg, #ede9f2 0%, #ddd0eb 100%)";

  return (
    <div className="pb-10">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="relative px-5 pt-6 pb-8" style={{ background: headerGradient }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-medium text-[--color-brand-700] mb-4"
        >
          <ChevronLeft size={14} />
          Program
        </button>

        {/* Status badge */}
        <span className={[
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider mb-3",
          isDone    ? "bg-[--color-accent-200]/50 text-[--color-accent-500]"
          : isCurrent ? "bg-white/50 text-[--color-brand-700]"
          : "bg-white/30 text-[--color-neutral-400]",
        ].join(" ")}>
          {isDone ? <CheckCircle2 size={11} /> : isCurrent ? <Sparkles size={11} /> : <Lock size={11} />}
          {isDone ? "Completed" : isCurrent ? "Current week" : "Upcoming"}
        </span>

        <p className="text-sm font-semibold text-[--color-brand-700]">Week {weekData.week} of 8</p>
        <h1 className="text-2xl font-bold text-[--color-foreground] mt-0.5">{weekData.theme}</h1>
        <p className="text-sm text-[--color-foreground]/70 mt-1 italic">{weekData.tagline}</p>

        {/* Progress */}
        {!isLocked && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-[--color-brand-700]">
              <span>{activitiesDone} of {weekData.activities.length} activities done</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/70 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <div className="px-4 mt-6 space-y-6">

        {/* ── Week navigation ──────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {PROGRAM_WEEKS.map((w) => (
            <Link
              key={w.week}
              href={`/program/${w.week}`}
              className={[
                "shrink-0 flex flex-col items-center gap-1 rounded-2xl px-3 py-2.5 w-[64px] transition",
                w.week === weekNum ? "btn-soft-on" : "btn-soft",
                w.status === "upcoming" && w.week !== weekNum ? "opacity-50" : "",
              ].join(" ")}
            >
              {w.status === "done" ? (
                <CheckCircle2 size={14} className="opacity-80" />
              ) : (
                <span className="text-[11px] font-bold opacity-90">
                  W{w.week}
                </span>
              )}
              <span className="text-[9px] text-center leading-tight font-medium opacity-80">
                {w.theme.split(" ")[0]}
              </span>
            </Link>
          ))}
        </div>

        {/* ── Objectives ───────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            This Week&apos;s Objectives
          </h2>
          <ul className="space-y-2">
            {weekData.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[--color-foreground]">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[--color-brand-100] flex items-center justify-center text-[10px] font-bold text-[--color-brand-600]">
                  {i + 1}
                </span>
                {obj}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Live Session ─────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            Live Session
          </h2>
          <div className={[
            "rounded-2xl border p-4 flex items-center gap-4",
            weekData.liveSession.completed
              ? "bg-[--color-surface] border-[--color-border]"
              : isCurrent
              ? "bg-[--color-brand-50] border-[--color-brand-300]"
              : "bg-[--color-surface] border-[--color-border] opacity-60",
          ].join(" ")}>
            <div className={[
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
              weekData.liveSession.completed ? "bg-[--color-accent-100]" : "bg-[--color-brand-100]",
            ].join(" ")}>
              <CalendarDays
                size={20}
                className={weekData.liveSession.completed ? "text-[--color-accent-500]" : "text-[--color-brand-600]"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[--color-foreground] truncate">
                {weekData.liveSession.title}
              </p>
              <p className="text-xs text-[--color-muted] mt-0.5">
                {weekData.liveSession.date} · {weekData.liveSession.time}
              </p>
              <p className="text-xs text-[--color-muted]">with {weekData.liveSession.facilitator}</p>
            </div>
            {weekData.liveSession.completed ? (
              <span className="shrink-0 text-xs font-semibold text-[--color-accent-500] bg-[--color-accent-100] rounded-lg px-2.5 py-1">
                Watch
              </span>
            ) : isCurrent ? (
              <span className="shrink-0 text-xs font-semibold text-white bg-[--color-brand-600] rounded-lg px-2.5 py-1">
                Join
              </span>
            ) : (
              <Lock size={14} className="text-[--color-neutral-300] shrink-0" />
            )}
          </div>
        </section>

        {/* ── Activities ───────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            Activities
          </h2>
          <ul className="space-y-2.5">
            {weekData.activities.map((activity, i) => {
              const Icon      = ACTIVITY_ICON[activity.type];
              const colorCls  = ACTIVITY_COLOR[activity.type];
              const accessible = !isLocked;

              return (
                <li key={i}>
                  <div
                    className={[
                      "flex items-center gap-3 rounded-2xl border p-3.5 transition",
                      activity.completed
                        ? "bg-[--color-surface] border-[--color-border]"
                        : accessible
                        ? "bg-[--color-surface] border-[--color-border]"
                        : "bg-[--color-surface] border-[--color-border] opacity-50",
                    ].join(" ")}
                  >
                    {/* Type icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                      <Icon size={16} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={[
                        "text-sm font-medium truncate",
                        activity.completed ? "text-[--color-muted] line-through" : "text-[--color-foreground]",
                      ].join(" ")}>
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[--color-muted] capitalize">{activity.type}</span>
                        {activity.duration && (
                          <>
                            <span className="text-[--color-border]">·</span>
                            <span className="text-[10px] text-[--color-muted]">{activity.duration}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* State */}
                    {isLocked ? (
                      <Lock size={14} className="text-[--color-neutral-300] shrink-0" />
                    ) : activity.completed ? (
                      <CheckCircle2 size={18} className="text-[--color-accent-500] shrink-0" />
                    ) : (
                      <Circle size={18} className="text-[--color-border] shrink-0" />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Reflection ───────────────────────────────────── */}
        {!isLocked && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
              Closing Reflection
            </h2>
            <div className="rounded-2xl border border-dashed border-[--color-brand-300] bg-[--color-brand-50] p-5">
              <MessageSquareQuote size={20} className="text-[--color-brand-400] mb-3" />
              <p className="text-sm font-medium text-[--color-foreground] leading-relaxed italic">
                &ldquo;{weekData.reflection}&rdquo;
              </p>
              <Link
                href="/practice"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[--color-brand-600]"
              >
                Journal this <ChevronRight size={12} />
              </Link>
            </div>
          </section>
        )}

        {/* ── Prev / Next ──────────────────────────────────── */}
        <div className="flex gap-3">
          {prevWeek && (
            <Link
              href={`/program/${prevWeek}`}
              className="flex-1 flex items-center gap-2 rounded-2xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm font-medium text-[--color-foreground]"
            >
              <ChevronLeft size={15} className="text-[--color-muted]" />
              <div className="min-w-0">
                <p className="text-[10px] text-[--color-muted] uppercase tracking-wide">Previous</p>
                <p className="truncate text-sm font-semibold">
                  {PROGRAM_WEEKS[prevWeek - 1].theme}
                </p>
              </div>
            </Link>
          )}
          {nextWeek && (
            <Link
              href={`/program/${nextWeek}`}
              className={[
                "flex-1 flex items-center justify-end gap-2 rounded-2xl border px-4 py-3 text-sm font-medium",
                PROGRAM_WEEKS[nextWeek - 1].status === "upcoming"
                  ? "border-[--color-border] bg-[--color-surface] text-[--color-neutral-400] opacity-60"
                  : "border-[--color-brand-300] bg-[--color-brand-50] text-[--color-foreground]",
              ].join(" ")}
            >
              <div className="min-w-0 text-right">
                <p className="text-[10px] text-[--color-muted] uppercase tracking-wide">Next</p>
                <p className="truncate text-sm font-semibold">
                  {PROGRAM_WEEKS[nextWeek - 1].theme}
                </p>
              </div>
              <ChevronRight size={15} className="text-[--color-muted]" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
