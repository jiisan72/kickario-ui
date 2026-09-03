import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";

/**
 * Live Cast post cards — Design System Library board's "LIVE CAST POST
 * CARDS" catalog. Every timeline/post card shares one shape: label +
 * description on the left, minute + icon on the right. Color is reserved
 * for Goal (red) and card events (Yellow Card amber, Red Card dark red)
 * — every other post type (Save, Corner, Tackle, Substitution, Free Kick,
 * Offside, Half Time, Voice Update, General text) is neutral: no colored
 * border, grey label, grey icon. That rule is baked in here via
 * `ACCENT_TONE` below, not left to whoever renders a post to remember —
 * a brand-new post `kind` nobody has added to that map yet renders
 * neutral automatically, never accidentally colored.
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

type Tone = "accent" | "warning" | "danger" | "neutral";

const ACCENT_TONE: Partial<Record<string, Tone>> = {
  goal: "accent",
  yellow_card: "warning",
  red_card: "danger",
};

function toneForKind(kind: PostCardKind): Tone {
  return ACCENT_TONE[kind as string] ?? "neutral";
}

const TONE_BORDER: Record<Tone, string> = {
  accent: "border-l-brand-red",
  warning: "border-l-warning",
  danger: "border-l-danger",
  neutral: "",
};

const TONE_TEXT: Record<Tone, string> = {
  accent: "text-brand-red",
  warning: "text-warning-text",
  danger: "text-danger",
  neutral: "text-text-secondary",
};

const TONE_ICON: Record<Tone, string> = {
  accent: "text-brand-red",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-text-tertiary",
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
  const isFeatured = featured && tone !== "neutral";
  // `active` promotes even a neutral-tone post (a save, a sub, a corner
  // — most of what a recap's banter actually narrates) into the boxed
  // card treatment, so the highlight always renders as a distinct block
  // rather than depending on the post already having a tone accent.
  const isCard = tone !== "neutral" || active;

  const borderColor = tone !== "neutral" ? TONE_BORDER[tone] : active ? "border-l-brand-red" : "border-l-transparent";
  const containerClasses = isCard
    ? `bg-surface border ${active ? "border-brand-red" : "border-border"} border-l-4 ${borderColor} ${isFeatured ? "rounded-featured" : "rounded-card-sm"} p-4 ${active ? "bg-brand-tint" : ""} transition-colors duration-300`
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

              12px / 700 / 0.5px tracking / #e11d48   "GOAL ALBION SM!"
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
          rule (colour reserved for goals and cards, everything else
          neutral grey) is unchanged — only the type scale moved.
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
      {icon ? <Icon name={icon} size={isFeatured ? 28 : 20} className={`flex-shrink-0 ${TONE_ICON[tone]}`} /> : null}
    </div>
  );
}
