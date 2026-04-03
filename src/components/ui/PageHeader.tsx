// Shared full-width page header banner for member-app sub-pages.
// Used by: /schedule, /settings, /support
// Profile uses a custom cover-photo header and is intentionally different.

import type { ReactNode } from "react";

interface PageHeaderProps {
  title:        string;
  subtitle?:    string;
  /** Small eyebrow accent colour (also used for "SOUL SEATED" label). */
  accentColor:  string;
  /** CSS background value — gradient string or CSS variable. */
  gradient:     string;
  /** Top-right decorative blob — full radial-gradient(...) string. */
  blob1?:       string;
  /** Bottom-left decorative blob — full radial-gradient(...) string. */
  blob2?:       string;
  /** Optional icon placed to the left of the title block. */
  icon?:        ReactNode;
  /** Border colour for the icon container. Defaults to a neutral lavender. */
  iconBorder?:  string;
}

export default function PageHeader({
  title,
  subtitle,
  accentColor,
  gradient,
  blob1,
  blob2,
  icon,
  iconBorder = "rgba(167,153,237,0.25)",
}: PageHeaderProps) {
  return (
    <header
      className="relative w-full overflow-hidden px-5 pt-6 pb-8"
      style={{ background: gradient }}
    >
      {/* Decorative blobs */}
      {blob1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
          style={{ background: blob1 }}
        />
      )}
      {blob2 && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 w-24 h-24 rounded-full"
          style={{ background: blob2 }}
        />
      )}

      {/* Content row — icon variant or plain */}
      <div className={`relative${icon ? " flex items-center gap-4" : ""}`}>
        {icon && (
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background:     "rgba(255,255,255,0.55)",
              backdropFilter: "blur(8px)",
              border:         `1px solid ${iconBorder}`,
            }}
          >
            {icon}
          </div>
        )}

        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: accentColor }}
          >
            Soul Seated
          </p>
          <h1
            className="font-display text-2xl font-bold leading-tight"
            style={{ color: "#414651" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-sm ${icon ? "mt-0.5" : "mt-1"}`}
              style={{ color: "rgba(65,70,81,0.70)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
