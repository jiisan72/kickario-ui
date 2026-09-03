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
 */
export function NarratingBars({ className }: { className?: string }) {
  return (
    <div className={`flex h-[18px] items-end gap-[3px] ${className ?? ""}`} aria-hidden="true">
      <span className="h-[10px] w-[3px] origin-bottom animate-cast-bar rounded-pill bg-text-tertiary [animation-delay:150ms]" />
      <span className="h-[14px] w-[3px] origin-bottom animate-cast-bar rounded-pill bg-text-tertiary [animation-delay:0ms]" />
      <span className="h-[12px] w-[3px] origin-bottom animate-cast-bar rounded-pill bg-text-tertiary [animation-delay:300ms]" />
    </div>
  );
}
