import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import {
  getPodDetail,
  getActiveProgram,
  getMembersWithPodStatus,
  assignMemberToPod,
  removeMemberFromPod,
} from "@/app/actions/pods";

// ── Remove member form ────────────────────────────────────────────

function RemoveMemberButton({ podId, userId }: { podId: string; userId: string }) {
  async function handleRemove() {
    "use server";
    await removeMemberFromPod(podId, userId);
  }

  return (
    <form action={handleRemove}>
      <button
        type="submit"
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-red-50"
        style={{ color: "#d1d5db" }}
        title="Remove from pod"
      >
        ✕
      </button>
    </form>
  );
}

// ── Assign member form (server-rendered search) ───────────────────

function AssignMemberSection({
  podId,
  unassigned,
}: {
  podId: string;
  unassigned: { id: string; display_name: string | null; role: string }[];
}) {
  async function handleAssign(formData: FormData) {
    "use server";
    const userId = formData.get("user_id") as string;
    const role   = formData.get("role") as "member" | "peer_ambassador";
    if (userId) await assignMemberToPod(podId, userId, role);
  }

  if (unassigned.length === 0) {
    return (
      <p className="text-sm" style={{ color: "#a1a1aa" }}>
        All members are assigned to pods.
      </p>
    );
  }

  return (
    <form action={handleAssign} className="flex items-center gap-2">
      <select
        name="user_id"
        required
        className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
        style={{ border: "1px solid #e4e4e7", background: "#fafafa", color: "#18181b" }}
      >
        <option value="">Select a member to add…</option>
        {unassigned.map((m) => (
          <option key={m.id} value={m.id}>
            {m.display_name ?? "Unknown"}{m.role === "peer_ambassador" ? " (PA)" : ""}
          </option>
        ))}
      </select>
      <select
        name="role"
        className="rounded-lg px-3 py-2 text-sm outline-none shrink-0"
        style={{ border: "1px solid #e4e4e7", background: "#fafafa", color: "#18181b" }}
      >
        <option value="member">Member</option>
        <option value="peer_ambassador">Peer Ambassador</option>
      </select>
      <button
        type="submit"
        className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)" }}
      >
        Add
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default async function PodDetailPage({
  params,
}: {
  params: Promise<{ podId: string }>;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { podId } = await params;

  const [pod, program] = await Promise.all([
    getPodDetail(podId),
    getActiveProgram(),
  ]);

  if (!pod) notFound();

  // Get all members with pod status so we can find unassigned ones
  const allMembers = program
    ? await getMembersWithPodStatus(program.id)
    : [];

  const unassigned = allMembers.filter((m) => m.pod_id === null);

  // Separate pod members by role
  const pa      = pod.members.find((m) => m.role === "peer_ambassador");
  const members = pod.members.filter((m) => m.role === "member");

  return (
    <div className="max-w-2xl space-y-6">

      {/* Back link */}
      <a
        href="/staff/pods"
        className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
        style={{ color: "#8370d4" }}
      >
        ← Back to Pods
      </a>

      {/* Pod header */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
          style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)", color: "#fff" }}
        >
          {pod.display_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#18181b" }}>{pod.display_name}</h1>
          <p className="text-sm" style={{ color: "#a1a1aa" }}>
            {pod.members.length} / 7 members
          </p>
        </div>
      </div>

      {/* Current members */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e4e4e7" }}
      >
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a1a1aa" }}>
            Peer Ambassador
          </p>
        </div>
        {pa ? (
          <div className="px-5 py-3 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
            >
              {pa.display_name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <p className="flex-1 text-sm font-medium" style={{ color: "#18181b" }}>
              {pa.display_name ?? "Unknown"}
            </p>
            <RemoveMemberButton podId={pod.id} userId={pa.id} />
          </div>
        ) : (
          <p className="px-5 py-3 text-sm" style={{ color: "#a1a1aa" }}>No PA assigned yet</p>
        )}

        <div
          className="px-5 py-3"
          style={{ borderTop: "1px solid #e4e4e7", background: "#fafafa" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a1a1aa" }}>
            Members ({members.length} / 6)
          </p>
        </div>
        {members.length === 0 ? (
          <p className="px-5 py-3 text-sm" style={{ color: "#a1a1aa" }}>No members assigned yet</p>
        ) : (
          members.map((m, i) => (
            <div
              key={m.id}
              className="px-5 py-3 flex items-center gap-3"
              style={i < members.length - 1 ? { borderBottom: "1px solid #f4f4f5" } : undefined}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)" }}
              >
                {m.avatar_url
                  ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                  : m.display_name?.charAt(0).toUpperCase() ?? "?"
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#18181b" }}>
                  {m.display_name ?? "Unknown"}
                </p>
                {m.pronouns && (
                  <p className="text-xs" style={{ color: "#a1a1aa" }}>{m.pronouns}</p>
                )}
              </div>
              <RemoveMemberButton podId={pod.id} userId={m.id} />
            </div>
          ))
        )}
      </div>

      {/* Add member */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "#ffffff", border: "1px solid #e4e4e7" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "#18181b" }}>Add Member</h3>
        <AssignMemberSection podId={pod.id} unassigned={unassigned} />
      </div>
    </div>
  );
}
