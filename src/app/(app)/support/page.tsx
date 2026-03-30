"use client";

import { useState } from "react";
import { Send, CheckCircle2, LifeBuoy, MessageCircle } from "lucide-react";

const CATEGORIES = [
  { value: "logistics",        label: "Logistics" },
  { value: "tech",             label: "Technical issue" },
  { value: "emotional_support",label: "Emotional support" },
  { value: "other",            label: "Other" },
];

export default function SupportPage() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !description.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCategory("");
      setDescription("");
    }, 3000);
  }

  return (
    <div className="pb-10 md:max-w-2xl md:mx-auto md:px-8">

      {/* ── Hero header ──────────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pt-6 pb-8"
        style={{ background: "var(--gradient-guide)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,156,96,0.25) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 w-24 h-24 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(253,226,116,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,156,96,0.25)" }}
          >
            <LifeBuoy size={22} style={{ color: "#c06020" }} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#c06020" }}>
              Soul Seated
            </p>
            <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: "#414651" }}>
              Support
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(65,70,81,0.70)" }}>
              We&apos;re here to help
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 mt-5 space-y-5">

        {/* ── Request form ─────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-3xl p-5 space-y-4 zine-card soft-raise">

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition appearance-none"
                style={{
                  background: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  color: category ? "var(--color-foreground)" : "var(--color-muted)",
                }}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue or question…"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition resize-none"
                style={{
                  background: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!category || !description.trim()}
              className="w-full rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-40"
              style={
                submitted
                  ? { background: "#c9ddc5", color: "#3a5e36" }
                  : { background: "linear-gradient(145deg, #ffd5b4 0%, #ff9c60 100%)", color: "#5c2d00" }
              }
            >
              {submitted ? (
                <><CheckCircle2 size={16} /> Request sent!</>
              ) : (
                <><Send size={15} /> Submit Request</>
              )}
            </button>
          </div>
        </form>

        {/* ── Open requests ────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
            My Requests
          </h2>
          <div
            className="rounded-3xl p-6 flex flex-col items-center gap-2 text-center zine-card"
          >
            <MessageCircle size={28} style={{ color: "rgba(167,153,237,0.40)" }} />
            <p className="text-sm font-medium text-[--color-foreground]">No open requests</p>
            <p className="text-xs text-[--color-muted]">
              Your submitted requests will appear here.
            </p>
          </div>
        </section>

        {/* ── Response time note ───────────────────────────── */}
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: "rgba(255,156,96,0.08)", border: "1px solid rgba(255,156,96,0.20)" }}
        >
          <LifeBuoy size={15} style={{ color: "#c06020" }} className="shrink-0" />
          <p className="text-xs" style={{ color: "#c06020" }}>
            The team typically responds within 24 hours on weekdays.
          </p>
        </div>

      </div>
    </div>
  );
}
