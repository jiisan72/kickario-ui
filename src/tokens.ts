/**
 * Design tokens for the Kickario design system.
 *
 * Source of truth: the V6 design handoff bundle ("Kickario — 'Matchday'
 * Design System & Screens"), its Design System Library board plus the
 * LIVE CAST POST CARDS catalog on that same board, and the companion
 * design canvas built alongside it — see docs/DESIGN-V2-HANDOFF.md §3 for
 * the full old-vs-new diff and the reasoning behind each value. This
 * supersedes the original Figma "Matchday Design System" Foundations
 * frame tokens (Fraunces/Inter, warm-cream palette) — see git history for
 * that version if it's ever needed for reference.
 *
 * These values are pulled directly from the design bundle — do not
 * invent, approximate, or "round" any of them. If the Design System
 * Library board changes, update this file (and the mirrored `tokens.css`)
 * together.
 *
 * This file is consumed two ways:
 *   1. `kickarioTheme` is spread into `tailwind.config.ts`'s `theme.extend`
 *      so components use token-backed Tailwind utility classes
 *      (bg-canvas, text-text-primary, shadow-resting, rounded-card-lg, ...).
 *   2. The individual exports (colors, spacing, radius, elevation,
 *      typography) are available for any JS/TS that needs the raw value
 *      (e.g. inline styles, non-Tailwind consumers).
 *
 * See also `tokens.css` — the same values expressed as CSS custom
 * properties, for contexts that need raw CSS vars instead of Tailwind
 * classes or JS imports. Keep the two files in sync.
 */
import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------

export const colors = {
  // V6's board value is #F8FAFC — 2% off surface's #FFFFFF, so on a page
  // with several stacked cards the 1px border (Card's whole separation
  // mechanism in a no-shadow system) was the only thing telling a card
  // apart from the page behind it. Deepened here so that border has a
  // ground to actually stand out from; still light enough that no text
  // color measured against canvas elsewhere in this file needs
  // re-checking. See docs/DESIGN-V2-HANDOFF.md §3.
  canvas: "#EAEEF3",
  surface: "#FFFFFF",
  // Two distinct neutrals, not one: "border" is for card/input outlines,
  // "divider" is the hairline between list rows — the design system
  // deliberately prefers hairline-divided rows over boxed cards for
  // lists, reserving bordered cards for genuinely discrete items (a
  // team, a notification, a form section).
  border: "#E2E8F0",
  divider: "#F1F5F9",
  "text-primary": "#0F172A",
  "text-secondary": "#475569",
  "text-tertiary": "#94A3B8",
  // The form-label / small-caps-label grey. V6 sets every field label
  // (EMAIL ADDRESS, PASSWORD, ...) to #64748b, which sat between
  // text-secondary (#475569) and text-tertiary (#94A3B8) with no token of
  // its own — so Input reached for text-secondary and rendered labels
  // darker than the comps.
  //
  // CONTRAST, measured rather than estimated: 4.55:1 on canvas (#F8FAFC),
  // 4.76:1 on surface (#FFFFFF). It clears WCAG AA's 4.5:1 — but on
  // canvas it clears it by 0.05, and the auth-flow forms that use it
  // (SignIn, Register, ForgotPassword, ClaimChild, Consent, CreateClub)
  // all sit on canvas. That is a real step down from text-secondary's
  // 7.24:1 and it is accepted here only because it is the design's own
  // value and it does pass.
  //
  // Do not darken the background behind it or add a tint without
  // re-measuring, and do NOT reach for this token at sizes or weights
  // lighter than the 11px/700 labels it exists for. text-tertiary
  // (#94A3B8, ~2.6:1) fails outright, which is why BottomNav was pulled
  // off it in the Milestone 2 review — this token is one step away from
  // that mistake, not far from it.
  "text-muted": "#64748B",
  "brand-red": "#E11D48",
  // Not in the design bundle itself (no hover/pressed state is shown in a
  // static mockup) — a deliberately darker step of brand-red for
  // interactive states, same role brand-strong played in the old token
  // set.
  "brand-strong": "#BE123D",
  "brand-tint": "#FDE0E6",
  // Train's own accent, per the Cariotrain family color split (CLAUDE.md
  // Brand DNA / the Kickario Train PRD §2): "-ario" carries a
  // product-specific color, green for Train — kept as its own token
  // rather than reusing `success` below, which is a semantic state color
  // (a green toast, a passed check) and would collide with brand meaning
  // if Train's screens borrowed it for buttons/accents. Same
  // accent/strong/tint shape as brand-red above, picked at a visibly
  // different saturation/hue from `success` so the two don't read as one
  // color doing double duty.
  "brand-green": "#149954",
  "brand-green-strong": "#0D7A42",
  "brand-green-tint": "#DDF6E7",
  success: "#16A34A",
  "success-tint": "#DCFCE7",
  // Not in the V6 design bundle — added 2026-09-04 for the match-card
  // league badge (EA, in blue) once the schedule import started carrying
  // a real per-fixture league. Picked (rather than estimated) for AA
  // contrast against its own tint: 5.49:1, comfortably over the 4.5:1
  // floor and better than success's own 3.0:1 on success-tint above.
  info: "#1D4ED8",
  "info-tint": "#DBEAFE",
  // "warning" pairs two values by design, not an inconsistency: EAB308 is
  // the accent (borders, icons — e.g. a Yellow Card event's left border)
  // and B45309 is the darker, more-readable label color shown alongside
  // it. See docs/DESIGN-V2-HANDOFF.md §3.
  warning: "#EAB308",
  "warning-text": "#B45309",
  "warning-tint": "#FEF3C7",
  // Doubles as both the generic destructive/error color AND the Red Card
  // event color — the design bundle has no separate "error red" distinct
  // from Red Card's dark red.
  danger: "#B91C1C",
  // Not in the design bundle (no danger-tint sample to read off a static
  // mockup) — a light tint of danger, following the same
  // accent/tint pairing pattern as brand-tint, success-tint, and
  // warning-tint, so a danger-toned card/chip isn't visually identical to
  // an unrelated brand-toned one.
  "danger-tint": "#FEE2E2",
} as const;

// ---------------------------------------------------------------------
// Spacing scale (px). Pinned explicitly (rather than relying on Tailwind's
// default rem-based scale lining up by coincidence) so this stays correct
// even if Tailwind's defaults ever change.
// ---------------------------------------------------------------------

export const spacingScalePx = [4, 8, 12, 16, 20, 24, 32, 40] as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
} as const;

// ---------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------

export const radius = {
  input: "12px",
  // card-sm was ALSO 16px, which made `rounded-card-sm` and
  // `rounded-card-lg` render identically — two token names, one value, so
  // the distinction the component API offers was decorative. V6's own
  // radius histogram is 12px x44 / 16px x15 on card-shaped surfaces, and
  // docs/DESIGN-V2-HANDOFF.md's foundations table gives the range as
  // "12-16px" — i.e. the two ends of that range are what the two tokens
  // are for.
  "card-sm": "12px",
  "card-lg": "16px",
  pill: "999px",
  // The "Featured Timeline Card" pattern — asymmetric radius used to flag
  // the key event in a match feed, paired with a 4px solid accent-color
  // left border (see PostCard.tsx).
  featured: "4px 12px 12px 4px",
} as const;

// ---------------------------------------------------------------------
// Elevation — deliberately all "none". The design system is flat,
// bordered surfaces throughout with no drop shadows anywhere; these keys
// are kept (rather than removed) so `shadow-resting`/`shadow-tray`/etc.
// stay valid, harmless Tailwind classes on any code that hasn't been
// touched yet, instead of becoming build errors.
// ---------------------------------------------------------------------

export const elevation = {
  flat: "none",
  resting: "none",
  sheet: "none",
  tray: "none",
} as const;

// ---------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------

export const fontFamily = {
  display: ['"Geist"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
  body: ['"Geist"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
} as const;

// 0.5px — V6's actual value, measured rather than inferred.
//
// This was 0.66px, "carried over unchanged from the old token set". The
// Milestone 2 review already tried changing it to 0.5px and REVERTED, on
// two stated grounds: that 0.66px "is already within V6's documented
// 0.5-1px range", and that fixing it would mean touching ~13 hardcoded
// tracking literals "for zero visual gain".
//
// Both grounds have since failed, which is why this is being revisited
// rather than re-litigated:
//
//   1. The design source contains ZERO instances of 0.66px. Its
//      letter-spacing histogram across the V6 canvas is 0.5px x75,
//      1px x5, 0.3px x5. 0.66px was never a V6 value at all; it is a
//      leftover from the superseded Fraunces/Inter token set, so "within
//      the documented range" was true of the number and false of the
//      design.
//   2. "Zero visual gain" stopped being true. The hardcoded literals grew
//      from ~13 to 75, while 16 OTHER sites had meanwhile been written
//      with the correct 0.5px — so the app was shipping two different
//      label trackings for one tier, twice on the Console screen alone.
//      That is a visible inconsistency, not a no-op.
//
// The earlier attempt failed because it moved the token and left the
// literals behind. This change does both together: the literals are all
// normalised to 0.5px in the same commit, so the token and the pages
// agree no matter which one a reader looks at.
export const eyebrowLetterSpacing = "0.5px";

/** Named text styles, for reference and for any non-Tailwind consumer. */
export const typography = {
  "display-32": {
    fontFamily: fontFamily.display.join(", "),
    fontWeight: 700,
    fontSize: "28px",
    lineHeight: "1.2",
  },
  "display-24": {
    fontFamily: fontFamily.display.join(", "),
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "1.2",
  },
  "body-17": {
    fontFamily: fontFamily.body.join(", "),
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: "1.5",
  },
  "body-15": {
    fontFamily: fontFamily.body.join(", "),
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "1.5",
  },
  "body-13": {
    fontFamily: fontFamily.body.join(", "),
    fontWeight: 400,
    fontSize: "13px",
    lineHeight: "1.4",
  },
  "eyebrow-11": {
    fontFamily: fontFamily.body.join(", "),
    fontWeight: 700,
    fontSize: "11px",
    lineHeight: "1.3",
    letterSpacing: eyebrowLetterSpacing,
    color: colors["brand-red"],
    textTransform: "uppercase",
  },
  // The tiers added for the sizes V6 actually uses. Mirrored here as well
  // as in kickarioTheme.fontSize and tokens.css, because this file's
  // header declares `typography` is "for any non-Tailwind consumer" —
  // leaving them out would make that export quietly incomplete, which is
  // the same two-sources-drifting problem the header warns about.
  "body-14": {
    fontFamily: fontFamily.body.join(", "),
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "1.5",
  },
  "body-12": {
    fontFamily: fontFamily.body.join(", "),
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "1.4",
  },
  "micro-10": {
    fontFamily: fontFamily.body.join(", "),
    fontWeight: 500,
    fontSize: "10px",
    lineHeight: "1.3",
  },
  "display-20": {
    fontFamily: fontFamily.display.join(", "),
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "1.25",
  },
  "display-22": {
    fontFamily: fontFamily.display.join(", "),
    fontWeight: 700,
    fontSize: "22px",
    lineHeight: "1.25",
  },
  "display-26": {
    fontFamily: fontFamily.display.join(", "),
    fontWeight: 700,
    fontSize: "26px",
    lineHeight: "1.2",
  },
} as const;

// ---------------------------------------------------------------------
// Tailwind theme extension
// ---------------------------------------------------------------------

export const kickarioTheme: NonNullable<Config["theme"]>["extend"] = {
  colors,
  spacing,
  borderRadius: radius,
  boxShadow: elevation,
  fontFamily: {
    display: [...fontFamily.display],
    body: [...fontFamily.body],
  },
  fontSize: {
    // NOTE ON THE NAMES: display-32 renders 28px and body-17 renders 15px.
    // Both are inherited misnomers (the number is the OLD token set's
    // size, not this one's) and both are load-bearing across ~450 class
    // uses, so they are left alone here rather than renamed in a pass
    // that is already touching every screen. Read the value, not the name.
    "display-32": ["28px", { lineHeight: "1.2", fontWeight: "700" }],
    "display-24": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
    "body-17": ["15px", { lineHeight: "1.5", fontWeight: "600" }],
    "body-15": ["15px", { lineHeight: "1.5", fontWeight: "400" }],
    "body-13": ["13px", { lineHeight: "1.4", fontWeight: "400" }],
    // NOTE — this token canNOT carry `text-transform`, and that is a
    // Tailwind limitation, not an oversight. Tailwind's `fontSize` config
    // accepts only `lineHeight`, `letterSpacing` and `fontWeight` in its
    // options object; anything else (textTransform, color) is silently
    // DROPPED from the emitted utility. Verified against the built CSS:
    // `.text-eyebrow-11{font-size:11px;line-height:1.3;letter-spacing:.5px;font-weight:700}`
    // and nothing more.
    //
    // Worth writing down because the `typography` export below claims
    // this tier is uppercase and brand-red, and it genuinely is in the
    // design — but a reader who assumes `text-eyebrow-11` delivers that
    // will be wrong. Call sites add `uppercase` (and their own colour)
    // explicitly, which is also why the hand-rolled
    // `text-[11px] font-bold uppercase tracking-[...]` pattern exists in
    // ~20 places rather than those authors simply ignoring the token.
    //
    // The consequence to watch for: any DYNAMIC string rendered in this
    // tier without an explicit `uppercase` comes out sentence case beside
    // hardcoded ALL-CAPS literals. That is exactly what shipped on Match
    // Recap ("Goals"/"Saves"/"Cards" and "Final Result"), fixed there.
    "eyebrow-11": [
      "11px",
      { lineHeight: "1.3", fontWeight: "700", letterSpacing: eyebrowLetterSpacing },
    ],
    // ---------------------------------------------------------------
    // Tiers V6 uses heavily that had no token at all.
    //
    // Measured off the V6 canvas rather than guessed — its font-size
    // histogram is: 14px x138, 10px x117, 12px x114, 11px x109, 13px x91,
    // 15px x50, 16px x21, 24px x13, 22px x12, 20px x12, 18px x7, 17px x7,
    // 28px x3, 26px x3, 32px x2.
    //
    // The five tiers above cover 28/24/15/13/11 — so the design's single
    // MOST COMMON size (14px, 138 uses) had nowhere to land, and every
    // screen that wanted it rounded to body-13 or body-15. That is the
    // concrete mechanism behind "the font sizes are off": not sloppiness
    // in the pages, a gap in the scale.
    //
    // Added here so the fix is available; deliberately NOT yet applied
    // across every screen, because WHICH scale is authoritative is a
    // founder call — the Design System Library board declares a 5-step
    // scale while the actual screens use ~12 sizes. See the QA-pass open
    // question in docs/MVP-BUILD-LOG.md.
    "body-14": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
    "body-12": ["12px", { lineHeight: "1.4", fontWeight: "400" }],
    "micro-10": ["10px", { lineHeight: "1.3", fontWeight: "500" }],
    // A neutral `label-11` was added here and then removed again: since
    // `eyebrow-11` cannot carry text-transform (see above), the two
    // tiers' emitted utilities were byte-identical — the same
    // two-names-one-value problem that made `rounded-card-sm` and
    // `rounded-card-lg` indistinguishable. One tier, plus an explicit
    // `uppercase` where the design wants caps.
    // Heading tiers between display-24 and body-17. V6 titles are not one
    // size: Substitutions/Match Recap are 20, Settings/Starting Lineup 22,
    // Register/Forgot Password 26, Sign In 28.
    "display-20": ["20px", { lineHeight: "1.25", fontWeight: "700" }],
    "display-22": ["22px", { lineHeight: "1.25", fontWeight: "700" }],
    "display-26": ["26px", { lineHeight: "1.2", fontWeight: "700" }],
  },
  // A single keyframe, used by NarratingBars (components/NarratingBars.tsx)
  // to pulse each of its three bars independently via staggered
  // `[animation-delay:...]` arbitrary values on the same `animate-cast-bar`
  // class — one keyframe, three timings, rather than three near-identical
  // keyframes. `scaleY` (not `height`) so it never triggers layout, and
  // `transform-origin: bottom` (Tailwind's `origin-bottom`, applied at the
  // call site) is what makes it read as a level meter growing UP from its
  // own baseline rather than expanding from its center.
  keyframes: {
    "cast-bar": {
      "0%, 100%": { transform: "scaleY(0.35)" },
      "50%": { transform: "scaleY(1)" },
    },
    // A slower, gentler breathing pulse for the large "on air" cast badge
    // (MatchRecap.tsx's player Card) — a placeholder for real visuals/
    // video, per the founder's own framing: "for now, show the cast icon
    // large, pulsing while they talk." Distinct from cast-bar above
    // (which reads as a level meter reacting to speech) — this one reads
    // as "a broadcast is live," so it's a slow scale+opacity breathe
    // rather than a fast bar-height jitter.
    "cast-pulse": {
      "0%, 100%": { transform: "scale(1)", opacity: "1" },
      "50%": { transform: "scale(1.08)", opacity: "0.75" },
    },
  },
  animation: {
    "cast-bar": "cast-bar 0.9s ease-in-out infinite",
    "cast-pulse": "cast-pulse 1.6s ease-in-out infinite",
  },
};
