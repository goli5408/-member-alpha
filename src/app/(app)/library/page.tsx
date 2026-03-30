"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  Headphones,
  Play,
  ImageIcon,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import {
  CONTENT_ITEMS,
  ContentItem,
  ContentType,
  ContentStatus,
  formatDuration,
} from "@/lib/mock/library";

// ── Constants ───────────────────────────────────────────────────
const TYPE_FILTERS: { label: string; value: ContentType | "all" }[] = [
  { label: "All types", value: "all" },
  { label: "Text",      value: "text" },
  { label: "Audio",     value: "audio" },
  { label: "Video",     value: "video" },
  { label: "Image",     value: "image" },
];

const WEEK_FILTERS = [
  { label: "All weeks", value: "all" as const },
  ...Array.from({ length: 8 }, (_, i) => ({
    label: `Week ${i + 1}`,
    value: i + 1,
  })),
];

const STATUS_FILTERS: { label: string; value: ContentStatus }[] = [
  { label: "All",        value: "all" },
  { label: "Unread",     value: "unread" },
  { label: "Read",       value: "read" },
  { label: "Bookmarked", value: "bookmarked" },
];

// ── Type icon map ────────────────────────────────────────────────
const TYPE_ICON = {
  text:  FileText,
  audio: Headphones,
  video: Play,
  image: ImageIcon,
} as const;

const TYPE_COLOR = {
  text:  { bg: "bg-[--color-brand-100]",   icon: "text-[--color-brand-600]" },
  audio: { bg: "bg-[--color-accent-100]",  icon: "text-[--color-accent-400]" },
  video: { bg: "bg-[--color-neutral-100]", icon: "text-[--color-neutral-500]" },
  image: { bg: "bg-[--color-brand-100]",   icon: "text-[--color-brand-300]" },
} as const;

// ── Sub-components ───────────────────────────────────────────────
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "shrink-0 rounded-full px-3.5 py-1.5 text-xs transition",
        active ? "btn-soft-on" : "btn-soft",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ContentCard({ item }: { item: ContentItem }) {
  const Icon = TYPE_ICON[item.type];
  const colors = TYPE_COLOR[item.type];

  return (
    <Link
      href={`/library/${item.id}`}
      className="flex items-center gap-3 rounded-3xl p-4 transition active:scale-[0.99] zine-card soft-raise"
    >
      {/* Type icon */}
      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={colors.icon} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[--color-foreground] truncate leading-snug">
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-[--color-muted] capitalize">{item.type}</span>
          {item.durationSec && (
            <>
              <span className="text-[--color-border]">·</span>
              <span className="flex items-center gap-0.5 text-xs text-[--color-muted]">
                <Clock size={10} />
                {formatDuration(item.durationSec)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-2 shrink-0">
        {item.isBookmarked && (
          <BookmarkCheck size={15} className="text-[--color-brand-600]" />
        )}
        {item.isRead ? (
          <CheckCircle2 size={15} className="text-[--color-accent-300]" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-[--color-brand-600]" />
        )}
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function LibraryPage() {
  const [query, setQuery]             = useState("");
  const [activeType, setActiveType]   = useState<ContentType | "all">("all");
  const [activeWeek, setActiveWeek]   = useState<number | "all">("all");
  const [activeStatus, setActiveStatus] = useState<ContentStatus>("all");

  const isFiltered =
    query !== "" ||
    activeType !== "all" ||
    activeWeek !== "all" ||
    activeStatus !== "all";

  const filtered = useMemo(() => {
    return CONTENT_ITEMS.filter((item) => {
      const q = query.toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      const matchesType   = activeType === "all"   || item.type === activeType;
      const matchesWeek   = activeWeek === "all"   || item.weekNumber === activeWeek;
      const matchesStatus =
        activeStatus === "all"        ||
        (activeStatus === "read"       && item.isRead) ||
        (activeStatus === "unread"     && !item.isRead) ||
        (activeStatus === "bookmarked" && item.isBookmarked);

      return matchesSearch && matchesType && matchesWeek && matchesStatus;
    });
  }, [query, activeType, activeWeek, activeStatus]);

  // Group by week when not filtered
  const groupedByWeek = useMemo(() => {
    const weeks: Record<number, ContentItem[]> = {};
    filtered.forEach((item) => {
      if (!weeks[item.weekNumber]) weeks[item.weekNumber] = [];
      weeks[item.weekNumber].push(item);
    });
    return Object.entries(weeks)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([week, items]) => ({ week: Number(week), items }));
  }, [filtered]);

  function clearFilters() {
    setQuery("");
    setActiveType("all");
    setActiveWeek("all");
    setActiveStatus("all");
  }

  const unreadCount = CONTENT_ITEMS.filter((i) => !i.isRead).length;

  return (
    <div className="pb-4">

      {/* ── Hero header ────────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pt-6 pb-8"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,153,237,0.25) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/4 w-28 h-28 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(128,152,249,0.12) 0%, transparent 70%)" }}
        />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8370d4" }}>
            Soul Seated
          </p>
          <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: "#414651" }}>
            Library
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(65,70,81,0.70)" }}>
            {unreadCount} unread · {CONTENT_ITEMS.length} total
          </p>
        </div>
      </header>

      {/* ── Search bar ─────────────────────────────────────── */}
      <div className="px-4 mt-4 mb-4">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-muted)" }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tag, or keyword…"
            className="w-full bg-transparent pl-9 pr-4 py-2.5 text-sm outline-none transition"
            style={{ color: "var(--color-foreground)" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-muted)" }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter rows ────────────────────────────────────── */}
      <div className="space-y-2 mb-5">
        {/* Type */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
          {TYPE_FILTERS.map(({ label, value }) => (
            <FilterChip
              key={value}
              label={label}
              active={activeType === value}
              onClick={() => setActiveType(value)}
            />
          ))}
        </div>

        {/* Week */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
          {WEEK_FILTERS.map(({ label, value }) => (
            <FilterChip
              key={value}
              label={label}
              active={activeWeek === value}
              onClick={() => setActiveWeek(value as number | "all")}
            />
          ))}
        </div>

        {/* Status */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
          {STATUS_FILTERS.map(({ label, value }) => (
            <FilterChip
              key={value}
              label={label}
              active={activeStatus === value}
              onClick={() => setActiveStatus(value)}
            />
          ))}
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────── */}
      <div className="px-4 space-y-6">

        {/* Active filter summary + clear */}
        {isFiltered && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-[--color-muted]">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium text-[--color-brand-600] hover:underline"
            >
              <X size={12} /> Clear filters
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-16 text-center space-y-2">
            <p className="text-2xl">🔍</p>
            <p className="text-sm font-medium text-[--color-foreground]">No results found</p>
            <p className="text-xs text-[--color-muted]">Try a different keyword or clear your filters.</p>
          </div>
        )}

        {/* Content grouped by week */}
        {groupedByWeek.map(({ week, items }) => (
          <section key={week}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
              Week {week}
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
