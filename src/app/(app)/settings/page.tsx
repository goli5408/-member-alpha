import Link from "next/link";

const SECTIONS = [
  {
    title: "Communication & Availability",
    items: ["1:1 Availability", "Timezone"],
  },
  {
    title: "Notifications",
    items: ["Notification Frequency", "Push Notifications", "Email Reminders", "Quiet Hours"],
  },
  {
    title: "Account",
    items: ["Change Password", "Terms of Service", "Privacy Policy"],
  },
];

export default function SettingsPage() {
  return (
    <div className="px-4 pt-6 space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-[--color-foreground]">Settings</h1>
      </header>

      {SECTIONS.map(({ title, items }) => (
        <section key={title}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-2">
            {title}
          </h2>
          <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] divide-y divide-[--color-border]">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm text-[--color-foreground]">{item}</span>
                <span className="text-[--color-muted]">›</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <button className="w-full rounded-xl border border-[--color-error] py-3 text-sm font-semibold text-[--color-error] hover:bg-red-50 transition">
        Sign Out
      </button>
    </div>
  );
}
