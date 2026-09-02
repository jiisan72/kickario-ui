export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
  className,
  "aria-label": ariaLabel,
}: ToggleProps) {
  const track = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ? undefined : ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-pill border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-brand-red" : "bg-canvas"
      } ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-4 w-4 rounded-pill bg-surface transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (!label) return track;

  return (
    <label
      className={`inline-flex min-h-[44px] items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      {track}
      <span className="text-body-15 text-text-primary">{label}</span>
    </label>
  );
}
