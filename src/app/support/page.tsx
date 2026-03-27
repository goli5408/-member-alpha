export default function SupportPage() {
  return (
    <div className="px-4 pt-6 space-y-6 max-w-[430px] mx-auto">
      <header>
        <h1 className="text-xl font-semibold text-[--color-foreground]">Support</h1>
        <p className="text-sm text-[--color-muted]">We&apos;re here to help</p>
      </header>

      <form className="space-y-4">
        {/* Category */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
            Category
          </label>
          <select className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition">
            <option value="">Select a category…</option>
            <option value="logistics">Logistics</option>
            <option value="tech">Tech</option>
            <option value="emotional_support">Emotional Support</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
            Description
          </label>
          <textarea
            rows={5}
            placeholder="Describe your issue…"
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[--color-brand] py-3 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition"
        >
          Submit Request
        </button>
      </form>

      {/* Open tickets */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[--color-muted] mb-3">
          My Requests
        </h2>
        <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-4 text-sm text-[--color-muted]">
          No open requests.
        </div>
      </section>
    </div>
  );
}
