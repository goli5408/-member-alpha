"use client";

import { useRef, useState } from "react";
import { Camera, Check, X, ChevronRight, MapPin, Smile } from "lucide-react";

// ── Constants ────────────────────────────────────────────────────
const VIBE_OPTIONS = [
  { emoji: "😌", label: "Calm" },
  { emoji: "✨", label: "Energized" },
  { emoji: "🌱", label: "Growing" },
  { emoji: "💪", label: "Motivated" },
  { emoji: "🎯", label: "Focused" },
  { emoji: "🌊", label: "Flowing" },
  { emoji: "🔥", label: "On fire" },
  { emoji: "💭", label: "Reflective" },
  { emoji: "🌙", label: "Low energy" },
  { emoji: "🙏", label: "Grateful" },
  { emoji: "😊", label: "Happy" },
  { emoji: "🤔", label: "Curious" },
  { emoji: "😔", label: "Heavy" },
  { emoji: "🌈", label: "Hopeful" },
  { emoji: "💜", label: "Loved" },
  { emoji: "🦋", label: "Transforming" },
  { emoji: "🌺", label: "Blooming" },
  { emoji: "⚡", label: "Charged" },
  { emoji: "🫂", label: "Connected" },
  { emoji: "🍃", label: "Grounded" },
] as const;

const PRONOUNS_OPTIONS = [
  "he/him", "she/her", "they/them",
  "he/they", "she/they", "ze/zir",
  "prefer not to say", "custom",
];

const MOCK_PROFILE = {
  displayName: "Jordan",
  email: "jordan@example.com",
  bio: "I joined this program to reconnect with my roots and find community with people who share similar experiences.",
  pronouns: "they/them",
  hometown: "Atlanta, GA",
  vibe: { emoji: "🌱", label: "Growing" } as { emoji: string; label: string } | null,
};

// ── Vibe Picker ──────────────────────────────────────────────────
function VibePicker({
  current, onConfirm, onClear, onClose,
}: {
  current: { emoji: string; label: string } | null;
  onConfirm: (v: { emoji: string; label: string }) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(current?.emoji ?? "");
  const [label, setLabel]       = useState(current?.label ?? "");

  function handleConfirm() {
    if (!selected) return;
    const defaultLabel = VIBE_OPTIONS.find(v => v.emoji === selected)?.label ?? "";
    onConfirm({ emoji: selected, label: label.trim() || defaultLabel });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(55,40,90,0.35)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 rounded-t-[28px] px-5 pt-4 pb-10 space-y-5"
        style={{
          backgroundColor: "var(--color-background)",
          backgroundImage: "var(--noise-svg)",
          backgroundSize: "200px 200px",
          backgroundBlendMode: "multiply",
          boxShadow: "0 -4px 40px rgba(131,112,212,0.18), 0 -1px 0 rgba(167,153,237,0.25)",
        }}
      >
        {/* Handle */}
        <div className="mx-auto w-10 h-1 rounded-full" style={{ background: "rgba(167,153,237,0.40)" }} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: "var(--color-foreground)" }}>Current Vibe</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
              Visible to your Pod · expires in 24 hours
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition"
            style={{ background: "rgba(167,153,237,0.12)", color: "#8370d4" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-5 gap-2">
          {VIBE_OPTIONS.map(({ emoji, label: defaultLabel }) => (
            <button
              key={emoji}
              onClick={() => { setSelected(emoji); if (!label) setLabel(defaultLabel); }}
              className="flex flex-col items-center gap-1 rounded-2xl py-2.5 transition active:scale-95"
              style={
                selected === emoji
                  ? { background: "#ebe5fb", boxShadow: "0 0 0 2px #8370d4" }
                  : { background: "rgba(255,255,255,0.50)" }
              }
            >
              <span className="text-2xl leading-none">{emoji}</span>
              <span className="text-[9px] font-medium leading-tight text-center" style={{ color: "var(--color-muted)" }}>
                {defaultLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Optional label */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>
            Add a label <span className="normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value.slice(0, 30))}
              placeholder='e.g. "Taking it one day at a time"'
              className="w-full rounded-2xl px-4 py-2.5 pr-12 text-sm outline-none transition"
              style={{ background: "rgba(255,255,255,0.60)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: "var(--color-muted)" }}>
              {label.length}/30
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => { onClear(); onClose(); }}
            className="flex-1 rounded-2xl py-3 text-sm font-semibold transition"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
          >
            Clear vibe
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="flex-1 rounded-2xl py-3 text-sm font-bold transition active:scale-[0.98] disabled:opacity-40"
            style={{ background: "linear-gradient(160deg, #c4b8f5 0%, #8370d4 100%)", color: "#fff" }}
          >
            Set vibe
          </button>
        </div>
      </div>
    </>
  );
}

// ── FormField ────────────────────────────────────────────────────
function FormField({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>
        {label}
        {required && <span style={{ color: "#8370d4" }}>*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>{hint}</p>}
    </div>
  );
}

// Input / textarea shared style
const fieldStyle = {
  background: "rgba(255,255,255,0.55)",
  border: "1px solid var(--color-border)",
  color: "var(--color-foreground)",
} as const;

// ── Page ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [displayName, setDisplayName]   = useState(MOCK_PROFILE.displayName);
  const [bio, setBio]                   = useState(MOCK_PROFILE.bio);
  const [pronouns, setPronouns]         = useState(MOCK_PROFILE.pronouns);
  const [customPronouns, setCustomPronouns] = useState("");
  const [hometown, setHometown]         = useState(MOCK_PROFILE.hometown);
  const [vibe, setVibe]                 = useState(MOCK_PROFILE.vibe);
  const [vibeOpen, setVibeOpen]         = useState(false);
  const [saved, setSaved]               = useState(false);
  const [heroSrc, setHeroSrc]           = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc]       = useState<string | null>(null);
  const heroInputRef                    = useRef<HTMLInputElement>(null);
  const avatarInputRef                  = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
  }

  function handleSave() {
    localStorage.setItem("ss_displayName", displayName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <div className="pb-10 md:max-w-2xl md:mx-auto md:px-8">

        {/* ── Hero / cover ──────────────────────────────────── */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          style={{
            height: "180px",
            background: heroSrc ? undefined : "var(--gradient-hero)",
          }}
          onClick={() => heroInputRef.current?.click()}
        >
          {/* Blobs (no cover photo) */}
          {!heroSrc && (
            <>
              <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(167,153,237,0.30) 0%, transparent 70%)" }} />
              <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 w-32 h-32 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(128,152,249,0.18) 0%, transparent 70%)" }} />
            </>
          )}
          {heroSrc && <img src={heroSrc} alt="Cover" className="w-full h-full object-cover" />}

          {/* Edit cover hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            style={{ background: "rgba(0,0,0,0.18)" }}>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", color: "#414651" }}>
              <Camera size={12} /> Edit cover
            </div>
          </div>
          <input ref={heroInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleImageChange(e, setHeroSrc)} />
        </div>

        {/* ── Avatar + name ─────────────────────────────────── */}
        <div className="px-5 -mt-10 flex items-end gap-4 mb-5">
          {/* Avatar — rounded-2xl, soft purple glow ring, NO hard border */}
          <div
            className="relative shrink-0 cursor-pointer group"
            onClick={() => avatarInputRef.current?.click()}
          >
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: avatarSrc ? undefined : "linear-gradient(145deg, #ede5fb 0%, #c4b8f5 100%)",
                boxShadow: "0 0 0 3px var(--color-background), 0 0 0 5px rgba(167,153,237,0.45), 0 4px 16px rgba(131,112,212,0.20)",
              }}
            >
              {avatarSrc
                ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="text-3xl select-none">{vibe?.emoji ?? "🌱"}</span>
              }
            </div>
            {/* Camera overlay */}
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              style={{ background: "rgba(0,0,0,0.30)" }}>
              <Camera size={18} color="#fff" />
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleImageChange(e, setAvatarSrc)} />
          </div>

          {/* Name + pronouns */}
          <div className="pb-1 flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#8370d4" }}>
              Soul Seated
            </p>
            <h1 className="font-display text-xl font-bold leading-tight truncate" style={{ color: "#414651" }}>
              {displayName || "Your Name"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(65,70,81,0.60)" }}>{pronouns}</p>
          </div>
        </div>

        {/* ── Form ─────────────────────────────────────────── */}
        <div className="px-4">
          <div
            className="rounded-3xl p-5 space-y-5"
            style={{
              backgroundColor: "var(--color-surface)",
              backgroundImage: "var(--noise-svg)",
              backgroundSize: "200px 200px",
              backgroundBlendMode: "multiply",
              border: "1px solid var(--color-border)",
            }}
          >

            {/* Email */}
            <FormField label="Email" hint="Not visible to other members">
              <div className="w-full rounded-2xl px-4 py-3 text-sm" style={{ background: "rgba(0,0,0,0.04)", color: "var(--color-muted)" }}>
                {MOCK_PROFILE.email}
              </div>
            </FormField>

            {/* Display Name */}
            <FormField label="Display Name" required>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How would you like to be called?"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition"
                style={fieldStyle}
              />
            </FormField>

            {/* Bio */}
            <FormField label="My Journey Bio" required hint="Why did you join? What do you hope to discover?">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a little about your journey…"
                rows={4}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition resize-none"
                style={fieldStyle}
              />
            </FormField>

            {/* Pronouns */}
            <FormField label="Pronouns">
              <select
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition appearance-none"
                style={fieldStyle}
              >
                <option value="">Prefer not to say</option>
                {PRONOUNS_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p === "custom" ? "Custom…" : p}</option>
                ))}
              </select>
              {pronouns === "custom" && (
                <input
                  type="text"
                  value={customPronouns}
                  onChange={(e) => setCustomPronouns(e.target.value)}
                  placeholder="Enter your pronouns"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition mt-2"
                  style={fieldStyle}
                />
              )}
            </FormField>

            {/* Vibe */}
            <FormField label="Current Vibe" hint="Visible to your Pod · expires after 24 hours">
              <button
                onClick={() => setVibeOpen(true)}
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-left transition active:scale-[0.99]"
                style={fieldStyle}
              >
                {vibe ? (
                  <>
                    <span className="text-2xl leading-none">{vibe.emoji}</span>
                    <p className="font-medium flex-1" style={{ color: "var(--color-foreground)" }}>{vibe.label}</p>
                  </>
                ) : (
                  <>
                    <Smile size={20} style={{ color: "var(--color-muted)" }} className="shrink-0" />
                    <span className="flex-1" style={{ color: "var(--color-muted)" }}>How are you feeling right now?</span>
                  </>
                )}
                <ChevronRight size={15} style={{ color: "rgba(167,153,237,0.60)" }} className="shrink-0" />
              </button>
            </FormField>

            {/* Hometown */}
            <FormField label="Hometown / Roots" hint="Helps build connections within the community">
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-muted)" }} />
                <input
                  type="text"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="City, country, or region"
                  className="w-full rounded-2xl pl-9 pr-4 py-3 text-sm outline-none transition"
                  style={fieldStyle}
                />
              </div>
            </FormField>

          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full mt-4 rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition active:scale-[0.98]"
            style={
              saved
                ? { background: "#c9ddc5", color: "#3a5e36" }
                : { background: "linear-gradient(160deg, #c4b8f5 0%, #8370d4 100%)", color: "#fff", boxShadow: "0 2px 14px rgba(131,112,212,0.32)" }
            }
          >
            {saved ? <><Check size={16} /> Saved!</> : "Save Changes"}
          </button>
        </div>

      </div>

      {vibeOpen && (
        <VibePicker
          current={vibe}
          onConfirm={(v) => { setVibe(v); setVibeOpen(false); }}
          onClear={() => setVibe(null)}
          onClose={() => setVibeOpen(false)}
        />
      )}
    </>
  );
}
