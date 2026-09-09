import type { HTMLAttributes } from "react";

/**
 * The heading for a group of fields, cards, or list rows — one per
 * section, never a caption for a single field (see `Input`'s own
 * built-in label for that job).
 *
 * Deliberately a different size, weight, and color from a field label,
 * not a smaller/lighter version of the same tier. A reader scans a page
 * by finding its handful of section breaks before reading any field
 * inside one of them — a section heading has to out-rank a field label
 * at a glance, on every axis at once, or the scan doesn't work. A field
 * label only has to be legible next to the one field it names.
 *
 * Before this component, every page hand-rolled its own section divider
 * and several reached for `text-text-tertiary` (#94A3B8, ~2.6:1) doing
 * it — the same color `BottomNav` was already pulled off once for
 * failing WCAG AA, reintroduced here because there was no shared place
 * this rule lived. See docs/DESIGN-V2-HANDOFF.md §3 for the token
 * rationale and §8 for the incident.
 *
 * `tone="brand"` is for the one section on a page that's the primary
 * content, not a housekeeping group around it (e.g. Schedule's
 * "Matches on this day" versus its own secondary "Not scheduled yet").
 * It doesn't get the divider — it's usually the first thing on the
 * page, with nothing above it to separate from.
 */
export type SectionHeadingTone = "default" | "brand";

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, "className"> {
  tone?: SectionHeadingTone;
  /** A hairline rule above the heading, doing the grouping work a shadow
   *  can't in a flat/bordered design (see `Card`'s own note on borders
   *  over elevation). Off by default for `tone="brand"`; on otherwise. */
  divider?: boolean;
  className?: string;
}

const TONE_CLASSES: Record<SectionHeadingTone, string> = {
  default: "text-text-secondary",
  brand: "text-accent-text",
};

export function SectionHeading({
  tone = "default",
  divider = tone === "default",
  className,
  children,
  ...rest
}: SectionHeadingProps) {
  return (
    <h2
      className={`text-[12px] font-bold ${divider ? "mt-8 border-t border-border pt-4" : ""} ${TONE_CLASSES[tone]} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </h2>
  );
}
