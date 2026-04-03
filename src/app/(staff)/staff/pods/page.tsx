import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import {
  getActiveProgram,
  getProgramPods,
  createPod,
} from "@/app/actions/pods";

// ── Create pod form ───────────────────────────────────────────────

function CreatePodForm({ programId }: { programId: string }) {
  async function handleCreate(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string)?.trim();
    if (name) await createPod(programId, name);
  }

  return (
    <form action={handleCreate} className="flex items-center gap-2">
      <input
        name="name"
        required
        placeholder="Pod name, e.g. Pod 1 — Sunrise"
        className="flex-1 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
        style={{ border: "1px solid #e4e4e7", background: "#fafafa", color: "#18181b" }}
      />
      <button
        type="submit"
        className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)" }}
      >
        + New Pod
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default async function PodsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const program = await getActiveProgram();
  if (!program) redirect("/staff/program");

  const pods = await getProgramPods(program.id);

  const targetPods    = Math.floor(program.cohort_size / 6);
  const podsRemaining = Math.max(0, targetPods - pods.length);

  return (
    <div className="max-w-3xl space-y-6">

      {/* Program banner */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between"
        style={{ background: "#f0ebff", border: "1px solid #c4b8f5" }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: "#7c5cbf" }}>Active Program</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: "#18181b" }}>{program.name}</p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-lg font-bold" style={{ color: "#6c3fd4" }}>{pods.length}</p>
            <p className="text-xs"           style={{ color: "#a1a1aa" }}>of {targetPods} pods</p>
          </div>
          {podsRemaining > 0 && (
            <span
              className="text-xs rounded-full px-2 py-0.5 font-medium"
              style={{ background: "#fff4e6", color: "#a05a00" }}
            >
              {podsRemaining} to create
            </span>
          )}
        </div>
      </div>

      {/* Create pod */}
      <CreatePodForm programId={program.id} />

      {/* Pod list */}
      {pods.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "#f4f4f5", border: "2px dashed #d4d4d8" }}
        >
          <p className="text-sm font-medium" style={{ color: "#52525b" }}>No pods yet</p>
          <p className="text-xs mt-1"        style={{ color: "#a1a1aa" }}>
            Create pods above, then assign members to each one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pods.map((pod) => {
            const fill    = pod.member_count;
            const max     = 7; // 6 members + 1 PA
            const pct     = Math.min(100, Math.round((fill / max) * 100));
            const full    = fill >= max;

            return (
              <a
                key={pod.id}
                href={`/staff/pods/${pod.id}`}
                className="group rounded-2xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-md"
                style={{ background: "#ffffff", border: "1px solid #e4e4e7" }}
              >
                {/* Pod avatar + name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                    style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)", color: "#fff" }}
                  >
                    {pod.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "#18181b" }}>
                      {pod.display_name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#a1a1aa" }}>
                      {fill} / {max} members
                    </p>
                  </div>
                  {full && (
                    <span
                      className="text-xs rounded-full px-2 py-0.5 font-medium shrink-0"
                      style={{ background: "#dcfce7", color: "#166534" }}
                    >
                      Full
                    </span>
                  )}
                </div>

                {/* Fill bar */}
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#f4f4f5" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width:      `${pct}%`,
                      background: full ? "#22c55e" : "linear-gradient(90deg, #a799ed, #7c5cbf)",
                    }}
                  />
                </div>

                <p
                  className="text-xs font-medium group-hover:underline"
                  style={{ color: "#8370d4" }}
                >
                  View Pod →
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
