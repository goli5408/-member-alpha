export default function SchedulePage() {
  return (
    <div className="px-4 pt-6 space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-[--color-foreground]">Schedule</h1>
        <p className="text-sm text-[--color-muted]">All your upcoming events</p>
      </header>

      {/* Calendar strip placeholder */}
      <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 h-20 flex items-center justify-center">
        <p className="text-xs text-[--color-muted]">Placeholder — weekly calendar strip</p>
      </div>

      {/* Event list */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
          Upcoming
        </h2>
        <div className="space-y-3">
          {["1:1 with Guide", "Pod Session", "Live Group Session"].map((title) => (
            <div
              key={title}
              className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[--color-foreground]">{title}</p>
                <p className="text-xs text-[--color-muted]">Placeholder date · time</p>
              </div>
              <span className="rounded-lg bg-[--color-brand-light] px-2 py-0.5 text-xs font-medium text-[--color-brand]">
                Upcoming
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
