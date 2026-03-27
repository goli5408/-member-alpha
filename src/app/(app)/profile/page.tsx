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
  "he/him",
  "she/her",
  "they/them",
  "he/they",
  "she/they",
  "ze/zir",
  "prefer not to say",
  "custom",
];

// ── Mock initial profile ─────────────────────────────────────────
const MOCK_PROFILE = {
  displayName: "Jordan",
  email: "jordan@example.com",
  bio: "I joined this program to reconnect with my roots and find community with people who share similar experiences.",
  pronouns: "they/them",
  hometown: "Atlanta, GA",
  vibe: { emoji: "🌱", label: "Growing" } as { emoji: string; label: string } | null,
};

// ── Vibe Picker (bottom sheet) ───────────────────────────────────
function VibePicker({
  current,
  onConfirm,
  onClear,
  onClose,
}: {
  current: { emoji: string; label: string } | null;
  onConfirm: (v: { emoji: string; label: string }) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string>(current?.emoji ?? "");
  const [label, setLabel]       = useState(current?.label ?? "");

  function handleConfirm() {
    if (!selected) return;
    const defaultLabel = VIBE_OPTIONS.find(v => v.emoji === selected)?.label ?? "";
    onConfirm({ emoji: selected, label: label.trim() || defaultLabel });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[--color-surface] rounded-t-3xl px-5 pt-5 pb-10 space-y-5 shadow-xl">
        {/* Handle */}
        <div className="mx-auto w-10 h-1 rounded-full bg-[--color-border]" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[--color-foreground]">Current Vibe</h3>
            <p className="text-xs text-[--color-muted] mt-0.5">
              Visible to your Pod · expires in 24 hours
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[--color-neutral-100] flex items-center justify-center"
          >
            <X size={15} className="text-[--color-muted]" />
          </button>
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-5 gap-2">
          {VIBE_OPTIONS.map(({ emoji, label: defaultLabel }) => (
            <button
              key={emoji}
              onClick={() => {
                setSelected(emoji);
                if (!label) setLabel(defaultLabel);
              }}
              className={[
                "flex flex-col items-center gap-1 rounded-2xl py-2.5 transition",
                selected === emoji
                  ? "bg-[--color-brand-100] ring-2 ring-[--color-brand-600]"
                  : "bg-[--color-neutral-50] hover:bg-[--color-brand-50]",
              ].join(" ")}
            >
              <span className="text-2xl leading-none">{emoji}</span>
              <span className="text-[9px] font-medium text-[--color-muted] leading-tight text-center">
                {defaultLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Optional custom label */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
            Add a label <span className="normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value.slice(0, 30))}
              placeholder='e.g. "Taking it one day at a time"'
              className="w-full rounded-xl border border-[--color-border] bg-[--color-neutral-50] px-4 py-2.5 pr-12 text-sm outline-none focus:border-[--color-brand-600] focus:ring-2 focus:ring-[--color-brand-600]/20 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[--color-muted]">
              {label.length}/30
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => { onClear(); onClose(); }}
            className="flex-1 rounded-xl border border-[--color-border] py-3 text-sm font-semibold text-[--color-muted] hover:bg-[--color-neutral-50] transition"
          >
            Clear vibe
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="flex-1 rounded-xl bg-[--color-brand-600] py-3 text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90 transition"
          >
            Set vibe
          </button>
        </div>
      </div>
    </>
  );
}

// ── Field components ─────────────────────────────────────────────
function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
        {label}
        {required && <span className="text-[--color-brand-600] normal-case font-bold">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[--color-muted]">{hint}</p>}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [displayName, setDisplayName] = useState(MOCK_PROFILE.displayName);
  const [bio, setBio]                 = useState(MOCK_PROFILE.bio);
  const [pronouns, setPronouns]       = useState(MOCK_PROFILE.pronouns);
  const [customPronouns, setCustomPronouns] = useState("");
  const [hometown, setHometown]       = useState(MOCK_PROFILE.hometown);
  const [vibe, setVibe]               = useState(MOCK_PROFILE.vibe);
  const [vibeOpen, setVibeOpen]       = useState(false);
  const [saved, setSaved]             = useState(false);

  // Image previews (mock — no real upload)
  const [heroSrc, setHeroSrc]           = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc]       = useState<string | null>(null);
  const heroInputRef                    = useRef<HTMLInputElement>(null);
  const avatarInputRef                  = useRef<HTMLInputElement>(null);

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (s: string) => void,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setter(url);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const showCustomPronouns = pronouns === "custom";

  return (
    <>
      <div className="pb-10">

        {/* ── Hero image ─────────────────────────────────── */}
        <div
          className="relative h-40 cursor-pointer group"
          style={{
            background: heroSrc
              ? undefined
              : "linear-gradient(135deg, #e0d3f1 0%, #caa4d4 60%, #b3c9af 100%)",
          }}
          onClick={() => heroInputRef.current?.click()}
        >
          {heroSrc && (
            <img src={heroSrc} alt="Hero" className="w-full h-full object-cover" />
          )}
          {/* Edit overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[--color-foreground]">
              <Camera size={13} /> Edit cover
            </div>
          </div>
          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, setHeroSrc)}
          />
        </div>

        {/* ── Avatar ─────────────────────────────────────── */}
        <div className="px-4">
          <div className="relative -mt-8 w-20 h-20 mb-4">
            <div
              className="w-20 h-20 rounded-full border-4 border-[--color-background] overflow-hidden cursor-pointer bg-[--color-neutral-200] flex items-center justify-center group"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl select-none">🧑</span>
              )}
              {/* Edit overlay */}
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, setAvatarSrc)}
            />
          </div>

          {/* ── Form ─────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Email — read only */}
            <FormField label="Email" hint="Not visible to other members">
              <div className="w-full rounded-xl border border-[--color-border] bg-[--color-neutral-50] px-4 py-3 text-sm text-[--color-muted]">
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
                className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand-600] focus:ring-2 focus:ring-[--color-brand-600]/20 transition"
              />
            </FormField>

            {/* My Journey Bio */}
            <FormField
              label="My Journey Bio"
              required
              hint="Why did you join? What do you hope to discover?"
            >
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a little about your journey…"
                rows={4}
                className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand-600] focus:ring-2 focus:ring-[--color-brand-600]/20 transition resize-none"
              />
            </FormField>

            {/* Pronouns */}
            <FormField label="Pronouns">
              <select
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand-600] focus:ring-2 focus:ring-[--color-brand-600]/20 transition appearance-none"
              >
                <option value="">Prefer not to say</option>
                {PRONOUNS_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p === "custom" ? "Custom…" : p}
                  </option>
                ))}
              </select>
              {showCustomPronouns && (
                <input
                  type="text"
                  value={customPronouns}
                  onChange={(e) => setCustomPronouns(e.target.value)}
                  placeholder="Enter your pronouns"
                  className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand-600] focus:ring-2 focus:ring-[--color-brand-600]/20 transition"
                />
              )}
            </FormField>

            {/* Current Vibe */}
            <FormField
              label="Current Vibe"
              hint="Visible to your Pod · expires after 24 hours"
            >
              <button
                onClick={() => setVibeOpen(true)}
                className="w-full flex items-center gap-3 rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm text-left hover:border-[--color-brand-600] transition group"
              >
                {vibe ? (
                  <>
                    <span className="text-2xl leading-none">{vibe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[--color-foreground]">{vibe.label || "No label"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Smile size={20} className="text-[--color-muted] shrink-0" />
                    <span className="text-[--color-muted] flex-1">How are you feeling right now?</span>
                  </>
                )}
                <ChevronRight size={16} className="text-[--color-muted] shrink-0 group-hover:text-[--color-brand-600] transition" />
              </button>
            </FormField>

            {/* Hometown / Roots */}
            <FormField
              label="Hometown / Roots"
              hint="Helps build connections within the community"
            >
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--color-muted] pointer-events-none"
                />
                <input
                  type="text"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="City, country, or region"
                  className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] pl-9 pr-4 py-3 text-sm outline-none focus:border-[--color-brand-600] focus:ring-2 focus:ring-[--color-brand-600]/20 transition"
                />
              </div>
            </FormField>

            {/* Save button */}
            <button
              onClick={handleSave}
              className={[
                "w-full rounded-2xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]",
                saved
                  ? "bg-[--color-accent-200] text-[--color-accent-500]"
                  : "bg-[--color-brand-600] text-white hover:opacity-90",
              ].join(" ")}
            >
              {saved ? (
                <>
                  <Check size={16} />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ── Vibe Picker ────────────────────────────────── */}
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
