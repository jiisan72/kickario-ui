import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "compact" | "inline" | "bare";
export type ButtonTone = "default" | "destructive";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  /**
   * primary/secondary: standard-size pill buttons.
   * compact/inline: smaller pill — e.g. "Vote" / "Skip".
   * bare: text-only, no container — e.g. "I'll do this later".
   */
  variant?: ButtonVariant;
  /** destructive = "Remove comment" / "Block user" style actions. */
  tone?: ButtonTone;
  className?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-body font-bold transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-offset-2";

// "compact" and "inline" are the same visual treatment — two names for the
// same smaller pill-shaped button, per the design system's spec.
const CONTAINER_VARIANT: Record<ButtonVariant, "filled" | "outlined" | "compact" | "bare"> = {
  primary: "filled",
  secondary: "outlined",
  compact: "compact",
  inline: "compact",
  bare: "bare",
};

// Flat, bordered surfaces throughout — no drop shadows anywhere in this
// design system (see tokens.ts).
const FILLED_TONE = {
  default: "bg-brand-red text-surface hover:bg-brand-strong focus-visible:ring-brand-red",
  destructive: "bg-danger text-surface hover:opacity-90 focus-visible:ring-danger",
} as const;

const OUTLINED_TONE = {
  default:
    "bg-surface text-text-primary border border-border hover:bg-canvas focus-visible:ring-brand-red",
  destructive:
    "bg-surface text-danger border border-danger hover:bg-canvas focus-visible:ring-danger",
} as const;

const COMPACT_TONE = {
  default: "bg-brand-red text-surface hover:bg-brand-strong focus-visible:ring-brand-red",
  destructive: "bg-danger text-surface hover:opacity-90 focus-visible:ring-danger",
} as const;

const BARE_TONE = {
  default: "bg-transparent text-brand-red hover:underline focus-visible:ring-brand-red",
  destructive: "bg-transparent text-danger hover:underline focus-visible:ring-danger",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", tone = "default", className, type = "button", ...rest },
  ref,
) {
  const containerVariant = CONTAINER_VARIANT[variant];

  // 44px is the minimum comfortable tap target for a hand-held cast
  // console — primary/secondary/compact all clear it via padding+line
  // height; bare stays unconstrained since it's inline text, not a
  // discrete control.
  let variantClasses: string;
  switch (containerVariant) {
    case "filled":
      variantClasses = `rounded-pill px-6 py-3.5 text-body-15 ${FILLED_TONE[tone]}`;
      break;
    case "outlined":
      variantClasses = `rounded-pill px-6 py-3.5 text-body-15 ${OUTLINED_TONE[tone]}`;
      break;
    case "compact":
      variantClasses = `rounded-pill px-4 py-2.5 min-h-[44px] text-body-13 ${COMPACT_TONE[tone]}`;
      break;
    case "bare":
      variantClasses = `p-0 text-body-15 ${BARE_TONE[tone]}`;
      break;
  }

  return (
    <button ref={ref} type={type} className={`${BASE} ${variantClasses} ${className ?? ""}`} {...rest} />
  );
});
