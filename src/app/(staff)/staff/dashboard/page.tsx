import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/app/actions/staff";

const ROLE_LABELS: Record<StaffRole, string> = {
  guide:           "Guide",
  program_manager: "Program Manager",
  content_manager: "Content Manager",
  support_agent:   "Support Agent",
};

// Quick-link cards scoped by role
const QUICK_LINKS: Record<StaffRole, { label: string; href: string; description: string }[]> = {
  guide: [
    { label: "My Members",     href: "/staff/members", description: "View your caseload" },
    { label: "My Schedule",    href: "/staff/schedule", description: "Upcoming 1:1 sessions" },
    { label: "My Profile",     href: "/staff/settings", description: "Edit bio & availability" },
  ],
  program_manager: [
    { label: "Members",        href: "/staff/members",  description: "Manage cohort roster" },
    { label: "Pods",           href: "/staff/pods",     description: "Create & assign pods" },
    { label: "Program",        href: "/staff/program",  description: "Schedule & sessions" },
    { label: "Staff",          href: "/staff/settings", description: "Roles & permissions" },
  ],
  content_manager: [
    { label: "Content Library", href: "/staff/content", description: "Upload & publish content" },
  ],
  support_agent: [
    { label: "Support Queue",  href: "/staff/support",  description: "Open requests" },
    { label: "Members",        href: "/staff/members",  description: "Lookup member accounts" },
  ],
};

export default async function StaffDashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("display_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!staff) redirect("/login");
  if (!staff.is_active) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <p className="text-sm text-gray-500">
          Your account has been deactivated. Contact your Program Manager.
        </p>
      </div>
    );
  }

  const role   = staff.role as StaffRole;
  const links  = QUICK_LINKS[role] ?? [];

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-1" style={{ color: "#8370d4" }}>
          {ROLE_LABELS[role]}
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>
          Welcome back, {staff.display_name ?? "Team member"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>
          Care Team Web Tools
        </p>
      </div>

      {/* Quick links */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#aaa" }}>
          Quick access
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {links.map(({ label, href, description }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-between rounded-xl px-5 py-4 transition-shadow hover:shadow-md"
              style={{
                background:  "#ffffff",
                border:      "1px solid #e5e5e5",
              }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{label}</p>
                <p className="text-xs mt-0.5"        style={{ color: "#888" }}>{description}</p>
              </div>
              <span style={{ color: "#c4b8f5" }}>→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Placeholder notice */}
      <p className="mt-10 text-xs text-center" style={{ color: "#ccc" }}>
        More features coming in Phase 2b – 2d
      </p>
    </div>
  );
}
