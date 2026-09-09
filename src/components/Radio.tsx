export interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
}

/** Checked/unchecked radio. */
export function Radio({ checked, onChange, label, name, value, disabled, className }: RadioProps) {
  return (
    <label
      className={`inline-flex min-h-[44px] items-center gap-2 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className ?? ""}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-pill border-2 border-border transition-colors peer-checked:border-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40"
      >
        <span
          className={`h-2.5 w-2.5 rounded-pill bg-accent transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
        />
      </span>
      {label ? <span className="text-body-15 text-text-primary">{label}</span> : null}
    </label>
  );
}
