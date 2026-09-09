/**
 * Generic N-option segmented pill control. NOT hardcoded to any specific
 * option set — e.g. it is the basis for both a naming-consent audience
 * tier control (team/link/public) and an identity-format control
 * (excluded/number_only/name_and_number/nickname_and_number), built by
 * passing different `options` — not by two separate components.
 */
export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  /** Greys out and disables just this option — e.g. "Nickname + #" before
   *  a nickname has been entered. Still visible (so the reason to enable
   *  it is discoverable), never hidden. */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex w-full items-center gap-0.5 rounded-pill bg-canvas p-1 ${className ?? ""}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            // min-w-0 and the tight px-1 are both load-bearing, not
            // decoration.
            //
            // min-w-0: a flex item's default `min-width: auto` refuses to
            // shrink below its own content width, so `flex-1` alone
            // silently overflows the container once labels get long
            // enough. At 375px with this component's own four-option case
            // (excluded / number_only / name_and_number /
            // nickname_and_number — the consent format control it was
            // explicitly designed for), the last option spilled ~39px past
            // the group's right edge and was clipped.
            //
            // px-1 + 11px type: with the options finally sharing width
            // evenly, the longest label still didn't fit. It wraps to two
            // lines ("Nickname" / "+ #"), but the single unbreakable word
            // "Nickname" is ~63px at 13px bold against a ~58px content
            // box, so it spilled either side of its own pill.
            //
            // The fix is the type size, not more padding-shaving: this is
            // a control label, and the design system's documented label
            // tier is 11-12px/700 (the V5/V6 artboard sets these
            // specifically at 10.5px/700 for exactly this reason). 13px
            // was the outlier. At 11px the four-option consent case fits
            // with room to spare, and the 44px minimum tap target is
            // untouched either way.
            className={`min-h-[44px] min-w-0 flex-1 rounded-pill px-1 py-2 text-[11px] font-bold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 ${
              selected
                ? "bg-accent text-on-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
