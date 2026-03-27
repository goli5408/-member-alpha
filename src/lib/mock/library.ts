export type ContentType = "text" | "audio" | "video" | "image";
export type ContentStatus = "all" | "read" | "unread" | "bookmarked";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  weekNumber: number;
  description: string;
  durationSec?: number;   // audio / video only
  author: string;
  isRead: boolean;
  isBookmarked: boolean;
  tags: string[];
  body: string;           // full content body (text) or transcript excerpt
}

export const CONTENT_ITEMS: ContentItem[] = [
  // ── Week 1 ──────────────────────────────────────────────────
  {
    id: "w1-1",
    title: "Welcome to the Journey",
    type: "text",
    weekNumber: 1,
    description: "An introduction to the Soul Seated program and what to expect over the next eight weeks.",
    author: "Soul Seated Team",
    isRead: true,
    isBookmarked: false,
    tags: ["intro", "orientation", "foundations"],
    body: "Welcome. You are here because you chose to be here — and that matters.\n\nOver the next eight weeks, you will move through a structured journey designed to help you discover purpose, meaning, and connection. Each week builds on the last, inviting you to go a little deeper, share a little more, and trust the process.\n\nThis is your space. Come as you are.",
  },
  {
    id: "w1-2",
    title: "Grounding Meditation",
    type: "audio",
    weekNumber: 1,
    durationSec: 600,
    description: "A 10-minute guided meditation to help you arrive, settle in, and connect with your body.",
    author: "Maya Chen",
    isRead: true,
    isBookmarked: true,
    tags: ["meditation", "breathwork", "grounding"],
    body: "Find a comfortable position. Close your eyes if that feels right. Begin by noticing where your body makes contact with the surface beneath you…",
  },
  {
    id: "w1-3",
    title: "What Is Purpose? A Visual Essay",
    type: "image",
    weekNumber: 1,
    description: "A visual exploration of how different cultures and communities understand purpose and calling.",
    author: "Soul Seated Team",
    isRead: false,
    isBookmarked: false,
    tags: ["purpose", "culture", "visual"],
    body: "This visual essay draws on art, photography, and community stories to ask: what does purpose look like when we centre BIPOC experiences?",
  },
  {
    id: "w1-4",
    title: "Intro Session Recording",
    type: "video",
    weekNumber: 1,
    durationSec: 3120,
    description: "Full recording of the Week 1 live session — orientation, community agreements, and introductions.",
    author: "Journey Team",
    isRead: false,
    isBookmarked: false,
    tags: ["session", "recording", "orientation"],
    body: "This recording covers the full Week 1 live session. You'll meet the Journey Team, hear the community agreements, and watch member introductions.",
  },

  // ── Week 2 ──────────────────────────────────────────────────
  {
    id: "w2-1",
    title: "Identity & Roots: A Reflection Guide",
    type: "text",
    weekNumber: 2,
    description: "A written guide to exploring the stories and histories that shape who you are.",
    author: "Soul Seated Team",
    isRead: true,
    isBookmarked: true,
    tags: ["identity", "roots", "reflection"],
    body: "Our identities are not fixed points — they are living things, shaped by where we come from, what we've survived, and who has loved us.\n\nThis guide offers a series of prompts and frameworks to help you trace the threads of your own story.",
  },
  {
    id: "w2-2",
    title: "Ancestral Breathing Practice",
    type: "audio",
    weekNumber: 2,
    durationSec: 900,
    description: "A 15-minute breath practice that invites you to connect with those who came before you.",
    author: "Jordan Rivers",
    isRead: false,
    isBookmarked: false,
    tags: ["breathwork", "ancestors", "meditation"],
    body: "Breathe in, knowing that this same air once touched the lungs of every ancestor who kept you alive. Breathe out, releasing what is not yours to carry…",
  },
  {
    id: "w2-3",
    title: "Community Mapping Workshop",
    type: "video",
    weekNumber: 2,
    durationSec: 1800,
    description: "A facilitated workshop on mapping your personal community — who holds you, and who you hold.",
    author: "Peer Ambassador Team",
    isRead: false,
    isBookmarked: false,
    tags: ["community", "workshop", "mapping"],
    body: "In this workshop, you'll draw your community map — a visual representation of the relationships and systems that support your life.",
  },

  // ── Week 3 ──────────────────────────────────────────────────
  {
    id: "w3-1",
    title: "On Belonging: An Essay",
    type: "text",
    weekNumber: 3,
    description: "An essay on the difference between fitting in and truly belonging, and what that means for BIPOC emerging adults.",
    author: "Soul Seated Team",
    isRead: false,
    isBookmarked: false,
    tags: ["belonging", "community", "identity"],
    body: "Belonging is not the same as fitting in. Fitting in asks you to change yourself to be accepted. Belonging asks the space to make room for who you already are.\n\nThis week we explore what genuine belonging feels like — and how to cultivate it.",
  },
  {
    id: "w3-2",
    title: "Pod Connection Practice",
    type: "audio",
    weekNumber: 3,
    durationSec: 480,
    description: "An 8-minute guided activity to deepen your connection with your Pod before your next session.",
    author: "Maya Chen",
    isRead: false,
    isBookmarked: true,
    tags: ["pod", "connection", "practice"],
    body: "Before you join your Pod today, take a few minutes with this practice. Let it soften the edges and help you arrive open…",
  },
  {
    id: "w3-3",
    title: "Week 3 Live Session Recording",
    type: "video",
    weekNumber: 3,
    durationSec: 5400,
    description: "Full recording of the Week 3 live session on community, belonging, and collective healing.",
    author: "Journey Team",
    isRead: false,
    isBookmarked: false,
    tags: ["session", "recording", "community"],
    body: "This recording covers the full Week 3 live session including the community agreements check-in, the belonging exercise, and Pod breakout debrief.",
  },
];

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m} min`;
}
