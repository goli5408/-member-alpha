"use client";

import { useState, useRef, useEffect } from "react";
import {
  Video,
  CalendarDays,
  Send,
  CornerUpLeft,
  X,
  Crown,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────
interface PodMember {
  id: string;
  name: string;
  pronouns: string;
  initials: string;
  bgClass: string;
  vibe: string;
  role: "ambassador" | "member";
  online: boolean;
  isMe?: true;
}

interface Reaction {
  emoji: string;
  memberIds: string[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  dateSep?: string;   // e.g. "Yesterday"
  reactions: Reaction[];
  replyToId?: string;
}

// ── Mock data ────────────────────────────────────────────────────
const MEMBERS: PodMember[] = [
  { id: "maya",   name: "Maya",   pronouns: "she/her",   initials: "MA", bgClass: "bg-rose-200",   vibe: "✨", role: "ambassador", online: true  },
  { id: "alex",   name: "Alex",   pronouns: "they/them", initials: "AL", bgClass: "bg-sky-200",    vibe: "🔥", role: "member",      online: true  },
  { id: "priya",  name: "Priya",  pronouns: "she/her",   initials: "PR", bgClass: "bg-amber-200",  vibe: "🌸", role: "member",      online: false },
  { id: "devin",  name: "Devin",  pronouns: "he/him",    initials: "DE", bgClass: "bg-teal-200",   vibe: "🌊", role: "member",      online: true  },
  { id: "sam",    name: "Sam",    pronouns: "they/them", initials: "SA", bgClass: "bg-lime-200",   vibe: "🎵", role: "member",      online: false },
  { id: "river",  name: "River",  pronouns: "she/they",  initials: "RI", bgClass: "bg-orange-200", vibe: "🦋", role: "member",      online: true  },
  { id: "jordan", name: "Jordan", pronouns: "they/them", initials: "JO", bgClass: "bg-violet-200", vibe: "🌱", role: "member",      online: true, isMe: true },
];

const QUICK_REACTS = ["❤️", "😂", "😮", "👍", "💜", "🙌"];

const INIT_MESSAGES: ChatMessage[] = [
  {
    id: "m1", senderId: "maya", dateSep: "Yesterday", time: "5:12 PM",
    text: "Hey everyone! So excited for our session tomorrow 🌟",
    reactions: [{ emoji: "❤️", memberIds: ["alex", "priya"] }, { emoji: "🙌", memberIds: ["jordan", "sam"] }],
  },
  {
    id: "m2", senderId: "priya", time: "5:45 PM",
    text: "Same! I've been thinking about the belonging exercise a lot",
    reactions: [{ emoji: "💜", memberIds: ["maya"] }],
  },
  {
    id: "m3", senderId: "alex", time: "6:03 PM",
    text: "Did anyone finish the essay on belonging? It hit different 📖",
    reactions: [],
  },
  {
    id: "m4", senderId: "jordan", time: "6:10 PM", replyToId: "m3",
    text: "Reading it now actually — it's so good",
    reactions: [{ emoji: "😊", memberIds: ["alex"] }],
  },
  {
    id: "m5", senderId: "devin", time: "8:22 PM",
    text: "The part about fitting in vs belonging got me 💯",
    reactions: [{ emoji: "💯", memberIds: ["priya", "jordan", "sam"] }],
  },
  {
    id: "m6", senderId: "sam", dateSep: "Today", time: "9:14 AM",
    text: "Tomorrow at 6 right? I'll be there early",
    reactions: [],
  },
  {
    id: "m7", senderId: "maya", time: "9:31 AM",
    text: "Yes! 6pm on Zoom. I'll share the link closer to time. We'll do a brief grounding exercise before diving in 🌿",
    reactions: [{ emoji: "👍", memberIds: ["devin", "sam", "river"] }, { emoji: "🌿", memberIds: ["priya"] }],
  },
  {
    id: "m8", senderId: "river", time: "10:02 AM",
    text: "Can't wait! This week's theme feels really personal for me",
    reactions: [{ emoji: "🤍", memberIds: ["maya", "alex", "jordan"] }],
  },
  {
    id: "m9", senderId: "jordan", time: "11:15 AM",
    text: "Sending you all love before tomorrow 💜",
    reactions: [
      { emoji: "💜", memberIds: ["maya", "priya", "devin", "river", "sam"] },
      { emoji: "🌱", memberIds: ["alex"] },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────
function getMember(id: string) {
  return MEMBERS.find((m) => m.id === id)!;
}

// ── Avatar component ─────────────────────────────────────────────
function Avatar({
  member, size = "md", showVibe = true, showOnline = false,
}: {
  member: PodMember;
  size?: "sm" | "md" | "lg";
  showVibe?: boolean;
  showOnline?: boolean;
}) {
  const dims =
    size === "sm" ? "w-8 h-8 text-xs rounded-full"
    : size === "lg" ? "w-14 h-14 text-base rounded-2xl"
    : "w-10 h-10 text-xs rounded-xl";
  const vSize = size === "sm" ? "text-sm -bottom-1 -right-1" : "text-base -bottom-1 -right-1";

  return (
    <div className="relative shrink-0">
      <div className={`${dims} ${member.bgClass} flex items-center justify-center font-bold text-[--color-foreground]`}>
        {member.initials}
      </div>
      {showVibe && (
        <span className={`absolute ${vSize} leading-none`}>{member.vibe}</span>
      )}
      {showOnline && member.online && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function PodPage() {
  const [tab, setTab]             = useState<"members" | "chat">("members");
  const [messages, setMessages]   = useState<ChatMessage[]>(INIT_MESSAGES);
  const [draft, setDraft]         = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [activeId, setActiveId]   = useState<string | null>(null);

  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ME        = MEMBERS.find((m) => m.isMe)!;
  const ambassador = MEMBERS.find((m) => m.role === "ambassador")!;
  const podMembers = MEMBERS.filter((m) => m.role === "member" && !m.isMe);

  useEffect(() => {
    if (tab === "chat") endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: ME.id,
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      reactions: [],
      replyToId: replyingTo?.id,
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
    setReplyingTo(null);
  }

  function toggleReaction(msgId: string, emoji: string) {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        const existing = msg.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          const next = existing.memberIds.includes(ME.id)
            ? existing.memberIds.filter((id) => id !== ME.id)
            : [...existing.memberIds, ME.id];
          return {
            ...msg,
            reactions: next.length === 0
              ? msg.reactions.filter((r) => r.emoji !== emoji)
              : msg.reactions.map((r) => (r.emoji === emoji ? { ...r, memberIds: next } : r)),
          };
        }
        return { ...msg, reactions: [...msg.reactions, { emoji, memberIds: [ME.id] }] };
      })
    );
    setActiveId(null);
  }

  function startReply(msg: ChatMessage) {
    setReplyingTo(msg);
    setActiveId(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "calc(100dvh - var(--top-bar-height) - var(--bottom-nav-height))" }}
      onClick={() => setActiveId(null)}
    >

      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div className="shrink-0 flex gap-3 px-4 py-3 bg-[--color-background] border-b border-[--color-border]">
        {(["members", "chat"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "flex-1 rounded-2xl py-2.5 text-sm transition",
              tab === t ? "btn-soft-on" : "btn-soft",
            ].join(" ")}
          >
            {t === "chat" ? "Pod Chat" : "Members"}
          </button>
        ))}
      </div>

      {/* ══ MEMBERS TAB ══════════════════════════════════════ */}
      {tab === "members" && (
        <div className="flex-1 overflow-y-auto pb-8">

          {/* ── Next Gathering card ─────────────────────────── */}
          <div className="mx-4 mt-4">
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #9e6ea8 0%, #7d5587 100%)" }}
            >
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-1">
                  Next Pod Gathering
                </p>
                <h2 className="text-[17px] font-bold text-white leading-snug">
                  Week 3 Circle — Community &amp; Belonging
                </h2>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <CalendarDays size={14} className="text-white" />
                    </div>
                    <span className="text-sm text-white/80">Today · 6:00 PM – 7:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Video size={14} className="text-white" />
                    </div>
                    <span className="text-sm text-white/80">Zoom (link from Maya)</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2.5">
                  <button className="flex-1 rounded-2xl bg-white py-3 text-sm font-bold text-[--color-brand-700] transition active:scale-[0.98]">
                    Join Meeting
                  </button>
                  <button className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center transition active:scale-95">
                    <CalendarDays size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Attending strip */}
              <div className="px-5 pb-4 flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  {MEMBERS.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      className={`w-8 h-8 rounded-full border-2 border-[#7d5587] ${m.bgClass} flex items-center justify-center text-[11px] font-bold text-[--color-foreground]`}
                    >
                      {m.initials[0]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-white/60">
                  +{MEMBERS.length - 5} · all attending
                </span>
              </div>
            </div>
          </div>

          {/* ── Peer Ambassador ─────────────────────────────── */}
          <div className="px-4 mt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
              Peer Ambassador
            </p>
            <div className="rounded-2xl border border-[--color-brand-300] bg-[--color-brand-50] p-4 flex items-center gap-4">
              <div className="relative">
                <Avatar member={ambassador} size="lg" showVibe showOnline />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[--color-brand-600] border-2 border-white flex items-center justify-center">
                  <Crown size={9} className="text-white" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[--color-foreground]">{ambassador.name}</p>
                <p className="text-xs text-[--color-muted]">{ambassador.pronouns}</p>
                <p className="text-xs text-[--color-brand-600] font-medium mt-0.5">Peer Ambassador</p>
              </div>
              <button
                onClick={() => setTab("chat")}
                className="shrink-0 rounded-xl border border-[--color-brand-300] bg-white px-3 py-1.5 text-xs font-semibold text-[--color-brand-600] transition active:scale-95"
              >
                Message
              </button>
            </div>
          </div>

          {/* ── Pod Members grid ────────────────────────────── */}
          <div className="px-4 mt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
              Pod Members
            </p>
            <div className="grid grid-cols-3 gap-3">
              {podMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[--color-border] bg-[--color-surface] p-3"
                >
                  <Avatar member={member} size="lg" showVibe showOnline />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-[--color-foreground]">{member.name}</p>
                    <p className="text-[10px] text-[--color-muted]">{member.pronouns}</p>
                  </div>
                </div>
              ))}

              {/* Me card */}
              <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-[--color-brand-300] bg-[--color-brand-50] p-3">
                <Avatar member={ME} size="lg" showVibe showOnline />
                <div className="text-center">
                  <p className="text-xs font-semibold text-[--color-brand-600]">You</p>
                  <p className="text-[10px] text-[--color-muted]">{ME.pronouns}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══ CHAT TAB ═════════════════════════════════════════ */}
      {tab === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[--color-background]">

          {/* Messages ─────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {messages.map((msg, idx) => {
              const sender   = getMember(msg.senderId);
              const isMe     = msg.senderId === ME.id;
              const prevMsg  = idx > 0 ? messages[idx - 1] : null;
              const sameSender = prevMsg && prevMsg.senderId === msg.senderId && !msg.dateSep;
              const replyTo  = msg.replyToId ? messages.find((m) => m.id === msg.replyToId) : null;
              const isActive = activeId === msg.id;

              return (
                <div key={msg.id}>

                  {/* Date separator */}
                  {msg.dateSep && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-[--color-border]" />
                      <span className="text-[11px] font-medium text-[--color-muted]">{msg.dateSep}</span>
                      <div className="flex-1 h-px bg-[--color-border]" />
                    </div>
                  )}

                  {/* Message row */}
                  <div className={`flex gap-2 mb-0.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>

                    {/* Avatar column */}
                    <div className="w-8 shrink-0 self-end mb-1">
                      {!isMe && !sameSender ? (
                        <div className={`w-8 h-8 rounded-full ${sender.bgClass} flex items-center justify-center text-[10px] font-bold text-[--color-foreground] relative`}>
                          {sender.initials}
                          <span className="absolute -bottom-0.5 -right-0.5 text-xs leading-none">{sender.vibe}</span>
                        </div>
                      ) : (
                        <div className="w-8" />
                      )}
                    </div>

                    {/* Bubble + inline actions + reactions */}
                    <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>

                      {/* Sender name */}
                      {!isMe && !sameSender && (
                        <span className="text-[11px] text-[--color-muted] mb-1 ml-1">{sender.name}</span>
                      )}

                      {/* Bubble */}
                      <button
                        className={[
                          "text-left rounded-2xl px-3.5 py-2.5 transition active:opacity-80",
                          isMe
                            ? "bg-[--color-brand-600] text-white rounded-br-sm"
                            : "bg-[--color-surface] text-[--color-foreground] border border-[--color-border] rounded-bl-sm",
                          isActive ? "ring-2 ring-[--color-brand-400]/40" : "",
                        ].join(" ")}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveId(isActive ? null : msg.id);
                        }}
                      >
                        {/* Reply preview inside bubble */}
                        {replyTo && (
                          <div className={`mb-2 rounded-xl px-2.5 py-1.5 border-l-2 ${isMe ? "bg-white/15 border-white/40" : "bg-[--color-background] border-[--color-brand-400]"}`}>
                            <p className={`text-[10px] font-semibold mb-0.5 ${isMe ? "text-white/75" : "text-[--color-brand-600]"}`}>
                              {getMember(replyTo.senderId).name}
                            </p>
                            <p className={`text-[11px] truncate ${isMe ? "text-white/60" : "text-[--color-muted]"}`}>
                              {replyTo.text}
                            </p>
                          </div>
                        )}

                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? "text-white/50" : "text-[--color-muted]"}`}>
                          {msg.time}
                        </p>
                      </button>

                      {/* Inline action bar (appears when active) */}
                      {isActive && (
                        <div
                          className="mt-1.5 flex items-center gap-0.5 rounded-full border border-[--color-border] bg-[--color-surface] shadow-md px-1.5 py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {QUICK_REACTS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => toggleReaction(msg.id, emoji)}
                              className="w-8 h-8 flex items-center justify-center rounded-full text-base hover:bg-[--color-background] transition active:scale-90"
                            >
                              {emoji}
                            </button>
                          ))}
                          <div className="w-px h-5 bg-[--color-border] mx-1" />
                          <button
                            onClick={() => startReply(msg)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-[--color-brand-600] hover:bg-[--color-brand-50] transition"
                          >
                            <CornerUpLeft size={12} />
                            Reply
                          </button>
                        </div>
                      )}

                      {/* Reaction pills */}
                      {msg.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          {msg.reactions.map((r) => {
                            const mine = r.memberIds.includes(ME.id);
                            return (
                              <button
                                key={r.emoji}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleReaction(msg.id, r.emoji);
                                }}
                                className={[
                                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition active:scale-95",
                                  mine
                                    ? "bg-[--color-brand-50] border-[--color-brand-300] text-[--color-brand-600]"
                                    : "bg-[--color-surface] border-[--color-border] text-[--color-muted]",
                                ].join(" ")}
                              >
                                <span className="text-sm leading-none">{r.emoji}</span>
                                <span className="font-semibold">{r.memberIds.length}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Reply preview bar ─────────────────────────────── */}
          {replyingTo && (
            <div className="shrink-0 flex items-center gap-3 px-4 py-2 border-t border-[--color-border] bg-[--color-surface]">
              <CornerUpLeft size={14} className="text-[--color-brand-400] shrink-0" />
              <div className="flex-1 min-w-0 border-l-2 border-[--color-brand-400] pl-2.5">
                <p className="text-[11px] font-semibold text-[--color-brand-600]">
                  Replying to {getMember(replyingTo.senderId).name}
                </p>
                <p className="text-xs text-[--color-muted] truncate">{replyingTo.text}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="w-6 h-6 rounded-full bg-[--color-neutral-100] flex items-center justify-center shrink-0"
              >
                <X size={12} className="text-[--color-muted]" />
              </button>
            </div>
          )}

          {/* Input bar ─────────────────────────────────────── */}
          <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-t border-[--color-border] bg-[--color-surface]">
            <div className={`w-8 h-8 rounded-full ${ME.bgClass} flex items-center justify-center text-[10px] font-bold text-[--color-foreground] shrink-0`}>
              {ME.initials}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message your Pod…"
              className="flex-1 rounded-full bg-[--color-background] border border-[--color-border] px-4 py-2.5 text-sm text-[--color-foreground] placeholder:text-[--color-muted] outline-none focus:border-[--color-brand-400] transition"
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="w-10 h-10 rounded-full bg-[--color-brand-600] flex items-center justify-center shrink-0 disabled:opacity-40 transition active:scale-90"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
