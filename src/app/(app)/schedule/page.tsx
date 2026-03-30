import { CalendarDays, Video, Users, Clock } from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY_IDX = 2; // Tuesday

const EVENTS = [
  {
    id: "e1",
    group: "Today",
    type: "1:1",
    Icon: Video,
    title: "Check-in with Maya",
    subtitle: "Your Guide",
    date: "Today",
    time: "3:00 – 3:30 PM",
    iconBg: "rgba(128,152,249,0.18)",
    iconColor: "#5060c8",
    badge: "Join",
    badgeBg: "#8098f9",
    badgeText: "#fff",
  },
  {
    id: "e2",
    group: "Today",
    type: "Pod",
    Icon: Users,
    title: "Pod Gathering · Week 3 Circle",
    subtitle: "Community & Belonging",
    date: "Today",
    time: "6:00 – 7:30 PM",
    iconBg: "rgba(167,153,237,0.18)",
    iconColor: "#8370d4",
    badge: "Tonight",
    badgeBg: "#ebe5fb",
    badgeText: "#8370d4",
  },
  {
    id: "e3",
    group: "This Week",
    type: "Live",
    Icon: Video,
    title: "Live Group Session",
    subtitle: "Community Stories",
    date: "Thu, Mar 28",
    time: "7:00 – 8:30 PM",
    iconBg: "rgba(128,152,249,0.18)",
    iconColor: "#5060c8",
    badge: "Thu",
    badgeBg: "#eaeeff",
    badgeText: "#5060c8",
  },
  {
    id: "e4",
    group: "Next Week",
    type: "1:1",
    Icon: Video,
    title: "Check-in with Maya",
    subtitle: "Your Guide",
    date: "Thu, Apr 3",
    time: "3:00 – 3:30 PM",
    iconBg: "rgba(128,152,249,0.18)",
    iconColor: "#5060c8",
    badge: "Apr 3",
    badgeBg: "#eaeeff",
    badgeText: "#5060c8",
  },
] as const;

const GROUPS = ["Today", "This Week", "Next Week"] as const;

// ── Event dot map ─────────────────────────────────────────────────
const EVENT_DAYS = new Set([TODAY_IDX, 4]); // Tue + Thu

export default function SchedulePage() {
  // Derive relative week days starting from Sunday
  const dayOffsets = Array.from({ length: 7 }, (_, i) => i - TODAY_IDX);

  return (
    <div className="pb-8 md:max-w-2xl md:mx-auto md:px-8">

      {/* ── Hero header ──────────────────────────────────────── */}
      <header
        className="relative overflow-hidden px-5 pt-6 pb-8"
        style={{ background: "linear-gradient(160deg, #f3f1e9 0%, #eaedff 60%, #d5dbfc 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(128,152,249,0.25) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#5060c8" }}>
            Soul Seated
          </p>
          <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: "#414651" }}>
            Schedule
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(65,70,81,0.70)" }}>
            All your upcoming events
          </p>
        </div>
      </header>

      {/* ── Week strip ───────────────────────────────────────── */}
      <div className="px-4 mt-4 mb-5">
        <div
          className="flex justify-around rounded-3xl p-3"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          {dayOffsets.map((offset, i) => {
            const isToday = i === TODAY_IDX;
            const hasEvent = EVENT_DAYS.has(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium" style={{ color: "var(--color-muted)" }}>
                  {DAYS[i]}
                </span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={
                    isToday
                      ? { background: "linear-gradient(160deg, #c4b8f5 0%, #8370d4 100%)", color: "#fff" }
                      : { color: "var(--color-foreground)" }
                  }
                >
                  {new Date(Date.now() + offset * 86400000).getDate()}
                </div>
                {/* Event dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: hasEvent ? (isToday ? "#8370d4" : "#8098f9") : "transparent" }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Event list ───────────────────────────────────────── */}
      <div className="px-4 space-y-6">
        {GROUPS.map((group) => {
          const groupEvents = EVENTS.filter((e) => e.group === group);
          if (!groupEvents.length) return null;
          return (
            <section key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
                {group}
              </h2>
              <div className="space-y-2.5">
                {groupEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-4 rounded-3xl p-4 zine-card soft-raise"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: ev.iconBg }}
                    >
                      <ev.Icon size={18} style={{ color: ev.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[--color-foreground] truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-[--color-muted] mt-0.5 truncate">{ev.subtitle}</p>
                      <div className="flex items-center gap-1 mt-1" style={{ color: "var(--color-muted)" }}>
                        <Clock size={10} />
                        <span className="text-[11px]">{ev.date} · {ev.time}</span>
                      </div>
                    </div>
                    <span
                      className="shrink-0 rounded-2xl px-3 py-1.5 text-xs font-semibold"
                      style={{ background: ev.badgeBg, color: ev.badgeText }}
                    >
                      {ev.badge}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Empty future nudge ───────────────────────────────── */}
      <div className="mx-4 mt-6 rounded-3xl p-4 text-center" style={{ background: "#eaedff", border: "1px solid rgba(128,152,249,0.25)" }}>
        <div className="flex items-center gap-2 justify-center">
          <CalendarDays size={14} style={{ color: "#5060c8" }} />
          <p className="text-xs font-semibold" style={{ color: "#5060c8" }}>
            More sessions are added as you progress through the program
          </p>
        </div>
      </div>

    </div>
  );
}
