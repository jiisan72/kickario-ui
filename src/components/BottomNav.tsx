import { Icon } from "./Icon";
import type { IconName } from "./Icon";

export interface BottomNavItem {
  key: string;
  label: string;
  icon: IconName;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

/**
 * Design System Library board's "BOTTOM TAB BAR" reference — now 5 items
 * (Home, Schedule, Cast, Roster, Settings) as of the V6 design bundle, up
 * from the original 4 (no Schedule tab). This component is item-count
 * agnostic — it renders whatever `items` it's given — so no code change
 * was needed here for the 5th item; it's on whichever screen assembles
 * the array (see packages/web's AppShell.tsx) to add it once a Schedule
 * route exists to link to.
 *
 * Flat, bordered surface — a top border, not a shadow, separates the bar
 * from the content above it (see tokens.ts's elevation tokens, all
 * "none"). No react-router dependency here by design (packages/ui has
 * none) — the consumer supplies active/onClick per item.
 */
export function BottomNav({ items, className }: BottomNavProps) {
  return (
    <nav
      className={`flex w-full items-center justify-between border-t border-border bg-surface px-4 pb-2 pt-3 ${className ?? ""}`}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
          disabled={item.disabled}
          title={item.disabled ? "Not available yet" : undefined}
          className="flex min-h-[44px] flex-1 flex-col items-center gap-1 rounded-input bg-transparent p-0 transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          {/* text-secondary, not text-tertiary — text-tertiary's #94A3B8 is
              ~2.6:1 against bg-surface, under WCAG AA's 4.5:1 for text/icons
              this size. text-secondary (#475569, ~7.5:1) is the design
              system's muted-but-readable token. */}
          <Icon name={item.icon} size={20} className={item.active ? "text-brand-red" : "text-text-secondary"} />
          <span
            className={`font-body text-[11px] ${item.active ? "font-bold text-brand-red" : "font-medium text-text-secondary"}`}
          >
            {item.label}
          </span>
          {item.active ? <span className="h-0.5 w-4 rounded-pill bg-brand-red" aria-hidden="true" /> : null}
        </button>
      ))}
    </nav>
  );
}
