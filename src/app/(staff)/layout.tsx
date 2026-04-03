import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import StaffShell from "@/components/staff/StaffShell";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("display_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (!staff) redirect("/login");

  return (
    <StaffShell
      member={{
        name:      staff.display_name ?? "Staff",
        role:      staff.role,
        avatarUrl: staff.avatar_url ?? null,
        email:     user.email ?? "",
      }}
    >
      {children}
    </StaffShell>
  );
}
