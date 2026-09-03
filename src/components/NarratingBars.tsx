/**
 * A small pulsing 3-bar equalizer — shown in place of the static grey
 * "cast" icon while the two-host recap dialogue is CURRENTLY narrating a
 * card (`PostCard`'s and `SponsorBanner`'s own `active` prop). "Being
 * narrated right now" is an ongoing, live state, and a static icon
 * doesn't read as one; this does.
 *
 * Deliberately its own three `<span>` bars rather than an animated
 * version of the shared `icon-cast` glyph (which IS visually the same
 * three-bar shape, see sprite.svg) — that glyph is one combined SVG
 * `<path>` used elsewhere as a plain static icon, and animating its
 * three strokes independently would mean splitting it into three
 * separate paths purely for this one caller, forking the icon in two
 * for every future use. Three plain bars get the same look with
 * independently staggered timing for free.
 *
 * Grey (text-tertiary), matching the icon it replaces — this is a
 * narration-state signal, not a tone accent.
 *
 * `motion-reduce:animate-none` on every bar — found in code review
 * (2026-09-03): this was the first infinite/continuous animation added
 * anywhere in this design system, with nothing guarding
 * `prefers-reduced-motion`. Disabling it under that OS-level preference
 * leaves the bars at their static, unanimated height (still a real
 * "currently narrating" signal via position and the card's own glow/tint
 * — see PostCard.tsx/SponsorBanner.tsx — just without the motion a
 * vestibular-disorder accommodation asks not to run indefinitely).
 */
export function NarratingBars({ className }: { className?: string }) {
  return (
    <div className={`flex h-[18px] items-end gap-[3px] ${className ?? ""}`} aria-hidden="true">
      <span className="h-[10px] w-[3px] origin-bottom animate-cast-bar rounded-pill bg-text-tertiary [animation-delay:150ms] motion-reduce:animate-none" />
      <span className="h-[14px] w-[3px] origin-bottom animate-cast-bar rounded-pill bg-text-tertiary [animation-delay:0ms] motion-reduce:animate-none" />
      <span className="h-[12px] w-[3px] origin-bottom animate-cast-bar rounded-pill bg-text-tertiary [animation-delay:300ms] motion-reduce:animate-none" />
    </div>
  );
}
