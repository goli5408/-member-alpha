"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Video, CalendarDays, Clock, Send, Sparkles, Star } from "lucide-react";
import { sendMessage } from "@/app/actions/guide";
import type { GuideData, GuideMessage } from "@/app/actions/guide";

// ── Helpers ───────────────────────────────────────────────────────

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatSessionTime(iso: string, durationMinutes: number): string {
  const start = new Date(iso);
  const end   = new Date(start.getTime() + durationMinutes * 60_000);
  const fmt   = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth()    === now.getMonth()    &&
         d.getDate()     === now.getDate();
}

/** Return a human-readable date label for a message timestamp. */
function dateLabelFor(iso: string): string {
  if (isToday(iso)) return "Today";
  const d = new Date(iso);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

// ── No Guide state ────────────────────────────────────────────────

function NoGuide() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4 pb-16">
      <div
        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl"
        style={{ background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)" }}
      >
        🌿
      </div>
      <div>
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: "#414651" }}>
          Your guide is coming
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
          A peer guide will be assigned to you soon. You'll get a notification when they're ready to connect.
        </p>
      </div>
    </div>
  );
}

// ── Guide avatar ──────────────────────────────────────────────────

function GuideAvatar({
  name,
  size = "md",
}: {
  name: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm" ? "w-8 h-8 text-xs"
    : size === "lg" ? "w-16 h-16 text-base"
    : "w-10 h-10 text-sm";
  return (
    <div
      className={`${dims} rounded-2xl flex items-center justify-center font-bold shrink-0`}
      style={{ background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)", color: "#6b3a1f" }}
    >
      {initials(name)}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────

interface Props {
  userId:          string;
  memberInitials:  string;
  guideData:       GuideData;
  initialMessages: GuideMessage[];
}

// ── Component ─────────────────────────────────────────────────────

export default function GuideClient({
  userId,
  memberInitials,
  guideData,
  initialMessages,
}: Props) {
  const { guide, upcomingSession, pastSessions } = guideData;

  const [tab, setTab]         = useState<"guide" | "chat">("guide");
  const [messages, setMessages] = useState<GuideMessage[]>(initialMessages);
  const [draft, setDraft]     = useState("");
  const [isPending, startTransition] = useTransition();
  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab === "chat") endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);

  function handleSend() {
    const text = draft.trim();
    if (!text || isPending) return;
    setDraft("");

    // Optimistic message
    const tempMsg: GuideMessage = {
      id:         `temp-${Date.now()}`,
      sender_id:  userId,
      content:    text,
      created_at: new Date().toISOString(),
      read_at:    null,
    };
    setMessages((prev) => [...prev, tempMsg]);

    startTransition(async () => {
      try {
        await sendMessage(text);
      } catch {
        // Remove optimistic message and restore draft on error
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        setDraft(text);
      }
    });
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "calc(100dvh - var(--top-bar-height) - var(--bottom-nav-height))" }}
    >

      {/* ── Hero header ─────────────────────────────────────── */}
      <header
        className="relative shrink-0 overflow-hidden px-5 pt-6 pb-5"
        style={{ background: "var(--gradient-guide)" }}
      >
        <div aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,156,96,0.22) 0%, transparent 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 w-24 h-24 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(253,226,116,0.18) 0%, transparent 70%)" }} />

        <div className="relative flex items-center gap-4">
          <GuideAvatar name={guide?.display_name ?? null} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#c06020" }}>
              Your Guide
            </p>
            <h1 className="font-display text-xl font-bold leading-tight" style={{ color: "#414651" }}>
              {guide?.display_name ?? "—"}
            </h1>
            {guide?.pronouns && (
              <p className="text-xs mt-0.5" style={{ color: "rgba(65,70,81,0.65)" }}>
                {guide.pronouns}
              </p>
            )}
          </div>
          {guide && (
            <div
              className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1"
              style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)" }}
            >
              <Star size={11} fill="#ff9c60" style={{ color: "#ff9c60" }} />
              <span className="text-xs font-bold" style={{ color: "#c06020" }}>New</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div
        className="shrink-0 flex gap-3 px-4 py-3"
        style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}
      >
        {(["guide", "chat"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-2xl py-2.5 text-sm font-medium outline-none transition active:scale-[0.97]"
            style={
              tab === t
                ? { background: "linear-gradient(160deg, #ffd5b4 0%, #ff9c60 100%)", color: "#5c2d00", boxShadow: "0 2px 10px rgba(255,156,96,0.30)" }
                : { background: "#fde8d5", color: "#c06020" }
            }
          >
            {t === "guide" ? "Guide" : "Messages"}
          </button>
        ))}
      </div>

      {/* ══ GUIDE TAB ══════════════════════════════════════════════ */}
      {tab === "guide" && (
        <div className="flex-1 overflow-y-auto pb-8">

          {!guide ? (
            <NoGuide />
          ) : (
            <>
              {/* Upcoming session */}
              <div className="mx-4 mt-4">
                {upcomingSession ? (
                  <div
                    className="relative overflow-hidden rounded-3xl p-5"
                    style={{ background: "linear-gradient(145deg, #8098f9 0%, #6070d8 100%)" }}
                  >
                    <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full"
                      style={{ background: "radial-gradient(circle, rgba(255,255,255,0.20) 0%, transparent 70%)" }} />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-1">
                      Next Session
                    </p>
                    <h2 className="text-[17px] font-bold text-white leading-snug mb-3">
                      {upcomingSession.title}
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.20)" }}>
                          <CalendarDays size={13} className="text-white" />
                        </div>
                        <span className="text-sm text-white/80">
                          {isToday(upcomingSession.scheduled_at) ? "Today" : formatDate(upcomingSession.scheduled_at)}
                          {" · "}
                          {formatSessionTime(upcomingSession.scheduled_at, upcomingSession.duration_minutes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.20)" }}>
                          <Video size={13} className="text-white" />
                        </div>
                        <span className="text-sm text-white/80">1:1 Video Call</span>
                      </div>
                    </div>
                    {upcomingSession.meeting_url && isToday(upcomingSession.scheduled_at) && (
                      <a
                        href={upcomingSession.meeting_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 flex items-center justify-center w-full rounded-2xl bg-white py-3 text-sm font-bold transition active:scale-[0.98]"
                        style={{ color: "#4050c0" }}
                      >
                        Join Now
                      </a>
                    )}
                  </div>
                ) : (
                  <div
                    className="rounded-3xl p-5 text-center"
                    style={{ background: "#fde8d5", border: "1px solid #ffd5b4" }}
                  >
                    <CalendarDays size={22} className="mx-auto mb-2" style={{ color: "#ff9c60" }} />
                    <p className="text-sm font-semibold" style={{ color: "#c06020" }}>No upcoming sessions</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(192,96,32,0.70)" }}>
                      Your guide will schedule your next check-in soon.
                    </p>
                  </div>
                )}
              </div>

              {/* Guide bio */}
              <div className="mx-4 mt-4 rounded-3xl p-5 zine-card soft-raise">
                <p className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
                  About {guide.display_name?.split(" ")[0] ?? "Your Guide"}
                </p>
                <p className="text-sm leading-relaxed text-[--color-foreground]">
                  {guide.bio ?? "Your guide's bio will appear here once they complete their profile."}
                </p>

                {guide.focus_areas.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[--color-muted] mb-2">
                      Focus areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {guide.focus_areas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ background: "#fde8d5", color: "#c06020" }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-4 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold" style={{ color: "#ff9c60" }}>{pastSessions.length}</p>
                    <p className="text-[11px] text-[--color-muted] mt-0.5">Sessions done</p>
                  </div>
                  <div className="w-px" style={{ background: "var(--color-border)" }} />
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold" style={{ color: "#ff9c60" }}>
                      {upcomingSession?.week_number ? `Wk ${upcomingSession.week_number}` : "—"}
                    </p>
                    <p className="text-[11px] text-[--color-muted] mt-0.5">Current week</p>
                  </div>
                </div>
              </div>

              {/* Check-in nudge */}
              <button
                onClick={() => setTab("chat")}
                className="mx-4 mt-4 flex items-center gap-3 rounded-3xl p-4 w-[calc(100%-2rem)] transition active:scale-[0.99] soft-raise"
                style={{ background: "linear-gradient(135deg, #fff8f0 0%, #fde8d5 100%)", border: "1px solid #ffd5b4" }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl"
                  style={{ background: "rgba(255,156,96,0.15)" }}>
                  🌿
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-[--color-foreground]">
                    Send {guide.display_name?.split(" ")[0] ?? "your guide"} a check-in
                  </p>
                  <p className="text-xs text-[--color-muted]">How are you feeling today?</p>
                </div>
                <Sparkles size={16} style={{ color: "#ff9c60" }} className="shrink-0" />
              </button>

              {/* Past sessions */}
              {pastSessions.length > 0 && (
                <div className="px-4 mt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
                    Past Sessions
                  </p>
                  {pastSessions.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-2xl p-4 mb-2 zine-card">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fde8d5" }}>
                        <Video size={15} style={{ color: "#ff9c60" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[--color-foreground] truncate">{s.title}</p>
                        <p className="text-xs text-[--color-muted] mt-0.5">{formatDate(s.scheduled_at)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0" style={{ color: "var(--color-muted)" }}>
                        <Clock size={11} />
                        <span className="text-xs">{s.duration_minutes} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══ CHAT TAB ═══════════════════════════════════════════════ */}
      {tab === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "var(--color-background)" }}>

          {!guide ? (
            <NoGuide />
          ) : (
            <>
              {/* Messages list */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-[--color-muted] mt-10">
                    No messages yet — say hello! 👋
                  </p>
                )}
                {messages.map((msg, idx) => {
                  const fromGuide = msg.sender_id !== userId;
                  const prev      = idx > 0 ? messages[idx - 1] : null;
                  const sameSide  = prev && (prev.sender_id !== userId) === fromGuide;

                  // Date separator when the calendar day changes
                  const showDateSep =
                    !prev ||
                    new Date(msg.created_at).toDateString() !== new Date(prev.created_at).toDateString();

                  return (
                    <div key={msg.id}>
                      {showDateSep && (
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                          <span className="text-[11px] font-medium text-[--color-muted]">
                            {dateLabelFor(msg.created_at)}
                          </span>
                          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                        </div>
                      )}

                      <div className={`flex gap-2 mb-0.5 ${fromGuide ? "flex-row" : "flex-row-reverse"}`}>
                        {/* Avatar slot */}
                        <div className="w-8 shrink-0 self-end mb-1">
                          {fromGuide && !sameSide ? (
                            <GuideAvatar name={guide.display_name} size="sm" />
                          ) : (
                            <div className="w-8" />
                          )}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[75%] flex flex-col ${fromGuide ? "items-start" : "items-end"}`}>
                          <div
                            className="rounded-2xl px-3.5 py-2.5"
                            style={
                              fromGuide
                                ? { background: "var(--color-surface)", border: "1px solid var(--color-border)", borderBottomLeftRadius: "4px" }
                                : { background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)", borderBottomRightRadius: "4px" }
                            }
                          >
                            <p className="text-sm leading-relaxed"
                              style={{ color: fromGuide ? "var(--color-foreground)" : "#5c2d00" }}>
                              {msg.content}
                            </p>
                            <p className="text-[10px] mt-1 text-right"
                              style={{ color: fromGuide ? "var(--color-muted)" : "rgba(92,45,0,0.55)" }}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Input bar */}
              <div
                className="shrink-0 flex items-center gap-2 px-3 py-3"
                style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: "#ebe5fb", color: "#8370d4" }}
                >
                  {memberInitials}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Message ${guide.display_name?.split(" ")[0] ?? "your guide"}…`}
                  className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none transition"
                  style={{
                    background: "var(--color-background)",
                    border:     "1px solid var(--color-border)",
                    color:      "var(--color-foreground)",
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim() || isPending}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 transition active:scale-90"
                  style={{ background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)" }}
                >
                  <Send size={16} style={{ color: "#5c2d00" }} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
