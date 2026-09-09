import type { HTMLAttributes } from "react";

/**
 * "default" is the plain surface card. Any other tone swaps the background
 * to that semantic tint — e.g. `tone="brand"` is the tinted-note-card
 * pattern (bg-accent-tint).
 *
 * Flat, bordered surface — no drop shadow (see tokens.ts's elevation
 * tokens, all "none"). A 1px border is what separates a card from the
 * canvas behind it in this design system, not elevation.
 */
export type CardTone = "default" | "brand" | "success" | "warning" | "danger";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  tone?: CardTone;
  /** Applies the standard card padding. Default true. */
  padded?: boolean;
  className?: string;
}

const TONE_CLASSES: Record<CardTone, string> = {
  default: "bg-surface border-border",
  brand: "bg-accent-tint border-accent-tint",
  success: "bg-success-tint border-success-tint",
  warning: "bg-warning-tint border-warning-tint",
  danger: "bg-danger-tint border-danger-tint",
};

/**
 * Padding is `p-[18px]`, not `p-6` (24px).
 *
 * V6's card-padding histogram has no 24px entry at all — it clusters on
 * 14/15/16/18px, with 18px the most common on the bordered, 16px-radius
 * cards this component renders. At 24px every card in the app sat 6-10px
 * roomier than the comp, and Card is used ~47 times across the screens,
 * so that compounded into the whole app reading looser than the design.
 *
 * Deliberately off the documented 4-40px spacing scale: 18px is a real
 * measured design value and the nearest scale steps (16 and 20) are both
 * wrong. An arbitrary value that matches the design beats a scale value
 * that doesn't.
 */
export function Card({ tone = "default", padded = true, className, children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-card-lg border ${TONE_CLASSES[tone]} ${padded ? "p-[18px]" : ""} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}
