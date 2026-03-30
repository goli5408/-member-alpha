"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Dot, ChevronRight, CalendarDays, Sparkles } from "lucide-react";
import { PROGRAM_WEEKS } from "@/lib/mock/program";

const WEEK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  done:     { bg: "bg-[--color-accent-100]",  text: "text-[--color-accent-500]",  border: "border-[--color-accent-200]" },
  current:  { bg: "bg-[--color-brand-600]",   text: "text-white",                 border: "border-[--color-brand-600]" },
  upcoming: { bg: "bg-[--color-surface]",     text: "text-[--color-neutral-400]", border: "border-[--color-border]" },
};

export default function ProgramPage() {
  const currentWeek = PROGRAM_WEEKS.find((w) => w.status === "current")!;
  const doneCount   = PROGRAM_WEEKS.filter((w) => w.status === "done").length;

  return (
    <div className="pb-10 md:max-w-2xl md:mx-auto md:px-8">
      {/* ── Hero ───────────────────────────────────────────── */}
      <header
        className="px-5 pt-6 pb-8"
        style={{ background: "linear-gradient(145deg, #e0d3f1 0%, #caa4d4 60%, #b3c9af 100%)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[--color-brand-700] mb-1">
          8-Week Journey
        </p>
        <h1 className="text-2xl font-bold text-[--color-foreground]">Your Program</h1>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] text-[--color-brand-700]">
            <span>{doneCount} of 8 weeks complete</span>
            <span>{Math.round((doneCount / 8) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-white/70 transition-all"
              style={{ width: `${(doneCount / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Current week pill */}
        <Link
          href={`/program/${currentWeek.week}`}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 px-4 py-2 text-sm font-semibold text-[--color-brand-700]"
        >
          <Sparkles size={14} />
          Now: Week {currentWeek.week} — {currentWeek.theme}
          <ChevronRight size={14} />
        </Link>
      </header>

      {/* ── Timeline ───────────────────────────────────────── */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-4">
          Timeline
        </h2>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[--color-border]" />

          <ol className="space-y-3">
            {PROGRAM_WEEKS.map((week) => {
              const c = WEEK_COLORS[week.status];
              const activitiesTotal = week.activities.length;
              const activitiesDone  = week.activities.filter((a) => a.completed).length;

              return (
                <li key={week.week}>
                  <Link
                    href={`/program/${week.week}`}
                    className={[
                      "flex items-start gap-4 rounded-2xl border p-4 transition active:scale-[0.99]",
                      week.status === "current"
                        ? "bg-[--color-brand-50] border-[--color-brand-300]"
                        : week.status === "done"
                        ? "bg-[--color-surface] border-[--color-border]"
                        : "bg-[--color-surface] border-[--color-border] opacity-60",
                    ].join(" ")}
                  >
                    {/* Node icon */}
                    <div
                      className={[
                        "shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 border-2",
                        c.bg, c.border,
                      ].join(" ")}
                    >
                      {week.status === "done" ? (
                        <CheckCircle2 size={18} className={c.text} />
                      ) : week.status === "current" ? (
                        <span className="text-xs font-bold text-white">W{week.week}</span>
                      ) : (
                        <span className={`text-xs font-semibold ${c.text}`}>W{week.week}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={[
                            "text-[11px] font-semibold uppercase tracking-wide mb-0.5",
                            week.status === "done"   ? "text-[--color-accent-500]"
                            : week.status === "current" ? "text-[--color-brand-600]"
                            : "text-[--color-neutral-400]",
                          ].join(" ")}>
                            Week {week.week}
                          </p>
                          <p className={[
                            "text-sm font-bold leading-tight",
                            week.status === "upcoming" ? "text-[--color-neutral-400]" : "text-[--color-foreground]",
                          ].join(" ")}>
                            {week.theme}
                          </p>
                          <p className="text-xs text-[--color-muted] mt-0.5 italic">{week.tagline}</p>
                        </div>
                        <ChevronRight size={15} className="text-[--color-border] shrink-0 mt-1" />
                      </div>

                      {/* Activity progress */}
                      {week.status !== "upcoming" && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[--color-border] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${week.status === "done" ? "bg-[--color-accent-400]" : "bg-[--color-brand-600]"}`}
                              style={{ width: `${(activitiesDone / activitiesTotal) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[--color-muted] shrink-0">
                            {activitiesDone}/{activitiesTotal}
                          </span>
                        </div>
                      )}

                      {/* Live session date */}
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[--color-muted]">
                        <CalendarDays size={11} />
                        <span>{week.liveSession.date} · {week.liveSession.time}</span>
                        {week.liveSession.completed && (
                          <span className="ml-1 text-[--color-accent-500] font-semibold">· Recorded</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
