"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Play,
  ImageIcon,
  Volume2,
} from "lucide-react";
import { CONTENT_ITEMS, ContentType, formatDuration } from "@/lib/mock/library";

// ── Type helpers ─────────────────────────────────────────────────
const TYPE_ICON = {
  text:  FileText,
  audio: Headphones,
  video: Play,
  image: ImageIcon,
} as const;

const TYPE_LABEL: Record<ContentType, string> = {
  text:  "Article",
  audio: "Audio",
  video: "Video",
  image: "Visual Essay",
};

const TYPE_HERO_BG: Record<ContentType, string> = {
  text:  "bg-[--color-brand-100]",
  audio: "bg-[--color-accent-100]",
  video: "bg-[--color-neutral-100]",
  image: "bg-[--color-brand-50]",
};

// ── Media placeholder components ─────────────────────────────────
function AudioPlayer({ durationSec }: { durationSec: number }) {
  return (
    <div className="rounded-2xl border border-[--color-accent-200] bg-[--color-accent-100] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <button className="w-12 h-12 rounded-full bg-[--color-accent-500] flex items-center justify-center hover:opacity-90 transition active:scale-95">
          <Play size={20} className="text-white ml-0.5" fill="white" />
        </button>
        <div className="flex-1 space-y-1">
          <div className="h-1.5 w-full rounded-full bg-[--color-accent-200] overflow-hidden">
            <div className="h-full w-0 rounded-full bg-[--color-accent-400]" />
          </div>
          <div className="flex justify-between text-[10px] text-[--color-accent-500]">
            <span>0:00</span>
            <span>{formatDuration(durationSec)}</span>
          </div>
        </div>
        <Volume2 size={16} className="text-[--color-accent-400]" />
      </div>
    </div>
  );
}

function VideoPlayer({ durationSec }: { durationSec: number }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[--color-border] bg-[--color-neutral-900] aspect-video flex items-center justify-center">
      <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition active:scale-95">
        <Play size={24} className="text-white ml-1" fill="white" />
      </button>
      <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white font-medium">
        {formatDuration(durationSec)}
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function ContentItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router  = useRouter();
  const item    = CONTENT_ITEMS.find((c) => c.id === id);

  const [isRead,       setIsRead]       = useState(item?.isRead ?? false);
  const [isBookmarked, setIsBookmarked] = useState(item?.isBookmarked ?? false);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] gap-4 px-4 text-center">
        <p className="text-4xl">📭</p>
        <p className="font-semibold text-[--color-foreground]">Content not found</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-[--color-brand-600] underline"
        >
          Go back to Library
        </button>
      </div>
    );
  }

  const Icon    = TYPE_ICON[item.type];
  const heroBg  = TYPE_HERO_BG[item.type];

  return (
    <div className="pb-8 md:max-w-2xl md:mx-auto md:px-8">

      {/* ── Top bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 bg-[--color-background]/95 backdrop-blur-sm z-10 border-b border-[--color-border]">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-medium text-[--color-brand-600]"
        >
          <ChevronLeft size={18} />
          Library
        </button>
        <button
          onClick={() => setIsBookmarked((b) => !b)}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          className="p-1.5 rounded-xl hover:bg-[--color-brand-100] transition"
        >
          {isBookmarked ? (
            <BookmarkCheck size={20} className="text-[--color-brand-600]" />
          ) : (
            <Bookmark size={20} className="text-[--color-muted]" />
          )}
        </button>
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className={`${heroBg} flex items-center justify-center h-36`}>
        <Icon size={48} className="text-[--color-brand-300] opacity-60" />
      </div>

      {/* ── Metadata ───────────────────────────────────────── */}
      <div className="px-4 pt-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[--color-brand-100] px-2.5 py-0.5 text-xs font-semibold text-[--color-brand-500]">
            Week {item.weekNumber}
          </span>
          <span className="rounded-full border border-[--color-border] px-2.5 py-0.5 text-xs text-[--color-muted]">
            {TYPE_LABEL[item.type]}
          </span>
          {item.durationSec && (
            <span className="flex items-center gap-1 text-xs text-[--color-muted]">
              <Clock size={11} />
              {formatDuration(item.durationSec)}
            </span>
          )}
          {isRead && (
            <span className="flex items-center gap-1 text-xs text-[--color-accent-400]">
              <CheckCircle2 size={11} />
              Read
            </span>
          )}
        </div>

        <h1 className="text-xl font-semibold text-[--color-foreground] leading-snug">
          {item.title}
        </h1>

        <p className="text-xs text-[--color-muted]">By {item.author}</p>

        <p className="text-sm text-[--color-neutral-600] leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* ── Media player (audio / video) ────────────────────── */}
      {(item.type === "audio" || item.type === "video") && item.durationSec && (
        <div className="px-4 pt-4">
          {item.type === "audio" ? (
            <AudioPlayer durationSec={item.durationSec} />
          ) : (
            <div className="relative">
              <VideoPlayer durationSec={item.durationSec} />
            </div>
          )}
        </div>
      )}

      {/* ── Content body ────────────────────────────────────── */}
      <div className="px-4 pt-6">
        <div className="border-t border-[--color-border] pt-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-4">
            {item.type === "text" || item.type === "image" ? "Content" : "Transcript"}
          </h2>
          <div className="text-sm text-[--color-foreground] leading-relaxed whitespace-pre-line">
            {item.body}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[--color-neutral-100] px-2.5 py-0.5 text-xs text-[--color-neutral-500]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mark as read CTA ────────────────────────────────── */}
      <div className="px-4 pt-8">
        <button
          onClick={() => setIsRead(true)}
          disabled={isRead}
          className={[
            "w-full rounded-2xl py-3.5 text-sm font-semibold transition flex items-center justify-center gap-2",
            isRead
              ? "bg-[--color-accent-100] text-[--color-accent-400] border border-[--color-accent-200] cursor-default"
              : "bg-[--color-brand-600] text-white hover:opacity-90 active:scale-[0.98]",
          ].join(" ")}
        >
          <CheckCircle2 size={16} />
          {isRead ? "Marked as read" : "Mark as read"}
        </button>
      </div>
    </div>
  );
}
