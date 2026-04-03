import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveProgram, getMembersWithPodStatus } from "@/app/actions/pods";

// ── Search form ───────────────────────────────────────────────────

function SearchBar({ value }: { value: string }) {
  return (
    <form method="GET" className="flex items-center gap-2">
      <input
        name="q"
        defaultValue={value}
        placeholder="Search by name…"
        className="flex-1 max-w-xs rounded-lg px-3 py-2 text-sm outline-none"
        style={{ border: "1px solid #e4e4e7", background: "#fafafa", color: "#18181b" }}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ background: "#f0ebff", color: "#6c3fd4" }}
      >
        Search
      </button>
      {value && (
        <a
          href="/staff/members"
          className="px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: "#a1a1aa" }}
        >
          Clear
        </a>
      )}
    </form>
  );
}

// ── Role badge ────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const isPa = role === "peer_ambassador";
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: isPa ? "#fff4e6" : "#f0ebff",
        color:      isPa ? "#a05a00" : "#6c3fd4",
      }}
    >
      {isPa ? "PA" : "Member"}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { q } = await searchParams;
  const search = q?.trim() ?? "";

  const program = await getActiveProgram();
  // Pass empty string when no active program — getMembersWithPodStatus will return all members as unassigned
  const memberList = await getMembersWithPodStatus(program?.id ?? "", search);

  const assigned   = memberList.filter((m) => m.pod_id !== null).length;
  const unassigned = memberList.filter((m) => m.pod_id === null).length;

  return (
    <div className="max-w-4xl space-y-5">

      {/* No active program notice */}
      {!program && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: "#fff4e6", border: "1px solid #fed7aa" }}
        >
          <span style={{ color: "#a05a00" }}>⚠</span>
          <p className="text-sm" style={{ color: "#a05a00" }}>
            No active program.{" "}
            <a href="/staff/program" className="font-semibold underline">
              Set up a program
            </a>{" "}
            to see pod assignments.
          </p>
        </div>
      )}

      {/* Summary bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {[
            { label: "Total",      value: memberList.length },
            { label: "Assigned",   value: assigned          },
            { label: "Unassigned", value: unassigned        },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl px-4 py-2 text-center"
              style={{ background: "#ffffff", border: "1px solid #e4e4e7" }}
            >
              <p className="text-lg font-bold" style={{ color: "#6c3fd4" }}>{value}</p>
              <p className="text-xs"           style={{ color: "#a1a1aa" }}>{label}</p>
            </div>
          ))}
        </div>
        <div className="ml-auto">
          <SearchBar value={search} />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e4e4e7" }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[auto_1fr_120px_160px_80px] items-center px-5 py-2 gap-4"
          style={{ background: "#fafafa", borderBottom: "1px solid #e4e4e7" }}
        >
          <div />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a1a1aa" }}>Name</p>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a1a1aa" }}>Role</p>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a1a1aa" }}>Pod</p>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a1a1aa" }}>Action</p>
        </div>

        {memberList.length === 0 ? (
          <p className="px-5 py-8 text-sm text-center" style={{ color: "#a1a1aa" }}>
            {search ? `No members matching "${search}"` : "No members yet."}
          </p>
        ) : (
          memberList.map((m, i) => (
            <div
              key={m.id}
              className="grid grid-cols-[auto_1fr_120px_160px_80px] items-center px-5 py-3 gap-4"
              style={i < memberList.length - 1 ? { borderBottom: "1px solid #f4f4f5" } : undefined}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #a799ed 0%, #7c5cbf 100%)" }}
              >
                {m.avatar_url
                  ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                  : m.display_name?.charAt(0).toUpperCase() ?? "?"
                }
              </div>

              {/* Name */}
              <p className="text-sm font-medium truncate" style={{ color: "#18181b" }}>
                {m.display_name ?? "Unknown"}
              </p>

              {/* Role */}
              <RoleBadge role={m.role} />

              {/* Pod */}
              {m.pod_id ? (
                <a
                  href={`/staff/pods/${m.pod_id}`}
                  className="text-sm truncate hover:underline"
                  style={{ color: "#6c3fd4" }}
                >
                  {m.pod_name ?? "Pod"}
                </a>
              ) : (
                <span className="text-sm" style={{ color: "#d4d4d8" }}>Unassigned</span>
              )}

              {/* Action */}
              <a
                href={m.pod_id ? `/staff/pods/${m.pod_id}` : "/staff/pods"}
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: "#8370d4" }}
              >
                {m.pod_id ? "View Pod" : "Assign →"}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
