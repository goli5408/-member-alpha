import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import {
  getPrograms,
  createProgram,
  updateProgramStatus,
} from "@/app/actions/pods";
import type { Program } from "@/app/actions/pods";

// ── Helpers ───────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

function weeksRemaining(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

// ── Status pill ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: Program["status"] }) {
  const styles: Record<Program["status"], { bg: string; text: string; label: string }> = {
    draft:     { bg: "#f4f4f5", text: "#71717a", label: "Draft" },
    active:    { bg: "#dcfce7", text: "#166534", label: "Active" },
    completed: { bg: "#ede9fe", text: "#5b21b6", label: "Completed" },
  };
  const s = styles[status];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

// ── Status action form ────────────────────────────────────────────

function StatusAction({ program }: { program: Program }) {
  if (program.status === "completed") return null;

  const next    = program.status === "draft" ? "active" : "completed";
  const label   = program.status === "draft" ? "Activate Program" : "Mark Completed";
  const confirm = program.status === "draft"
    ? "Activating will deactivate any other active program. Continue?"
    : "Mark this program as completed?";

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateProgramStatus(formData.get("program_id") as string, next);
  }

  return (
    <form action={handleUpdate}>
      <input type="hidden" name="program_id" value={program.id} />
      <button
        type="submit"
        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        style={{
          background: next === "active" ? "#6c3fd4" : "#f4f4f5",
          color:      next === "active" ? "#ffffff" : "#71717a",
        }}
        formAction={handleUpdate as unknown as string}
        onClick={(e) => {
          if (!confirm) return;
          if (!window.confirm(confirm)) e.preventDefault();
        }}
      >
        {label}
      </button>
    </form>
  );
}

// ── Create program form ───────────────────────────────────────────

function CreateProgramForm() {
  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createProgram(formData);
    if (result.error) {
      // Redirect with error param in a real app; for now surface via throw
      throw new Error(result.error);
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const eightWeeks = new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "#ffffff", border: "1px solid #e4e4e7" }}
    >
      <h2 className="text-sm font-semibold mb-4" style={{ color: "#18181b" }}>
        Create Program
      </h2>
      <form action={handleCreate} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: "#52525b" }}>
              Program Name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Spring 2026 Cohort"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
              style={{
                border:     "1px solid #e4e4e7",
                background: "#fafafa",
                color:      "#18181b",
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#52525b" }}>
              Start Date
            </label>
            <input
              name="start_date"
              type="date"
              required
              defaultValue={today}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ border: "1px solid #e4e4e7", background: "#fafafa", color: "#18181b" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#52525b" }}>
              End Date
            </label>
            <input
              name="end_date"
              type="date"
              required
              defaultValue={eightWeeks}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ border: "1px solid #e4e4e7", background: "#fafafa", color: "#18181b" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#52525b" }}>
              Cohort Size
            </label>
            <input
              name="cohort_size"
              type="number"
              defaultValue={48}
              min={1}
              max={200}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ border: "1px solid #e4e4e7", background: "#fafafa", color: "#18181b" }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)" }}
          >
            Create Program
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default async function ProgramPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [programs] = await Promise.all([getPrograms()]);

  const active    = programs.find((p) => p.status === "active") ?? null;
  const nonActive = programs.filter((p) => p.status !== "active");

  return (
    <div className="max-w-3xl space-y-6">

      {/* Active program card */}
      {active ? (
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "linear-gradient(135deg, #f0ebff 0%, #ede4ff 100%)",
            border:     "1px solid #c4b8f5",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status="active" />
                <span className="text-xs" style={{ color: "#7c5cbf" }}>Current Program</span>
              </div>
              <h2 className="text-xl font-bold" style={{ color: "#18181b" }}>
                {active.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: "#52525b" }}>
                {formatDate(active.start_date)} – {formatDate(active.end_date)}
              </p>
            </div>
            <StatusAction program={active} />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "Cohort Size",      value: active.cohort_size },
              { label: "Pods Target",      value: Math.floor(active.cohort_size / 6) },
              { label: "Weeks Remaining",  value: weeksRemaining(active.end_date) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl px-4 py-3 text-center"
                style={{ background: "rgba(255,255,255,0.6)" }}
              >
                <p className="text-2xl font-bold" style={{ color: "#6c3fd4" }}>{value}</p>
                <p className="text-xs mt-0.5"    style={{ color: "#7c5cbf" }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <a
              href="/staff/pods"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: "#6c3fd4" }}
            >
              Manage Pods →
            </a>
            <a
              href="/staff/members"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: "#ffffff", color: "#6c3fd4", border: "1px solid #c4b8f5" }}
            >
              View Members →
            </a>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "#f4f4f5", border: "2px dashed #d4d4d8" }}
        >
          <p className="text-sm font-medium" style={{ color: "#52525b" }}>No active program</p>
          <p className="text-xs mt-1"        style={{ color: "#a1a1aa" }}>
            Create a program below and activate it when you're ready to launch.
          </p>
        </div>
      )}

      {/* Create program form */}
      <CreateProgramForm />

      {/* Past / draft programs */}
      {nonActive.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a1a1aa" }}>
            All Programs
          </h3>
          <div className="space-y-2">
            {nonActive.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "#ffffff", border: "1px solid #e4e4e7" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#18181b" }}>{p.name}</p>
                  <p className="text-xs mt-0.5"      style={{ color: "#a1a1aa" }}>
                    {formatDate(p.start_date)} – {formatDate(p.end_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <StatusAction program={p} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
