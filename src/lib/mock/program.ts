export type WeekStatus = "done" | "current" | "upcoming";

export interface WeekActivity {
  contentId: string; // matches CONTENT_ITEMS id
  title: string;
  type: "text" | "audio" | "video" | "practice" | "pod";
  duration?: string;
  completed: boolean;
}

export interface LiveSession {
  title: string;
  date: string;
  time: string;
  facilitator: string;
  completed: boolean;
}

export interface WeekProgram {
  week: number;
  theme: string;
  tagline: string;
  status: WeekStatus;
  objectives: string[];
  activities: WeekActivity[];
  liveSession: LiveSession;
  reflection: string; // closing reflection prompt
}

export const PROGRAM_WEEKS: WeekProgram[] = [
  {
    week: 1,
    theme: "Foundations",
    tagline: "Arriving with intention",
    status: "done",
    objectives: [
      "Understand the Soul Seated framework and community agreements",
      "Begin grounding practices for daily use",
      "Introduce yourself to your Pod",
    ],
    activities: [
      { contentId: "w1-1", title: "Welcome to the Journey", type: "text", completed: true },
      { contentId: "w1-2", title: "Grounding Meditation", type: "audio", duration: "10 min", completed: true },
      { contentId: "w1-3", title: "What Is Purpose? A Visual Essay", type: "text", completed: false },
      { contentId: "w1-4", title: "Intro Session Recording", type: "video", duration: "52 min", completed: false },
      { contentId: "w1-2", title: "Morning Grounding Practice", type: "practice", duration: "10 min", completed: true },
    ],
    liveSession: {
      title: "Orientation & Community Agreements",
      date: "Mar 5, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: true,
    },
    reflection: "What brought you here? What are you hoping to discover?",
  },
  {
    week: 2,
    theme: "Identity & Roots",
    tagline: "Knowing where you come from",
    status: "done",
    objectives: [
      "Explore the stories and histories that shape your identity",
      "Connect with ancestral lineage through breath and reflection",
      "Map the communities that have held you",
    ],
    activities: [
      { contentId: "w2-1", title: "Identity & Roots: A Reflection Guide", type: "text", completed: true },
      { contentId: "w2-2", title: "Ancestral Breathing Practice", type: "audio", duration: "15 min", completed: false },
      { contentId: "w2-3", title: "Community Mapping Workshop", type: "video", duration: "30 min", completed: false },
      { contentId: "w2-1", title: "Roots Journaling Practice", type: "practice", duration: "20 min", completed: true },
      { contentId: "w2-3", title: "Pod Check-in: Share Your Map", type: "pod", completed: true },
    ],
    liveSession: {
      title: "Identity, Roots & Collective Memory",
      date: "Mar 12, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: true,
    },
    reflection: "Which part of your story do you carry with the most pride?",
  },
  {
    week: 3,
    theme: "Community",
    tagline: "Finding where you belong",
    status: "current",
    objectives: [
      "Distinguish between fitting in and genuine belonging",
      "Deepen your connection with your Pod",
      "Explore what collective healing looks like in practice",
    ],
    activities: [
      { contentId: "w3-1", title: "On Belonging: An Essay", type: "text", completed: false },
      { contentId: "w3-2", title: "Pod Connection Practice", type: "audio", duration: "8 min", completed: false },
      { contentId: "w3-3", title: "Week 3 Live Session Recording", type: "video", duration: "90 min", completed: false },
      { contentId: "w3-2", title: "Belonging Meditation", type: "practice", duration: "12 min", completed: false },
      { contentId: "w3-1", title: "Pod Circle: Belonging Stories", type: "pod", completed: false },
    ],
    liveSession: {
      title: "Community, Belonging & Collective Healing",
      date: "Mar 19, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: false,
    },
    reflection: "Where do you feel most fully yourself?",
  },
  {
    week: 4,
    theme: "Purpose",
    tagline: "Discovering your why",
    status: "upcoming",
    objectives: [
      "Clarify what meaningful work looks like for you",
      "Explore purpose beyond productivity and output",
      "Connect personal purpose to community impact",
    ],
    activities: [
      { contentId: "w1-1", title: "Purpose Beyond Productivity", type: "text", completed: false },
      { contentId: "w1-2", title: "Values Clarification Exercise", type: "practice", duration: "25 min", completed: false },
      { contentId: "w1-4", title: "Purpose & Vocation Workshop", type: "video", duration: "45 min", completed: false },
      { contentId: "w1-3", title: "Pod Circle: What Lights You Up?", type: "pod", completed: false },
    ],
    liveSession: {
      title: "Purpose, Vocation & Meaningful Work",
      date: "Mar 26, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: false,
    },
    reflection: "What would you do if you knew you could not fail?",
  },
  {
    week: 5,
    theme: "Resilience",
    tagline: "Tending to your strength",
    status: "upcoming",
    objectives: [
      "Understand resilience as a collective, not individual, practice",
      "Build tools for navigating difficulty without isolation",
      "Honour the resilience already within you",
    ],
    activities: [
      { contentId: "w1-1", title: "Resilience Is Relational", type: "text", completed: false },
      { contentId: "w1-2", title: "Somatic Reset Practice", type: "audio", duration: "15 min", completed: false },
      { contentId: "w1-4", title: "Resilience Stories: Community Panel", type: "video", duration: "60 min", completed: false },
      { contentId: "w1-3", title: "Pod Circle: When Did You Rise?", type: "pod", completed: false },
    ],
    liveSession: {
      title: "Resilience, Rest & Community Care",
      date: "Apr 2, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: false,
    },
    reflection: "What does rest mean to you — and when do you allow it?",
  },
  {
    week: 6,
    theme: "Connection",
    tagline: "Deepening your relationships",
    status: "upcoming",
    objectives: [
      "Practice vulnerability and authentic sharing within your Pod",
      "Explore how deep connection supports personal growth",
      "Identify barriers to connection and how to soften them",
    ],
    activities: [
      { contentId: "w1-1", title: "Vulnerability & Trust", type: "text", completed: false },
      { contentId: "w1-2", title: "Heart Opening Meditation", type: "audio", duration: "12 min", completed: false },
      { contentId: "w1-4", title: "Deepening Connection Workshop", type: "video", duration: "50 min", completed: false },
      { contentId: "w1-3", title: "Pod Circle: Something True", type: "pod", completed: false },
    ],
    liveSession: {
      title: "Connection, Vulnerability & Belonging",
      date: "Apr 9, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: false,
    },
    reflection: "Who in your life do you feel most seen by — and why?",
  },
  {
    week: 7,
    theme: "Vision",
    tagline: "Imagining what's possible",
    status: "upcoming",
    objectives: [
      "Craft a personal vision rooted in your values and purpose",
      "Explore how collective vision differs from individual ambition",
      "Create a concrete picture of your life two years from now",
    ],
    activities: [
      { contentId: "w1-1", title: "Vision as a Practice of Hope", type: "text", completed: false },
      { contentId: "w1-2", title: "Future Self Visualisation", type: "audio", duration: "18 min", completed: false },
      { contentId: "w1-4", title: "Vision Board Workshop", type: "video", duration: "40 min", completed: false },
      { contentId: "w1-3", title: "Pod Circle: Share Your Vision", type: "pod", completed: false },
    ],
    liveSession: {
      title: "Vision, Hope & Imagination",
      date: "Apr 16, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: false,
    },
    reflection: "What does a life well-lived look like to you?",
  },
  {
    week: 8,
    theme: "Integration",
    tagline: "Carrying it forward",
    status: "upcoming",
    objectives: [
      "Integrate learnings from all eight weeks into a personal practice plan",
      "Celebrate growth and honour your journey",
      "Stay connected — to yourself, your Pod, and the community",
    ],
    activities: [
      { contentId: "w1-1", title: "Letter to Your Future Self", type: "practice", duration: "30 min", completed: false },
      { contentId: "w1-2", title: "Closing Meditation", type: "audio", duration: "20 min", completed: false },
      { contentId: "w1-4", title: "Graduation Ceremony Recording", type: "video", duration: "75 min", completed: false },
      { contentId: "w1-3", title: "Pod Circle: What Will You Carry?", type: "pod", completed: false },
    ],
    liveSession: {
      title: "Integration, Celebration & What's Next",
      date: "Apr 23, 2026",
      time: "6:00 PM",
      facilitator: "Maya Chen",
      completed: false,
    },
    reflection: "How have you changed? What do you want to remember from this journey?",
  },
];
