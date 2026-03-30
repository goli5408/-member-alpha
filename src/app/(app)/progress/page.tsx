export default function ProgressPage() {
  const mockPercent = 42;

  return (
    <div className="px-4 pt-6 space-y-6 md:max-w-2xl md:mx-auto md:px-8">
      <header>
        <h1 className="text-xl font-semibold text-[--color-foreground]">My Progress</h1>
        <p className="text-sm text-[--color-muted]">Week 1 of 8</p>
      </header>

      {/* Progress bar */}
      <section className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-sm font-medium text-[--color-foreground]">Journey Progress</p>
          <p className="text-2xl font-bold text-[--color-brand]">{mockPercent}%</p>
        </div>
        <div className="h-2 w-full rounded-full bg-[--color-neutral-100] overflow-hidden">
          <div
            className="h-full rounded-full bg-[--color-brand] transition-all"
            style={{ width: `${mockPercent}%` }}
          />
        </div>
      </section>

      {/* Activity log */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            "Completed journal entry",
            "Submitted guide check-in",
            "Read: Week 1 intro article",
          ].map((activity) => (
            <div
              key={activity}
              className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-[--color-success] shrink-0" />
              <p className="text-sm text-[--color-foreground]">{activity}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
