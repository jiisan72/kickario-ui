import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  /** Label rendered above the field. */
  label: string;
  hint?: string;
  error?: string;
  className?: string;
}

/**
 * Text input with a label-above layout. Focus swaps the border color to
 * brand-red — no shadow/ring glow, matching the design system's flat,
 * bordered-surface treatment (see tokens.ts).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {/*
        V6 spells every field label exactly one way, and this is it —
        read straight off the canvas rather than approximated:

            font-size:11px; font-weight:700;
            letter-spacing:0.5px; color:#64748b;   (uppercase)

        This was `text-body-13 font-bold text-text-secondary`: 13px
        instead of 11, no tracking, sentence case instead of caps, and
        #475569 instead of #64748b. Input is imported by 15 page files, so
        every form in the product diverged from the comps in the same four
        ways at once — which is a large part of what "the font sizes are
        off" looks like in practice.

        `uppercase` is applied here rather than coming from the token:
        Tailwind's fontSize options silently drop text-transform, so
        `text-eyebrow-11` carries metrics only (see tokens.ts). Applying
        it here also means callers pass normal-cased strings and the
        component decides the presentation, so a label reads "Jersey
        number" in the source and "JERSEY NUMBER" on screen.
      */}
      <label
        htmlFor={inputId}
        className="text-eyebrow-11 uppercase text-text-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={describedById}
        className={`min-h-[44px] rounded-input border bg-surface px-4 py-3 text-body-15 text-text-primary outline-none transition-colors placeholder:text-text-tertiary ${
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-brand-red"
        }`}
        {...rest}
      />
      {error ? (
        <span id={describedById} className="text-body-13 text-danger">
          {error}
        </span>
      ) : hint ? (
        <span id={describedById} className="text-body-13 text-text-tertiary">
          {hint}
        </span>
      ) : null}
    </div>
  );
});
