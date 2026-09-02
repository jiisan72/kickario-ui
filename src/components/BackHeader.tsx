import { Icon } from "./Icon";

export interface BackHeaderProps {
  /**
   * Called when the back control is tapped. Pages wire this to their
   * router's programmatic back (e.g. React Router's `navigate(-1)`) so it
   * returns to whatever screen the visitor actually arrived from, never a
   * hardcoded route — packages/ui has no react-router dependency by
   * design (see BottomNav.tsx), so the caller supplies the behavior.
   */
  onBack: () => void;
  /**
   * Optional label next to the arrow. Most screens keep their own large
   * `<h1>` below this bar and leave this unset — pass a title only when a
   * screen has no page-level heading of its own to identify where the
   * back arrow landed.
   */
  title?: string;
  className?: string;
}

/**
 * The one consistent "way back" affordance for every screen outside
 * AppShell's persistent bottom tab bar (see AppShell.tsx / App.tsx).
 * Added 2026-09-02 — until now no icon-based back control existed
 * anywhere in the app; a handful of screens had a text-only "Back to X"
 * link to a hardcoded destination, or a "Go back" button that only
 * appeared in an error state. Neither was consistent or history-accurate.
 *
 * 44px min tap target per this design system's own convention (see
 * Button.tsx's compact variant, BottomNav.tsx) — the icon renders at
 * 24px, centered in a 44x44 hit area via padding, not just relying on
 * the icon's own bounding box.
 */
export function BackHeader({ onBack, title, className }: BackHeaderProps) {
  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="-ml-2.5 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-input text-text-primary transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
      >
        <Icon name="back" size={24} />
      </button>
      {title ? (
        <span className="font-body text-body-15 font-bold text-text-primary">{title}</span>
      ) : null}
    </div>
  );
}
