"use client";

import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  X,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Save,
  Target,
  Shuffle,
  BookOpen,
  Sparkles,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════
// SELF-CARE CARD DECK
// ═══════════════════════════════════════════════════════════════════

type CardCategory = "Body" | "Emotion" | "Connection" | "Rest";

interface SelfCareCard {
  id: number;
  category: CardCategory;
  prompt: string;
}

const CARD_CATEGORIES: CardCategory[] = ["Body", "Emotion", "Connection", "Rest"];

const CATEGORY_STYLE: Record<CardCategory, {
  gradient: string;
  blob: string;
  badge: string;
  badgeText: string;
  accent: string;
}> = {
  Body: {
    gradient:  "linear-gradient(145deg, #fff4ec 0%, #ffe8d5 100%)",
    blob:      "rgba(255,156,96,0.22)",
    badge:     "rgba(255,156,96,0.22)",
    badgeText: "#b05010",
    accent:    "#ff9c60",
  },
  Emotion: {
    gradient:  "linear-gradient(145deg, #f5f2fe 0%, #ede5fb 100%)",
    blob:      "rgba(167,153,237,0.28)",
    badge:     "rgba(167,153,237,0.22)",
    badgeText: "#8370d4",
    accent:    "#a799ed",
  },
  Connection: {
    gradient:  "linear-gradient(145deg, #eef1fe 0%, #dce3fd 100%)",
    blob:      "rgba(128,152,249,0.22)",
    badge:     "rgba(128,152,249,0.22)",
    badgeText: "#4858c0",
    accent:    "#8098f9",
  },
  Rest: {
    gradient:  "linear-gradient(145deg, #fefce8 0%, #fef3c0 100%)",
    blob:      "rgba(253,226,116,0.40)",
    badge:     "rgba(253,226,116,0.40)",
    badgeText: "#806800",
    accent:    "#fde274",
  },
};

const SELF_CARE_CARDS: SelfCareCard[] = [
  // ── Body ────────────────────────────────────────────────────────
  { id:  1, category: "Body",       prompt: "Take 5 slow, deep breaths — feel your belly rise and fall with each one." },
  { id:  2, category: "Body",       prompt: "Do a gentle body scan from head to toe. Where are you holding tension right now?" },
  { id:  3, category: "Body",       prompt: "Stretch your arms wide, roll your shoulders back, and notice what opens up." },
  { id:  4, category: "Body",       prompt: "Drink a full glass of water slowly and mindfully — your body asked for this." },
  { id:  5, category: "Body",       prompt: "Place your hand on your heart. What is your body trying to tell you today?" },
  { id:  6, category: "Body",       prompt: "Step outside for 5 minutes and feel the air on your skin." },
  { id:  7, category: "Body",       prompt: "Notice three physical sensations you're experiencing right now, without judgment." },
  { id:  8, category: "Body",       prompt: "Give yourself a gentle self-hug and hold for a few slow breaths." },
  // ── Emotion ─────────────────────────────────────────────────────
  { id:  9, category: "Emotion",    prompt: "Name three emotions you've felt today without judging any of them as good or bad." },
  { id: 10, category: "Emotion",    prompt: "What feeling have you been avoiding lately? Can you make space for it today?" },
  { id: 11, category: "Emotion",    prompt: "What is weighing heaviest on your heart right now? Just name it — that's enough." },
  { id: 12, category: "Emotion",    prompt: "What emotion most needs your compassion and gentleness today?" },
  { id: 13, category: "Emotion",    prompt: "Think of a time you showed yourself kindness. How did it feel to receive that?" },
  { id: 14, category: "Emotion",    prompt: "What would you say to a dear friend feeling exactly what you feel right now?" },
  { id: 15, category: "Emotion",    prompt: "Let yourself fully feel something for one minute, then breathe and gently release it." },
  { id: 16, category: "Emotion",    prompt: "What has been bringing you unexpected joy or lightness recently?" },
  // ── Connection ──────────────────────────────────────────────────
  { id: 17, category: "Connection", prompt: "Think of someone who has supported you lately. How might you acknowledge them today?" },
  { id: 18, category: "Connection", prompt: "Where in your life do you feel the deepest sense of belonging right now?" },
  { id: 19, category: "Connection", prompt: "What community or group makes you feel truly seen and understood?" },
  { id: 20, category: "Connection", prompt: "Reach out to one person today — just to say you're thinking of them." },
  { id: 21, category: "Connection", prompt: "What kind of support do you most need from others right now? Have you asked for it?" },
  { id: 22, category: "Connection", prompt: "Reflect on a moment of genuine human connection you've experienced recently." },
  { id: 23, category: "Connection", prompt: "How can you show up more fully for the people you love this week?" },
  { id: 24, category: "Connection", prompt: "What story about yourself are you ready to share with someone you trust?" },
  // ── Rest ────────────────────────────────────────────────────────
  { id: 25, category: "Rest",       prompt: "Give yourself full permission to do absolutely nothing for the next five minutes." },
  { id: 26, category: "Rest",       prompt: "What would genuine rest look like for you today — not sleep, but restoration?" },
  { id: 27, category: "Rest",       prompt: "What can you say no to today in order to protect your energy?" },
  { id: 28, category: "Rest",       prompt: "Put on a piece of music that makes you feel calm and simply listen. Nothing else." },
  { id: 29, category: "Rest",       prompt: "What drains you vs. what restores you? Are these currently in balance?" },
  { id: 30, category: "Rest",       prompt: "Create a small moment of stillness right now — close your eyes for 60 seconds." },
  { id: 31, category: "Rest",       prompt: "What is one expectation you can gently release today to lighten your load?" },
  { id: 32, category: "Rest",       prompt: "How are you actively honoring your need for rest in your daily life?" },
];

/** Same card all day, cycles through the deck day by day */
function getDailyCard(): SelfCareCard {
  const dayIdx = Math.floor(Date.now() / 86400000) % SELF_CARE_CARDS.length;
  return SELF_CARE_CARDS[dayIdx];
}

// ── Flip animation state machine ─────────────────────────────────
type FlipPhase = "idle" | "out" | "reset" | "in";

function SelfCareCardDeck({ onJournalLink }: { onJournalLink: () => void }) {
  const daily                                   = useRef(getDailyCard());
  const [displayCard, setDisplayCard]           = useState<SelfCareCard>(daily.current);
  const [pendingCard,  setPendingCard]           = useState<SelfCareCard | null>(null);
  const [flipPhase,    setFlipPhase]             = useState<FlipPhase>("idle");
  const [completed,    setCompleted]             = useState<Set<number>>(new Set());
  const [showBrowse,   setShowBrowse]            = useState(false);
  const [browseCat,    setBrowseCat]             = useState<CardCategory>("Body");
  const [showNudge,    setShowNudge]             = useState(false);

  // State machine: out → (swap content) → reset → in → idle
  useEffect(() => {
    if (flipPhase === "out") {
      const t = setTimeout(() => {
        if (pendingCard) setDisplayCard(pendingCard);
        setFlipPhase("reset");
      }, 230);
      return () => clearTimeout(t);
    }
    if (flipPhase === "reset") {
      // Two rAFs ensure the browser paints the -90deg start before transitioning
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setFlipPhase("in"))
      );
      return () => cancelAnimationFrame(id);
    }
    if (flipPhase === "in") {
      const t = setTimeout(() => { setFlipPhase("idle"); setPendingCard(null); }, 230);
      return () => clearTimeout(t);
    }
  }, [flipPhase, pendingCard]);

  function triggerFlip(card: SelfCareCard) {
    if (flipPhase !== "idle" || card.id === displayCard.id) return;
    setPendingCard(card);
    setFlipPhase("out");
    setShowBrowse(false);
  }

  function handleShuffle() {
    if (flipPhase !== "idle") return;
    const pool = SELF_CARE_CARDS.filter(c => c.id !== displayCard.id);
    triggerFlip(pool[Math.floor(Math.random() * pool.length)]);
  }

  function handleComplete() {
    setCompleted(prev => new Set([...prev, displayCard.id]));
    setShowNudge(true);
  }

  const isCompleted = completed.has(displayCard.id);
  const style       = CATEGORY_STYLE[displayCard.category];

  // CSS for the 3-D flip
  const cardTransform: Record<FlipPhase, string> = {
    idle:  "rotateY(0deg)",
    out:   "rotateY(90deg)",
    reset: "rotateY(-90deg)",
    in:    "rotateY(0deg)",
  };
  const cardTransition: Record<FlipPhase, string> = {
    idle:  "none",
    out:   "transform 0.23s ease-in",
    reset: "none",
    in:    "transform 0.23s ease-out",
  };

  return (
    <section className="space-y-3">

      {/* ── Header row ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>
            Self-Care Card Deck
          </h2>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
            {completed.size} / {SELF_CARE_CARDS.length} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Shuffle */}
          <button
            onClick={handleShuffle}
            disabled={flipPhase !== "idle"}
            aria-label="Shuffle"
            className="w-8 h-8 rounded-xl flex items-center justify-center transition active:scale-90 disabled:opacity-40"
            style={{ background: "rgba(167,153,237,0.12)", color: "#8370d4" }}
          >
            <Shuffle size={15} />
          </button>
          {/* Browse toggle */}
          <button
            onClick={() => setShowBrowse(v => !v)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition active:scale-95"
            style={{
              background: showBrowse ? "#ede5fb" : "rgba(167,153,237,0.12)",
              color: "#8370d4",
            }}
          >
            <BookOpen size={13} />
            Browse
          </button>
        </div>
      </div>

      {/* ── Main card with 3-D flip ─────────────────────── */}
      <div style={{ perspective: "1000px" }}>
        <div
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background:  style.gradient,
            border:      `1px solid ${style.accent}44`,
            transform:   cardTransform[flipPhase],
            transition:  cardTransition[flipPhase],
          }}
        >
          {/* Decorative blob */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full"
            style={{ background: `radial-gradient(circle, ${style.blob} 0%, transparent 70%)` }}
          />

          {/* Category + index */}
          <div className="relative flex items-center justify-between mb-4">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ background: style.badge, color: style.badgeText }}
            >
              {displayCard.category}
            </span>
            <span className="text-[11px] font-medium" style={{ color: "rgba(65,70,81,0.40)" }}>
              {String(displayCard.id).padStart(2, "0")} / 32
            </span>
          </div>

          {/* Prompt */}
          <p
            className="font-display relative text-[17px] font-semibold leading-snug mb-6"
            style={{ color: "#414651" }}
          >
            {displayCard.prompt}
          </p>

          {/* Mark done */}
          <div className="relative">
            {isCompleted ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.70)", color: style.badgeText }}
              >
                <CheckCircle2 size={15} /> Done ✓
              </span>
            ) : (
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-95"
                style={{
                  background:     "rgba(255,255,255,0.70)",
                  backdropFilter: "blur(4px)",
                  color:          style.badgeText,
                }}
              >
                <CheckCircle2 size={15} /> Mark done
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Journal nudge (appears after marking done) ─── */}
      {showNudge && (
        <button
          onClick={() => { onJournalLink(); setShowNudge(false); }}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 transition active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #f5f2fe 0%, #ede5fb 100%)",
            border:     "1px solid #d5ccf8",
          }}
        >
          <Sparkles size={16} style={{ color: "#a799ed" }} className="shrink-0" />
          <span className="flex-1 text-left text-sm font-medium" style={{ color: "#414651" }}>
            Want to journal about this?
          </span>
          <span className="text-xs font-semibold" style={{ color: "#8370d4" }}>
            Open Journal →
          </span>
        </button>
      )}

      {/* ── Browse panel ───────────────────────────────── */}
      {showBrowse && (
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          {/* Category tabs */}
          <div className="flex" style={{ borderBottom: "1px solid var(--color-border)" }}>
            {CARD_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setBrowseCat(cat)}
                className="flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition"
                style={{
                  color:        browseCat === cat ? CATEGORY_STYLE[cat].badgeText : "var(--color-muted)",
                  borderBottom: browseCat === cat
                    ? `2px solid ${CATEGORY_STYLE[cat].accent}`
                    : "2px solid transparent",
                  background: browseCat === cat
                    ? `${CATEGORY_STYLE[cat].accent}14`
                    : "transparent",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards for selected category */}
          <div className="p-3 space-y-2">
            {SELF_CARE_CARDS.filter(c => c.category === browseCat).map(card => {
              const isActive = card.id === displayCard.id;
              const isDone   = completed.has(card.id);
              const cs       = CATEGORY_STYLE[browseCat];
              return (
                <button
                  key={card.id}
                  onClick={() => triggerFlip(card)}
                  className="w-full text-left rounded-2xl px-3 py-2.5 flex items-start gap-2.5 transition active:scale-[0.98]"
                  style={{
                    background: isActive
                      ? `${cs.accent}18`
                      : "rgba(255,255,255,0.55)",
                    border: `1px solid ${isActive ? cs.accent + "55" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  {/* Status indicator */}
                  {isDone ? (
                    <CheckCircle2
                      size={14}
                      className="shrink-0 mt-0.5"
                      style={{ color: cs.accent }}
                    />
                  ) : (
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 border-2 flex-none"
                      style={{ borderColor: `${cs.accent}70` }}
                    />
                  )}
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-foreground)" }}>
                    {card.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Soft divider before journal section ────────── */}
      <div className="pt-1 pb-2">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--color-border) 30%, var(--color-border) 70%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// JOURNAL / REFLECTION / INTENTION
// ═══════════════════════════════════════════════════════════════════

type TabType = "journal" | "reflection" | "intention";

interface Entry {
  id: string;
  type: TabType;
  date: string;
  body: string;
  imageSrc?: string;
  prompt?: string;
  successIndicator?: string;
}

const TABS: { key: TabType; label: string }[] = [
  { key: "journal",    label: "Journal" },
  { key: "reflection", label: "Reflection" },
  { key: "intention",  label: "Intention" },
];

const REFLECTION_PROMPTS = [
  "What moment this week made you feel most like yourself?",
  "What did you learn about your community this week?",
  "What was challenging, and what did it reveal about you?",
  "What are you ready to release from this week?",
  "How did you show up for yourself these past few days?",
  "What surprised you about your own strength?",
  "Which connection felt most meaningful this week?",
  "What are you most grateful for from your journey so far?",
  "When did you feel most grounded this week?",
  "What would you tell your past self from one week ago?",
  "Where did you feel a sense of belonging this week?",
  "What old story about yourself did you start to question?",
];

const TAB_META = {
  journal: {
    placeholder: "What happened?",
    accentStyle: { background: "linear-gradient(145deg, #ede5fb 0%, #e2d8f8 100%)", border: "1px solid #d5ccf8" },
  },
  reflection: {
    placeholder: "What did I learn?",
    accentStyle: { background: "linear-gradient(145deg, #f0ede0 0%, #e8e4d4 80%, #ede5fb 100%)", border: "1px solid #d5ccf8" },
  },
  intention: {
    placeholder: "I will…",
    accentStyle: { background: "linear-gradient(145deg, #f5f2fe 0%, #ebe5fb 100%)", border: "1px solid #d5ccf8" },
  },
} as const;

function randomPrompt() {
  return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
}
function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function newId() { return Math.random().toString(36).slice(2, 9); }

// ── Saved entry card ─────────────────────────────────────────────
function EntryCard({ entry, onDelete }: { entry: Entry; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-[--color-muted]">{entry.date}</p>
        <button
          onClick={() => onDelete(entry.id)}
          aria-label="Delete entry"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[--color-neutral-400] hover:text-[--color-error] transition shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {entry.type === "reflection" && entry.prompt && (
        <p className="text-xs italic text-[--color-muted] border-l-2 border-[--color-accent-200] pl-2">
          {entry.prompt}
        </p>
      )}
      <p className="text-sm text-[--color-foreground] leading-relaxed whitespace-pre-wrap">{entry.body}</p>
      {entry.type === "intention" && entry.successIndicator && (
        <div className="flex items-start gap-2 rounded-xl bg-[--color-brand-50] px-3 py-2">
          <Target size={13} className="text-[--color-brand-600] mt-0.5 shrink-0" />
          <p className="text-xs text-[--color-brand-500]">{entry.successIndicator}</p>
        </div>
      )}
      {entry.imageSrc && (
        <img src={entry.imageSrc} alt="Attachment" className="w-full rounded-xl object-cover max-h-48" />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════
export default function PracticePage() {
  const [activeTab,  setActiveTab]  = useState<TabType>("journal");
  const [body,       setBody]       = useState("");
  const [imageSrc,   setImageSrc]   = useState<string | null>(null);
  const [prompt,     setPrompt]     = useState(randomPrompt);
  const [successInd, setSuccessInd] = useState("");
  const [entries,    setEntries]    = useState<Entry[]>([]);
  const [saved,      setSaved]      = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const meta          = TAB_META[activeTab];

  function switchTab(tab: TabType) {
    setActiveTab(tab);
    setBody(""); setImageSrc(null); setSuccessInd(""); setSaved(false);
    if (tab === "reflection") setPrompt(randomPrompt());
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
    e.target.value = "";
  }

  function handleSave() {
    if (!body.trim()) return;
    const entry: Entry = {
      id: newId(), type: activeTab, date: formatDate(new Date()), body: body.trim(),
      ...(imageSrc                       && { imageSrc }),
      ...(activeTab === "reflection"     && { prompt }),
      ...(activeTab === "intention"      && { successIndicator: successInd.trim() }),
    };
    setEntries(prev => [entry, ...prev]);
    setBody(""); setImageSrc(null); setSuccessInd(""); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() { setBody(""); setImageSrc(null); setSuccessInd(""); }
  function deleteEntry(id: string) { setEntries(prev => prev.filter(e => e.id !== id)); }

  const currentEntries = entries.filter(e => e.type === activeTab);

  return (
    <div className="pb-6">

      {/* ── Hero header ──────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pt-6 pb-8"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,153,237,0.25) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8370d4" }}>
            Soul Seated
          </p>
          <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: "#414651" }}>
            Guided Practice
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(65,70,81,0.70)" }}>Your inner work space</p>
        </div>
      </header>

      {/* ── Self-Care Card Deck ──────────────────────────── */}
      <div className="px-4 mt-6">
        <SelfCareCardDeck onJournalLink={() => switchTab("journal")} />
      </div>

      {/* ── Tab switcher ─────────────────────────────────── */}
      <div className="px-4 mb-5">
        <div className="flex gap-3">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className="flex-1 rounded-2xl py-2.5 text-sm font-medium outline-none transition active:scale-[0.97]"
              style={
                activeTab === key
                  ? { background: "linear-gradient(160deg, #c4b8f5 0%, #8370d4 100%)", color: "#fff", boxShadow: "0 2px 10px rgba(131,112,212,0.28)" }
                  : { background: "#ebe5fb", color: "#8370d4" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Composer ─────────────────────────────────────── */}
      <div className="px-4 space-y-3">
        <div className="rounded-3xl p-5 space-y-4" style={meta.accentStyle}>

          <p className="text-xs font-medium text-[--color-muted]">{formatDate(new Date())}</p>

          {/* Reflection prompt */}
          {activeTab === "reflection" && (
            <div className="rounded-2xl bg-white/60 border border-[--color-accent-200] px-4 py-3 flex items-start justify-between gap-3">
              <p className="text-sm italic text-[--color-neutral-700] leading-relaxed flex-1">
                &ldquo;{prompt}&rdquo;
              </p>
              <button
                onClick={() => setPrompt(randomPrompt())}
                aria-label="New prompt"
                className="w-8 h-8 rounded-xl bg-[--color-accent-100] flex items-center justify-center hover:bg-[--color-accent-200] transition shrink-0 mt-0.5"
              >
                <RefreshCw size={14} className="text-[--color-accent-500]" />
              </button>
            </div>
          )}

          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={meta.placeholder}
            rows={5}
            className="w-full bg-transparent resize-none text-sm text-[--color-foreground] placeholder:text-[--color-neutral-400] outline-none leading-relaxed"
          />

          {/* Intention: success indicator */}
          {activeTab === "intention" && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[--color-brand-500]">
                <Target size={11} /> Success looks like…
              </label>
              <input
                type="text"
                value={successInd}
                onChange={e => setSuccessInd(e.target.value)}
                placeholder="How will you know you've followed through?"
                className="w-full rounded-xl bg-white/70 border border-[--color-brand-200] px-3 py-2.5 text-sm placeholder:text-[--color-neutral-400] outline-none focus:border-[--color-brand-600] transition"
              />
            </div>
          )}

          {/* Image preview */}
          {imageSrc && (
            <div className="relative">
              <img src={imageSrc} alt="Attachment preview" className="w-full rounded-2xl object-cover max-h-48" />
              <button
                onClick={() => setImageSrc(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center transition"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => imageInputRef.current?.click()}
                aria-label="Attach image"
                className="w-9 h-9 rounded-xl bg-white/50 flex items-center justify-center hover:bg-white/80 transition"
              >
                <ImagePlus size={17} className="text-[--color-neutral-500]" />
              </button>
              {(body || imageSrc || successInd) && (
                <button
                  onClick={handleClear}
                  aria-label="Clear"
                  className="w-9 h-9 rounded-xl bg-white/50 flex items-center justify-center hover:bg-white/80 transition"
                >
                  <Trash2 size={16} className="text-[--color-neutral-500]" />
                </button>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={!body.trim()}
              className={[
                "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm transition",
                saved
                  ? "bg-[--color-accent-100] text-[--color-accent-500] font-semibold"
                  : body.trim()
                  ? "btn-soft"
                  : "bg-[--color-neutral-100] text-[--color-neutral-400] cursor-not-allowed font-medium",
              ].join(" ")}
            >
              {saved ? <><CheckCircle2 size={15} /> Saved</> : <><Save size={15} /> Save</>}
            </button>
          </div>

          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>

        {/* Saved entries */}
        {currentEntries.length > 0 && (
          <section className="space-y-3 pt-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
              {TABS.find(t => t.key === activeTab)?.label} entries
              <span className="ml-1.5 rounded-full bg-[--color-neutral-100] px-2 py-0.5 font-normal normal-case">
                {currentEntries.length}
              </span>
            </h2>
            {currentEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} onDelete={deleteEntry} />
            ))}
          </section>
        )}

        {/* Empty state */}
        {currentEntries.length === 0 && (
          <div className="py-10 text-center space-y-1.5">
            <p className="text-3xl">
              {activeTab === "journal" ? "📓" : activeTab === "reflection" ? "🪞" : "🌱"}
            </p>
            <p className="text-sm font-medium text-[--color-foreground]">No {activeTab} entries yet</p>
            <p className="text-xs text-[--color-muted]">
              {activeTab === "journal"
                ? "Start by writing about your day."
                : activeTab === "reflection"
                ? "Reflect on your learnings above."
                : "Set an intention and define success."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
