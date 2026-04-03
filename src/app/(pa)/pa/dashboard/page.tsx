import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  MessageCircle,
  CheckSquare,
  Settings,
  ArrowRight,
} from "lucide-react";
import { getUnreadCount } from "@/app/actions/messages";

// ── Quick links ───────────────────────────────────────────────────

const QUICK_LINKS = [
  {
    href:        "/pa/pod",
    label:       "My Pod",
    description: "View your pod members & their vibes",
    Icon:        Users,
    bg:          "#fff4ec",
    color:       "#c06020",
  },
  {
    href:        "/pa/messages",
    label:       "Messages",
    description: "Async chat with your pod members",
    Icon:        MessageCircle,
    bg:          "#f0ebff",
    color:       "#6c3fd4",
  },
  {
    href:        "/pa/checkins",
    label:       "Check-ins",
    description: "Review pod member check-ins",
    Icon:        CheckSquare,
    bg:          "#ecfdf5",
    color:       "#166534",
  },
  {
    href:        "/pa/settings",
    label:       "Settings",
    description: "Bio, availability & preferences",
    Icon:        Settings,
    bg:          "#f4f4f5",
    color:       "#52525b",
  },
] as const;

// ── Page ──────────────────────────────────────────────────────────

export default async function PADashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "peer_ambassador") redirect("/login");

  // Pod assignment (pods table not yet in DB — graceful empty state)
  const { data: podMember } = await supabase
    .from("pod_members")
    .select("pod_id, pods(display_name)")
    .eq("user_id", user.id)
    .maybeSingle()
    .then(r => r);                   // silence TS "awaited" warning

  const unread = await getUnreadCount();

  const podName = (podMember as { pods?: { display_name?: string } | null } | null)
    ?.pods?.display_name ?? null;

  return (
    <div className="max-w-2xl">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-1" style={{ color: "#c06020" }}>
          Peer Ambassador
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>
          Welcome back, {profile.display_name ?? "Peer Ambassador"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>
          {podName ? `Leading ${podName}` : "PA Portal · Soul Seated Journey"}
        </p>
      </div>

      {/* ── Pod status card ─────────────────────────────────────── */}
      {!podName && (
        <div
          className="mb-6 rounded-xl px-5 py-4 flex items-center gap-3"
          style={{ background: "#fff4ec", border: "1px solid #ffd5b4" }}
        >
          <Users size={18} style={{ color: "#ff9c60" }} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#c06020" }}>
              No pod assigned yet
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#a05a00" }}>
              A Program Manager will assign you to a pod before the program begins.
            </p>
          </div>
        </div>
      )}

      {/* ── Unread badge ────────────────────────────────────────── */}
      {unread > 0 && (
        <Link
          href="/pa/messages"
          className="mb-6 flex items-center justify-between rounded-xl px-5 py-4 transition-shadow hover:shadow-md"
          style={{ background: "#f0ebff", border: "1px solid #c4b8f5" }}
        >
          <div className="flex items-center gap-3">
            <MessageCircle size={18} style={{ color: "#6c3fd4" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#6c3fd4" }}>
                {unread} unread message{unread > 1 ? "s" : ""}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8370d4" }}>
                Tap to view your conversations
              </p>
            </div>
          </div>
          <ArrowRight size={16} style={{ color: "#a799ed" }} />
        </Link>
      )}

      {/* ── Quick links grid ────────────────────────────────────── */}
      <section>
        <h2
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#aaa" }}
        >
          Quick access
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map(({ href, label, description, Icon, bg, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-xl px-4 py-4 transition-shadow hover:shadow-md"
              style={{ background: "#ffffff", border: "1px solid #e5e5e5" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: bg }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{label}</p>
                <p className="text-xs mt-0.5 leading-snug" style={{ color: "#888" }}>{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs text-center" style={{ color: "#ccc" }}>
        More features rolling out as the program launches
      </p>
    </div>
  );
}
