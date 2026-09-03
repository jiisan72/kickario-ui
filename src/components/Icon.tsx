import { useEffect } from "react";
import type { SVGAttributes } from "react";
import { ensureIconSpriteInjected } from "../icons/spriteInjector";

/**
 * System/UI set from the V6 design bundle's Design System Library board
 * icon library, plus a handful of earlier placeholders (shield/team/link/
 * info) kept for future consent-flow screens. The Play Casting set
 * (goal/save/foul/... — 17+ icons across General/Offense/Defense) is NOT
 * included here yet — add it when the milestone that actually builds
 * event-logging UI needs it (see docs/DESIGN-V2-HANDOFF.md's build plan),
 * not speculatively now.
 */
export type IconName =
  | "shield"
  | "team"
  | "link"
  | "info"
  | "home"
  | "schedule"
  | "cast"
  | "roster"
  | "settings"
  | "search"
  | "back"
  | "chevron"
  | "add"
  | "play"
  | "mic"
  | "edit"
  | "camera"
  | "watching"
  | "no-signal"
  // Play Casting (COMMON). Added in Milestone 5, the first milestone that
  // actually logs events — Milestone 2 deliberately left the Play Casting
  // set out until something needed it.
  | "goal"
  | "save"
  | "foul"
  | "corner"
  | "card"
  | "sub"
  // Added in the 2026-09-02 season-stats expansion, same Play Casting set.
  | "tackle"
  // Added for the Recap Audio player's transport controls (2026-09-02):
  // solid glyphs, same family as "play" above (fill, not stroke).
  | "pause"
  | "rewind"
  | "stop";

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "className"> {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className, ...rest }: IconProps) {
  useEffect(() => {
    ensureIconSpriteInjected();
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <use href={`#icon-${name}`} />
    </svg>
  );
}
