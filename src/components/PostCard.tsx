import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { NarratingBars } from "./NarratingBars";

/**
 * Live Cast post cards — Design System Library board's "LIVE CAST POST
 * CARDS" catalog. Every timeline/post card shares one shape: label +
 * description on the left, minute + icon on the right.
 *
 * Color is reserved for Goal (red), card events (Yellow Card amber, Red
 * Card dark red), and period markers (Kickoff/Half Time/Full Time, a
 * muted info-blue) — every other post type (Save, Corner, Tackle,
 * Substitution, Free Kick, Offside, Voice Update, General text) is
 * neutral: grey label, grey icon. That rule is baked in here via
 * `ACCENT_TONE` below, not left to whoever renders a post to remember —
 * a brand-new post `kind` nobody has added to that map yet renders
 * neutral automatically, never accidentally colored.
 *
 * Every kind also gets a right-side icon by default (`DEFAULT_ICON`
 * below), for the same "don't leave it to the caller" reason — a caller
 * can still override with an explicit `icon` prop, but nothing has ever
 * needed to.
 *
 * A Goal card keeps its left color bar (founder feedback predates this
 * file). Yellow/Red Card cards do NOT (founder feedback, 2026-09-04:
 * "they just show a colored icon ... on the right side of the card" —
 * the color bar read as a second, redundant signal once every card got
 * a right-side icon) — their icon sits in a tinted circular badge
 * instead, carrying the color on its own. Period markers never get the
 * boxed card treatment at all ("it doesn't need a card") — just the
 * same colored label/minute a boxed card would have, on the plain row
 * every neutral post already uses.
 *
 * Known kinds are typed for autocomplete; `(string & {})` keeps the prop
 * open to a kind this file doesn't know about yet without widening to a
 * bare `string` (which would lose autocomplete entirely).
 */
export type PostCardKind =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "save"
  | "foul"
  | "corner"
  | "tackle"
  | "sub"
  | "substitution"
  | "free_kick"
  | "offside"
  | "period_start"
  | "period_end"
  | "voice_update"
  | "note"
  | (string & {});

type Tone = "accent" | "warning" | "danger" | "info" | "neutral";

const ACCENT_TONE: Partial<Record<string, Tone>> = {
  goal: "accent",
  yellow_card: "warning",
  red_card: "danger",
  period_start: "info",
  period_end: "info",
};

function toneForKind(kind: PostCardKind): Tone {
  return ACCENT_TONE[kind as string] ?? "neutral";
}

/**
 * The right-side icon per kind, when the caller doesn't pass one
 * explicitly. Limited to the Play Casting icon set actually in the
 * sprite (goal/save/foul/corner/card/sub/tackle) — a kind with no
 * matching asset (period markers, water break, a free-text note) simply
 * renders no icon, same as before this map existed.
 */
const DEFAULT_ICON: Partial<Record<string, IconName>> = {
  goal: "goal",
  save: "save",
  foul: "foul",
  corner: "corner",
  yellow_card: "card",
  red_card: "card",
  sub: "sub",
  substitution: "sub",
  tackle: "tackle",
};

const TONE_BORDER: Record<Tone, string> = {
  accent: "border-l-accent",
  warning: "border-l-warning",
  danger: "border-l-danger",
  info: "border-l-info",
  neutral: "",
};

const TONE_TEXT: Record<Tone, string> = {
  accent: "text-accent-text",
  warning: "text-warning-text",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-text-secondary",
};

const TONE_ICON: Record<Tone, string> = {
  accent: "text-accent",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-text-tertiary",
};

/**
 * How a tone presents itself, beyond text/icon color — three independent
 * axes that used to each be decided by their own ad-hoc check scattered
 * through the component (`tone !== "neutral"`, `tone === "accent"`, a
 * dedicated `ICON_BADGE_TINT` lookup), which had already drifted out of
 * sync once (found in code review, 2026-09-04: `featured`'s own gate
 * still used the old `tone !== "neutral"` rule after `isCard` was given
 * an "info is never boxed" exception, so a featured+icon period marker
 * would have silently gotten an oversized icon in an unboxed row). One
 * table per tone, consulted everywhere, so the three axes can't drift
 * apart again and a new tone only has to answer three yes/no questions
 * rather than getting a bespoke exception threaded through the render
 * logic.
 */
interface ToneBehavior {
  /** The boxed, bordered card treatment vs. the plain divider row. */
  boxed: boolean;
  /** Its own left color bar when boxed (independent of `active`, which
   *  always gets one regardless of tone — see `borderColor` below). */
  borderAccent: boolean;
  /** Icon sits in a small tinted circular badge instead of a plain
   *  colored glyph — the badge IS the color signal, for a tone with no
   *  border of its own to carry it. */
  badgedIcon: boolean;
}

const TONE_BEHAVIOR: Record<Tone, ToneBehavior> = {
  accent: { boxed: true, borderAccent: true, badgedIcon: false },
  warning: { boxed: true, borderAccent: false, badgedIcon: true },
  danger: { boxed: true, borderAccent: false, badgedIcon: true },
  info: { boxed: false, borderAccent: false, badgedIcon: false },
  neutral: { boxed: false, borderAccent: false, badgedIcon: false },
};

/** The badge's own tint, for a tone with `badgedIcon: true` — kept as its own lookup (rather than folded into `ToneBehavior`) since it's a color value, not a yes/no axis like the other three. */
const TONE_BADGE_TINT: Record<Tone, string> = {
  accent: "",
  warning: "bg-warning-tint",
  danger: "bg-danger-tint",
  info: "",
  neutral: "",
};

export interface PostCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  kind: PostCardKind;
  /** e.g. 41, or "41'" — rendered as-is if a string. */
  minute?: number | string;
  label: string;
  description?: string;
  icon?: IconName;
  /** The single flagged key moment in a feed (typically the current
   *  Goal) — bigger, asymmetric-radius card treatment. Ignored for a
   *  neutral-tone kind: accent is reserved for goal/card events, so a
   *  neutral post never gets the featured card look even if asked. */
  featured?: boolean;
  /**
   * Whichever card the Recap Audio dialogue is CURRENTLY narrating —
   * driven by playback position (MatchRecap.tsx), not a fixed editorial
   * flag like `featured`. Deliberately a SEPARATE prop rather than
   * reusing `featured`: the two-host banter narrates saves, subs,
   * corners and tackles just as often as goals/cards, and `featured` is
   * intentionally inert on every neutral-tone kind (see its own comment
   * above) — a save card set `featured` would silently render
   * unchanged. `active` works on every kind, tone included, since a
   * highlight ring/tint reads correctly whether or not the card already
   * carries a tone accent.
   */
  active?: boolean;
  /** Extra content under the label/description — e.g. a substitution's
   *  OUT/IN chip pairs, or reply threads. */
  children?: ReactNode;
  className?: string;
}

export function PostCard({
  kind,
  minute,
  label,
  description,
  icon,
  featured = false,
  active = false,
  children,
  className,
  ...rest
}: PostCardProps) {
  const tone = toneForKind(kind);
  const behavior = TONE_BEHAVIOR[tone];
  const resolvedIcon = icon ?? DEFAULT_ICON[kind as string];
  // Only a tone that boxes at all can be "featured" (the bigger,
  // asymmetric-radius card) — a period marker never boxes, so it can
  // never be featured either, regardless of `featured` being passed.
  const isFeatured = featured && behavior.boxed;
  // `active` promotes even an unboxed-tone post (a save, a sub, a
  // corner, a kickoff — most of what a recap's banter actually
  // narrates) into the boxed card treatment, so the highlight always
  // renders as a distinct block rather than depending on the post
  // already boxing on its own.
  const isCard = behavior.boxed || active;

  // `active`'s bar is unconditional across every tone; otherwise only a
  // tone with its own `borderAccent` (currently just Goal) gets one —
  // Yellow/Red Card cards signal via their icon badge instead (see this
  // file's own header comment).
  const borderColor = behavior.borderAccent ? TONE_BORDER[tone] : active ? "border-l-accent" : "border-l-transparent";
  // The glow is a deliberate, narrow exception to this design system's
  // "no drop shadows anywhere" rule (tokens.ts) — it isn't decorative
  // elevation, it's a live state signal (the two-host recap dialogue is
  // narrating THIS card right now), the same category of exception the
  // focus-visible ring already is elsewhere in this codebase. #F06B00 is
  // accent's own hex (tokens.ts) — kept as an explicit rgba rather
  // than a Tailwind color utility since box-shadow needs a literal color
  // value, not a class, and "slight" is the operative word: low alpha,
  // no spread, small blur.
  const activeGlow = active ? "shadow-[0_0_10px_rgba(240,107,0,0.35)]" : "";
  const containerClasses = isCard
    ? `bg-surface border ${active ? "border-accent" : "border-border"} border-l-4 ${borderColor} ${isFeatured ? "rounded-featured" : "rounded-card-sm"} p-4 ${active ? "bg-accent-tint" : ""} ${activeGlow} transition-colors transition-shadow duration-300`
    : "border-b border-divider py-3";

  return (
    <div
      className={`flex items-start justify-between gap-3 ${containerClasses} ${className ?? ""}`}
      aria-current={active ? "true" : undefined}
      {...rest}
    >
      <div className="flex flex-col gap-1">
        {/*
          THE FEED HIERARCHY WAS INVERTED. V6's live-cast post card, read
          off the canvas verbatim:

              12px / 700 / 0.5px tracking / accent    "GOAL ALBION SM!"
              15px / 600 / #0f172a                    "#9 Marco R. scores on rebound!"

          i.e. the event TYPE is the small coloured eyebrow, and the
          human-readable sentence is the headline. This component had it
          the other way round: the label rendered `text-body-17` (15/600)
          and the description `text-body-15` (15/400) in text-secondary —
          promoting "GOAL" to the headline and demoting the line a family
          actually reads to lighter, same-size supporting text.

          That matters more than one component's metrics: PostCard renders
          every row of the Console timeline and the Stand, which is the
          screen families watch a match on, and it is the app's
          highest-traffic surface. The minute was 13/700 where V6 is
          12/700, corrected in the same pass.

          Tone colour still comes from TONE_TEXT so the post-card colour
          rule (see this file's own header comment) is unchanged — only
          the type scale moved.
        */}
        {minute !== undefined ? (
          <span className={`text-body-12 font-bold ${TONE_TEXT[tone]}`}>
            {typeof minute === "number" ? `${minute}'` : minute}
          </span>
        ) : null}
        <span
          className={`text-body-12 font-bold tracking-[0.5px] ${
            tone === "neutral" ? "text-text-secondary" : TONE_TEXT[tone]
          }`}
        >
          {label}
        </span>
        {description ? <span className="text-body-17 text-text-primary">{description}</span> : null}
        {children}
      </div>
      {active ? (
        // Right side, vertically centered regardless of how tall the
        // label/description block on the left is — `self-stretch` on
        // this wrapper matches the row's own height (the row itself
        // stays `items-start` so the LEFT content keeps its natural top
        // alignment; only this indicator centers). A pulsing 3-bar
        // equalizer (NarratingBars), not a static icon — founder
        // feedback, 2026-09-02: "Animate the cast icon when the card is
        // active. Simple lines pulsing up and down." Grey, matching the
        // static icon it replaces, deliberately NOT tone-colored — this
        // signals "being narrated right now", not the event's own
        // accent, and takes over the icon slot while active rather than
        // rendering alongside a `kind`-specific `icon` (mic for a voice
        // update, etc.), which would double up.
        <div className="flex flex-shrink-0 items-center self-stretch">
          <NarratingBars />
        </div>
      ) : resolvedIcon ? (
        behavior.badgedIcon ? (
          // Scales with `isFeatured` same as the plain-icon branch below
          // (20px/28px) — found in code review, 2026-09-04: a fixed
          // badge size regardless of `featured` would mismatch the
          // bigger `rounded-featured` card treatment around it.
          <div
            className={`flex flex-shrink-0 items-center justify-center rounded-pill ${
              isFeatured ? "h-10 w-10" : "h-8 w-8"
            } ${TONE_BADGE_TINT[tone]}`}
          >
            <Icon name={resolvedIcon} size={isFeatured ? 24 : 18} className={TONE_ICON[tone]} />
          </div>
        ) : (
          <Icon name={resolvedIcon} size={isFeatured ? 28 : 20} className={`flex-shrink-0 ${TONE_ICON[tone]}`} />
        )
      ) : null}
    </div>
  );
}
