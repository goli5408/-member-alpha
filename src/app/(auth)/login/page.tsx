import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo / brand */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[--color-foreground]">
          Soul Seated Journey
        </h1>
        <p className="text-sm text-[--color-muted]">Welcome back</p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-[--color-foreground]">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-[--color-foreground]">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition"
          />
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-[--color-brand] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[--color-brand] py-3 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition"
        >
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-[--color-muted]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-[--color-brand] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
