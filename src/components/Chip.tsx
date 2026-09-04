import type { HTMLAttributes } from "react";

/**
 * Chip is ONE generic primitive. It knows nothing about specific product
 * labels — those live as documented examples in `chipCatalog.ts`. Adding a
 * new chip label to the product means adding a catalog entry, not changing
 * this component.
 *
 * For a match-timeline post (Goal/Save/Substitution/...), use `PostCard`
 * instead — it bakes in the design system's post-card color rule (color
 * reserved for Goal and card events, everything else neutral) so new post
 * types can't accidentally pick up a color. Chip is for standalone tags —
 * status badges, roster labels, provenance notes.
 */
export type ChipTone = "live" | "neutral" | "success" | "warning" | "danger" | "provenance" | "info";

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "className"> {
  tone: ChipTone;
  label: string;
  className?: string;
}

const TONE_CLASSES: Record<ChipTone, string> = {
  live: "bg-brand-red text-surface",
  neutral: "bg-divider text-text-secondary",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning-text",
  danger: "bg-danger-tint text-danger",
  provenance: "bg-brand-tint text-brand-red",
  info: "bg-info-tint text-info",
};

export function Chip({ tone, label, className, ...rest }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-body-13 font-bold leading-none ${TONE_CLASSES[tone]} ${className ?? ""}`}
      {...rest}
    >
      {tone === "live" ? (
        <span className="h-1.5 w-1.5 rounded-pill bg-surface animate-pulse" aria-hidden="true" />
      ) : null}
      {label}
    </span>
  );
}
