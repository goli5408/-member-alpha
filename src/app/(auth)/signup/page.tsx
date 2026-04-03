"use client";

import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { Check, X } from "lucide-react";

const RULES = [
  { id: "length",    label: "至少 12 個字元",             test: (p: string) => p.length >= 12 },
  { id: "upper",     label: "包含大寫字母（A–Z）",         test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",     label: "包含小寫字母（a–z）",         test: (p: string) => /[a-z]/.test(p) },
  { id: "digit",     label: "包含數字（0–9）",             test: (p: string) => /[0-9]/.test(p) },
  { id: "symbol",    label: "包含符號（!@#$%^&* …）",      test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, null);
  const [password, setPassword] = useState("");
  const [touched, setTouched]   = useState(false);

  const results    = RULES.map(r => ({ ...r, ok: r.test(password) }));
  const allPassed  = results.every(r => r.ok);

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[--color-foreground]">
          Soul Seated Journey
        </h1>
        <p className="text-sm text-[--color-muted]">Create your account</p>
      </div>

      <form action={action} className="space-y-4">
        {state?.error && (
          <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        {/* Display Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-[--color-foreground]">
            Display Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="How would you like to be called?"
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-[--color-foreground]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-[--color-foreground]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="建立一組強密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setTouched(true)}
            className="w-full rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm outline-none focus:border-[--color-brand] focus:ring-2 focus:ring-[--color-brand]/20 transition"
          />

          {/* Rule checklist — shows once user starts typing */}
          {touched && (
            <ul className="mt-2.5 rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 space-y-1.5">
              {results.map(({ id, label, ok }) => (
                <li key={id} className="flex items-center gap-2 text-xs">
                  <span
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      background: ok ? "rgba(74,163,89,0.15)" : "rgba(65,70,81,0.08)",
                    }}
                  >
                    {ok
                      ? <Check size={9} strokeWidth={3} style={{ color: "#3a7d44" }} />
                      : <X size={9} strokeWidth={3} style={{ color: "var(--color-muted)" }} />
                    }
                  </span>
                  <span style={{ color: ok ? "#3a7d44" : "var(--color-muted)" }}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={pending || (touched && !allPassed)}
          className="w-full rounded-xl bg-[--color-brand] py-3 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Create account"}
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
