export default function GuidePage() {
  return (
    <div className="px-4 pt-6 space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-[--color-foreground]">My Guide</h1>
        <p className="text-sm text-[--color-muted]">Your dedicated 1:1 support</p>
      </header>

      {/* Guide profile placeholder */}
      <section className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 space-y-1">
        <p className="text-sm font-medium text-[--color-foreground]">
          Placeholder — Guide profile card
        </p>
        <p className="text-xs text-[--color-muted]">Name · availability status · areas of focus</p>
      </section>

      {/* Upcoming sessions */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
          Upcoming 1:1 Sessions
        </h2>
        <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 space-y-1">
          <p className="text-sm font-medium text-[--color-foreground]">
            Placeholder — session list
          </p>
          <p className="text-xs text-[--color-muted]">Coming soon</p>
        </div>
      </section>

      {/* Async messaging */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
          Messages
        </h2>
        <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 space-y-1">
          <p className="text-sm font-medium text-[--color-foreground]">
            Placeholder — async chat thread
          </p>
          <p className="text-xs text-[--color-muted]">On-call: Coming soon</p>
        </div>
      </section>

      {/* Check-ins */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
          Check-ins
        </h2>
        <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 space-y-1">
          <p className="text-sm font-medium text-[--color-foreground]">
            Placeholder — check-in form
          </p>
          <p className="text-xs text-[--color-muted]">Coming soon</p>
        </div>
      </section>
    </div>
  );
}
