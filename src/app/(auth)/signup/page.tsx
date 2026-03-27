import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[--color-foreground]">
          Soul Seated Journey
        </h1>
        <p className="text-sm text-[--color-muted]">Create your account</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-[--color-foreground]">
            Display Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            placeholder="How would you like to be called?"
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition"
          />
        </div>

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
            autoComplete="new-password"
            required
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[--color-brand] py-3 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition"
        >
          Create account
        </button>

        <p className="text-center text-xs text-[--color-muted]">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[--color-foreground]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[--color-foreground]">
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p className="text-center text-sm text-[--color-muted]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[--color-brand] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
