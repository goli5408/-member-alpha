"use client";

import { useState, useRef, useEffect } from "react";
import {
  Video,
  CalendarDays,
  Clock,
  Send,
  Sparkles,
  Star,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
interface GuideMessage {
  id: string;
  fromGuide: boolean;
  text: string;
  time: string;
  dateSep?: string;
}

// ── Mock data ─────────────────────────────────────────────────────
const GUIDE = {
  name: "Maya Chen",
  pronouns: "she/her",
  initials: "MC",
  title: "Peer Guide · Cohort 7",
  bio: "I'm here to walk alongside you — not ahead of you. My work centers on belonging, identity, and the quiet courage it takes to show up fully.",
  focusAreas: ["Belonging", "Identity", "Community", "Resilience"],
  online: true,
  rating: 4.9,
  sessions: 12,
};

const UPCOMING_SESSION = {
  title: "Check-in · Week 3",
  date: "Today",
  time: "3:00 PM – 3:30 PM",
  type: "1:1 Video Call",
  joinable: true,
};

const INIT_MESSAGES: GuideMessage[] = [
  {
    id: "g1", fromGuide: true, dateSep: "Yesterday", time: "4:05 PM",
    text: "Hey Jordan 🌿 Just sent over a reflection prompt for Week 3. No pressure — write as much or as little as feels right.",
  },
  {
    id: "g2", fromGuide: false, time: "4:22 PM",
    text: "Thank you! I've been sitting with the belonging theme a lot. It's bringing up some old stuff.",
  },
  {
    id: "g3", fromGuide: true, time: "4:35 PM",
    text: "That's exactly what it's meant to do. The discomfort is information, not a problem to solve 💜",
  },
  {
    id: "g4", fromGuide: false, time: "9:01 AM",
    text: "I read the essay. The part about fitting in vs. belonging hit really hard.",
  },
  {
    id: "g5", fromGuide: true, dateSep: "Today", time: "9:14 AM",
    text: "How are you feeling going into the session today?",
  },
  {
    id: "g6", fromGuide: false, time: "9:30 AM",
    text: "Nervous but ready. I want to try being more open in the Pod gathering tonight.",
  },
  {
    id: "g7", fromGuide: true, time: "9:33 AM",
    text: "That takes real courage. I'll hold space for you 🌟 See you at 3!",
  },
];

// ── Sub-components ────────────────────────────────────────────────
function GuideAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims =
    size === "sm" ? "w-8 h-8 text-xs"
    : size === "lg" ? "w-16 h-16 text-base"
    : "w-10 h-10 text-sm";
  return (
    <div className={`${dims} rounded-2xl flex items-center justify-center font-bold shrink-0 relative`}
      style={{ background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)", color: "#6b3a1f" }}
    >
      {GUIDE.initials}
      {GUIDE.online && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function GuidePage() {
  const [tab, setTab] = useState<"guide" | "chat">("guide");
  const [messages, setMessages] = useState<GuideMessage[]>(INIT_MESSAGES);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab === "chat") endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `g${Date.now()}`,
        fromGuide: false,
        text,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "calc(100dvh - var(--top-bar-height) - var(--bottom-nav-height))" }}
    >

      {/* ── Hero header ──────────────────────────────────────── */}
      <header
        className="relative shrink-0 overflow-hidden px-5 pt-6 pb-5"
        style={{ background: "var(--gradient-guide)" }}
      >
        {/* Decorative blobs — orange warmth */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,156,96,0.22) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 w-24 h-24 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(253,226,116,0.18) 0%, transparent 70%)" }}
        />

        <div className="relative flex items-center gap-4">
          <GuideAvatar size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#c06020" }}>
              Your Guide
            </p>
            <h1 className="font-display text-xl font-bold leading-tight" style={{ color: "#414651" }}>
              {GUIDE.name}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(65,70,81,0.65)" }}>
              {GUIDE.pronouns} · {GUIDE.title}
            </p>
          </div>
          {/* Rating */}
          <div
            className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1"
            style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)" }}
          >
            <Star size={11} fill="#ff9c60" style={{ color: "#ff9c60" }} />
            <span className="text-xs font-bold" style={{ color: "#c06020" }}>{GUIDE.rating}</span>
          </div>
        </div>
      </header>

      {/* ── Tab bar ──────────────────────────────────────────── */}
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

      {/* ══ GUIDE TAB ════════════════════════════════════════════ */}
      {tab === "guide" && (
        <div className="flex-1 overflow-y-auto pb-8">

          {/* ── Upcoming session card ───────────────────────── */}
          <div className="mx-4 mt-4">
            <div
              className="relative overflow-hidden rounded-3xl p-5"
              style={{ background: "linear-gradient(145deg, #8098f9 0%, #6070d8 100%)" }}
            >
              {/* Blob */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.20) 0%, transparent 70%)" }}
              />

              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-1">
                Next Session
              </p>
              <h2 className="text-[17px] font-bold text-white leading-snug mb-3">
                {UPCOMING_SESSION.title}
              </h2>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.20)" }}>
                    <CalendarDays size={13} className="text-white" />
                  </div>
                  <span className="text-sm text-white/80">{UPCOMING_SESSION.date} · {UPCOMING_SESSION.time}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.20)" }}>
                    <Video size={13} className="text-white" />
                  </div>
                  <span className="text-sm text-white/80">{UPCOMING_SESSION.type}</span>
                </div>
              </div>

              {UPCOMING_SESSION.joinable && (
                <button
                  className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-bold transition active:scale-[0.98]"
                  style={{ color: "#4050c0" }}
                >
                  Join Now
                </button>
              )}
            </div>
          </div>

          {/* ── Guide bio ────────────────────────────────────── */}
          <div className="mx-4 mt-4 rounded-3xl p-5 zine-card soft-raise">
            <p className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
              About Maya
            </p>
            <p className="text-sm leading-relaxed text-[--color-foreground]">
              {GUIDE.bio}
            </p>

            {/* Focus areas */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[--color-muted] mb-2">
                Focus areas
              </p>
              <div className="flex flex-wrap gap-2">
                {GUIDE.focusAreas.map((area) => (
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

            {/* Stats row */}
            <div
              className="mt-4 flex gap-4 pt-4"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <div className="text-center flex-1">
                <p className="text-lg font-bold" style={{ color: "#ff9c60" }}>{GUIDE.sessions}</p>
                <p className="text-[11px] text-[--color-muted] mt-0.5">Sessions led</p>
              </div>
              <div className="w-px" style={{ background: "var(--color-border)" }} />
              <div className="text-center flex-1">
                <p className="text-lg font-bold" style={{ color: "#ff9c60" }}>{GUIDE.rating}</p>
                <p className="text-[11px] text-[--color-muted] mt-0.5">Member rating</p>
              </div>
              <div className="w-px" style={{ background: "var(--color-border)" }} />
              <div className="text-center flex-1">
                <p className="text-lg font-bold" style={{ color: "#ff9c60" }}>Wk 3</p>
                <p className="text-[11px] text-[--color-muted] mt-0.5">Current week</p>
              </div>
            </div>
          </div>

          {/* ── Check-in nudge ───────────────────────────────── */}
          <button
            onClick={() => setTab("chat")}
            className="mx-4 mt-4 flex items-center gap-3 rounded-3xl p-4 w-[calc(100%-2rem)] transition active:scale-[0.99] soft-raise"
            style={{
              background: "linear-gradient(135deg, #fff8f0 0%, #fde8d5 100%)",
              border: "1px solid #ffd5b4",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl"
              style={{ background: "rgba(255,156,96,0.15)" }}
            >
              🌿
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-[--color-foreground]">
                Send Maya a check-in
              </p>
              <p className="text-xs text-[--color-muted]">
                How are you feeling today?
              </p>
            </div>
            <Sparkles size={16} style={{ color: "#ff9c60" }} className="shrink-0" />
          </button>

          {/* ── Session history ──────────────────────────────── */}
          <div className="px-4 mt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
              Past Sessions
            </p>
            {[
              { week: 1, title: "Foundations · Intro 1:1", date: "Mar 6", duration: "30 min" },
              { week: 2, title: "Identity & Roots Check-in",  date: "Mar 13", duration: "30 min" },
            ].map((s) => (
              <div key={s.week} className="flex items-center gap-3 rounded-2xl p-4 mb-2 zine-card">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#fde8d5" }}
                >
                  <Video size={15} style={{ color: "#ff9c60" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[--color-foreground] truncate">{s.title}</p>
                  <p className="text-xs text-[--color-muted] mt-0.5">{s.date}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0" style={{ color: "var(--color-muted)" }}>
                  <Clock size={11} />
                  <span className="text-xs">{s.duration}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ══ CHAT TAB ═════════════════════════════════════════════ */}
      {tab === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "var(--color-background)" }}>

          {/* Messages ─────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {messages.map((msg, idx) => {
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const sameSide = prevMsg && prevMsg.fromGuide === msg.fromGuide && !msg.dateSep;

              return (
                <div key={msg.id}>
                  {/* Date separator */}
                  {msg.dateSep && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                      <span className="text-[11px] font-medium text-[--color-muted]">{msg.dateSep}</span>
                      <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                    </div>
                  )}

                  <div className={`flex gap-2 mb-0.5 ${msg.fromGuide ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Avatar */}
                    <div className="w-8 shrink-0 self-end mb-1">
                      {msg.fromGuide && !sameSide ? (
                        <GuideAvatar size="sm" />
                      ) : (
                        <div className="w-8" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[75%] flex flex-col ${msg.fromGuide ? "items-start" : "items-end"}`}>
                      <div
                        className="rounded-2xl px-3.5 py-2.5"
                        style={
                          msg.fromGuide
                            ? { background: "var(--color-surface)", border: "1px solid var(--color-border)", borderBottomLeftRadius: "4px" }
                            : { background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)", borderBottomRightRadius: "4px" }
                        }
                      >
                        <p className="text-sm leading-relaxed" style={{ color: msg.fromGuide ? "var(--color-foreground)" : "#5c2d00" }}>
                          {msg.text}
                        </p>
                        <p
                          className="text-[10px] mt-1 text-right"
                          style={{ color: msg.fromGuide ? "var(--color-muted)" : "rgba(92,45,0,0.55)" }}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Input bar ─────────────────────────────────────── */}
          <div
            className="shrink-0 flex items-center gap-2 px-3 py-3"
            style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: "#ebe5fb", color: "#8370d4" }}
            >
              JO
            </div>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message Maya…"
              className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none transition"
              style={{
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                color: "var(--color-foreground)",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 transition active:scale-90"
              style={{ background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)" }}
            >
              <Send size={16} style={{ color: "#5c2d00" }} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
