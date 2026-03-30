"use client";

import { useRef, useState } from "react";
import {
  ImagePlus,
  X,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Save,
  Target,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────
type TabType = "journal" | "reflection" | "intention";

interface Entry {
  id: string;
  type: TabType;
  date: string;
  body: string;
  imageSrc?: string;
  prompt?: string;          // reflection only
  successIndicator?: string; // intention only
}

// ── Constants ────────────────────────────────────────────────────
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
    color:       "brand",
    accentStyle: { background: "linear-gradient(145deg, #ede5fb 0%, #e2d8f8 100%)", border: "1px solid #d5ccf8" },
    badge:       "bg-[--color-brand-100] text-[--color-brand-700]",
  },
  reflection: {
    placeholder: "What did I learn?",
    color:       "accent",
    accentStyle: { background: "linear-gradient(145deg, #f0ede0 0%, #e8e4d4 80%, #ede5fb 100%)", border: "1px solid #d5ccf8" },
    badge:       "bg-[--color-accent-100] text-[--color-accent-500]",
  },
  intention: {
    placeholder: "I will…",
    color:       "brand",
    accentStyle: { background: "linear-gradient(145deg, #f5f2fe 0%, #ebe5fb 100%)", border: "1px solid #d5ccf8" },
    badge:       "bg-[--color-brand-50] text-[--color-brand-700]",
  },
} as const;

// ── Helpers ──────────────────────────────────────────────────────
function randomPrompt() {
  return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Entry card (saved) ───────────────────────────────────────────
function EntryCard({
  entry,
  onDelete,
}: {
  entry: Entry;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-[--color-muted]">{entry.date}</p>
        <button
          onClick={() => onDelete(entry.id)}
          aria-label="Delete entry"
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[--color-neutral-100] text-[--color-neutral-400] hover:text-[--color-error] transition shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Reflection: show prompt */}
      {entry.type === "reflection" && entry.prompt && (
        <p className="text-xs italic text-[--color-muted] border-l-2 border-[--color-accent-200] pl-2">
          {entry.prompt}
        </p>
      )}

      <p className="text-sm text-[--color-foreground] leading-relaxed whitespace-pre-wrap">
        {entry.body}
      </p>

      {/* Intention: show success indicator */}
      {entry.type === "intention" && entry.successIndicator && (
        <div className="flex items-start gap-2 rounded-xl bg-[--color-brand-50] px-3 py-2">
          <Target size={13} className="text-[--color-brand-600] mt-0.5 shrink-0" />
          <p className="text-xs text-[--color-brand-500]">{entry.successIndicator}</p>
        </div>
      )}

      {/* Image attachment */}
      {entry.imageSrc && (
        <img
          src={entry.imageSrc}
          alt="Attachment"
          className="w-full rounded-xl object-cover max-h-48"
        />
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function PracticePage() {
  const [activeTab, setActiveTab]   = useState<TabType>("journal");
  const [body, setBody]             = useState("");
  const [imageSrc, setImageSrc]     = useState<string | null>(null);
  const [prompt, setPrompt]         = useState(randomPrompt);
  const [successInd, setSuccessInd] = useState("");
  const [entries, setEntries]       = useState<Entry[]>([]);
  const [saved, setSaved]           = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const meta          = TAB_META[activeTab];

  function switchTab(tab: TabType) {
    setActiveTab(tab);
    setBody("");
    setImageSrc(null);
    setSuccessInd("");
    setSaved(false);
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
      id:   newId(),
      type: activeTab,
      date: formatDate(new Date()),
      body: body.trim(),
      ...(imageSrc          && { imageSrc }),
      ...(activeTab === "reflection" && { prompt }),
      ...(activeTab === "intention"  && { successIndicator: successInd.trim() }),
    };
    setEntries((prev) => [entry, ...prev]);
    setBody("");
    setImageSrc(null);
    setSuccessInd("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    setBody("");
    setImageSrc(null);
    setSuccessInd("");
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const currentEntries = entries.filter((e) => e.type === activeTab);

  return (
    <div className="pb-6 md:max-w-2xl md:mx-auto md:px-8">

      {/* ── Hero header ────────────────────────────────── */}
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

      {/* ── Tab switcher ───────────────────────────────── */}
      <div className="px-4 mt-5 mb-5">
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

      {/* ── Composer ───────────────────────────────────── */}
      <div className="px-4 space-y-3">
        <div className="rounded-3xl p-5 space-y-4" style={meta.accentStyle}>

          {/* Date */}
          <p className="text-xs font-medium text-[--color-muted]">
            {formatDate(new Date())}
          </p>

          {/* Reflection: prompt card */}
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

          {/* Main textarea */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={meta.placeholder}
            rows={5}
            className="w-full bg-transparent resize-none text-sm text-[--color-foreground] placeholder:text-[--color-neutral-400] outline-none leading-relaxed"
          />

          {/* Intention: success indicator */}
          {activeTab === "intention" && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[--color-brand-500]">
                <Target size={11} />
                Success looks like…
              </label>
              <input
                type="text"
                value={successInd}
                onChange={(e) => setSuccessInd(e.target.value)}
                placeholder="How will you know you've followed through?"
                className="w-full rounded-xl bg-white/70 border border-[--color-brand-200] px-3 py-2.5 text-sm placeholder:text-[--color-neutral-400] outline-none focus:border-[--color-brand-600] focus:ring-2 focus:ring-[--color-brand-600]/20 transition"
              />
            </div>
          )}

          {/* Image preview */}
          {imageSrc && (
            <div className="relative">
              <img
                src={imageSrc}
                alt="Attachment preview"
                className="w-full rounded-2xl object-cover max-h-48"
              />
              <button
                onClick={() => setImageSrc(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          )}

          {/* Bottom action row */}
          <div className="flex items-center justify-between pt-1">
            {/* Left: image upload + clear */}
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

            {/* Right: save */}
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
              {saved ? (
                <><CheckCircle2 size={15} /> Saved</>
              ) : (
                <><Save size={15} /> Save</>
              )}
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </div>

        {/* ── Saved entries ─────────────────────────── */}
        {currentEntries.length > 0 && (
          <section className="space-y-3 pt-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
              {TABS.find((t) => t.key === activeTab)?.label} entries
              <span className="ml-1.5 rounded-full bg-[--color-neutral-100] px-2 py-0.5 font-normal normal-case">
                {currentEntries.length}
              </span>
            </h2>
            {currentEntries.map((entry) => (
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
            <p className="text-sm font-medium text-[--color-foreground]">
              No {activeTab} entries yet
            </p>
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
