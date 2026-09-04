import { Icon } from "./Icon";

/**
 * A player's photo, or a generic placeholder when there isn't one (no
 * upload yet, or the viewer isn't permitted to see it — either way the
 * server already resolved that and just sends `null`, never a raw path
 * this component would have to gate itself). Extracted from Roster.tsx's
 * original inline markup (2026-09-03) when StartingLineup.tsx needed the
 * exact same treatment — one shared component instead of two copies
 * drifting apart.
 *
 * Deliberately not a jersey-number badge on the placeholder: `display`
 * text already reads "#N Name" for a team-tier viewer
 * (naming.php's 'name_and_number' format), so a number here would just
 * repeat what sits right next to it.
 */
export interface PlayerAvatarProps {
  photoUrl: string | null;
  size?: number;
  className?: string;
}

export function PlayerAvatar({ photoUrl, size = 44, className }: PlayerAvatarProps) {
  const dimension = `${size}px`;
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        style={{ width: dimension, height: dimension }}
        className={`shrink-0 rounded-full object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <span
      style={{ width: dimension, height: dimension }}
      className={`flex shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-tertiary ${className ?? ""}`}
    >
      <Icon name="profile" size={Math.round(size * 0.45)} />
    </span>
  );
}
