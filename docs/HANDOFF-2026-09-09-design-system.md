# Design-system handoff — 2026-09-09

For the session that picks up `@kickario/ui`. This is what was done
today, why it was done that way, what it left open, and how to work in
here without relearning the gotchas. Read `README.md` ("Rules for
products") and `CLAUDE.md` alongside it; this file is the narrative,
those are the reference.

## 1. Where things stand, in one paragraph

`@kickario/ui` became its own repo this morning (split from
`jiisan72/kickario`'s `packages/ui` with history) so Kickario Trainer
could share it with the main app. Over the day it went from "a copy of
one app's components" to "the design system for a family of products":
every product's accent palette lives here and is selected by one
attribute on the app's `<html>`; the shared components paint with
semantic `accent*` tokens and therefore recolor per product with no
per-product build; the tab-bar and control label sizes were raised after
the founder called them too small; five icons were added for Trainer's
tabs; and a written rule set plus a CI check (`bin/check.mjs`) now define
what "an app is on the design system" means. Trainer was the pilot and
is being brought fully into conformance right now. The main (Matchday)
app is on an older pin and does not yet pass the check.

## 2. What was done today, and why

**Split out with history.** `git subtree split -P packages/ui` from the
main repo, so `git log` here goes back to the original Figma-derived
generation. Consumers install by git URL
(`github:jiisan72/kickario-ui#main`); `prepare` builds `dist/` on
install because `dist/` isn't committed. The repo is public on purpose:
GitHub Actions' token can't clone a different private repo, and both
apps' CI and deploys run `npm install`.

**`@kickario/ui/tokens` entry.** `files` is `["dist","bin"]`, so nothing
in `src/` reaches a consumer — an app's `tailwind.config.ts` can't
import `../ui/tailwind.config` the way it did inside the monorepo.
`src/tokens.ts` is built as a second, React-free entry so a Tailwind
config (loaded in plain Node) can `import { kickarioTheme } from
"@kickario/ui/tokens"`.

**The Matchday rebrand was ported, not lost.** The main app's PR #93
(orange product accent, new brand red, ten component changes) landed in
`packages/ui` *after* the split. It was applied here as the same diff.
Lesson: for a few hours two copies existed and drifted immediately;
there must never be two again (see §4 on kickario-brand and
kickario-club, which still vendor copies).

**Accent as CSS custom properties, not literal hex.** The five `accent*`
Tailwind colors are `rgb(var(--md-color-accent-rgb) / <alpha-value>)`.
Two reasons for that exact form: `var()` is what lets a product recolor
the shared components without a per-product build, and the RGB-triplet
form (`255 153 28`) is what keeps Tailwind's opacity modifiers working
(`ring-accent/40` is used in `Radio`; `ring-accent/20` in the main app)
— a plain hex-in-a-var breaks those silently. The derived hex-style
`--md-color-accent` properties are kept for anything reading them
directly (`tokens.css` line ~79 does).

**Products are declared, not styled.** The first version had Trainer
override the five variables in its own `index.css`. The founder pushed
back — "this should be one change in the design system" — and he was
right: the palette moved here, into per-product blocks at the end of
`src/tokens.css`, keyed by `<html data-product="trainer|matchday|club|
team">`. Values came from `jiisan72/kickario-brand`'s
`frontend/tailwind.config.ts` (the family palette), except Matchday,
which keeps the app's same-day retune (#FF991C over the brand site's
#F06B00 — a drift the brand site should resolve toward this file).
`on-accent` is chosen per product for contrast on its fill; the ratios
are in the comment. Trainer's own green changed as a side effect, from
my #149954 (white on it 3.7:1, failing AA) to the brand's #17803D
(5.0:1) — the palette being the source of truth fixed a real
accessibility problem for free.

**Label sizes.** `BottomNav` labels 11 → 13px (tab labels are
wayfinding, not captions; five 13px labels fit a 390px bar).
`SegmentedControl` 11 → 12px only: its own comment records a four-option
consent control in the main app that overflowed at 13px, and 12px is
the top of the documented 11–12px control-label tier. If someone wants
13px there, that four-option case ("Nickname + #") has to be
re-verified first.

**Icons.** `book`, `target`, `message`, `users`, `wallet` — drawn to the
System/UI set's stroke style (1.75, round caps, 24×24) rather than
imported from a library, so a Trainer tab bar reads as the same family
as Matchday's. Not from the V6 Figma bundle; if the bundle grows real
versions, replace these.

**Rules + check.** README's "Rules for products" is the contract;
`bin/check.mjs` (`npx kickario-ui-check src index.html`) fails CI on
`brand-*` classes, literal hex, Tailwind palette colors, `text-[<13px]`,
and a missing `data-product`; warns on hand-rolled pill `<button>`s and
stray 11–12px tiers. `ds-allow` on a line and `--allow <regex>` per run
cover documented exceptions. Trainer's CI runs it; the main app fails it
today (§4).

## 3. Consumers and their state

| App | Repo | Pin | Status |
| --- | --- | --- | --- |
| Trainer | `jiisan72/kickario-trainer` | `d61b5ea` | The pilot. Shell on `BottomNav` (5 tabs / 4 tabs) with a desktop sidebar; screens on semantic tokens; page-by-page pass onto `Button`/`Input`/`SegmentedControl` + desktop layouts in progress today. Check wired into CI. |
| Matchday | `jiisan72/kickario` (`packages/web`) | `bde9f43` → PR pending for `d61b5ea` + `data-product="matchday"` | Predates the rules. ~73 check findings: mostly 10–11px text, hex in `DesignSystem.tsx` (a palette page — legit `ds-allow`), hex in `Home.tsx`/`PitchMap.tsx`/`SponsorBanner.tsx`. Uses `brand-red` for the LIVE treatment by decision — runs the check with `--allow brand-token`. |
| Brand site | `jiisan72/kickario-brand` | none — vendors a copy under `frontend/src/ui/` | Its `product-*` colors are the family palette this repo now encodes. Should consume this package; until then its Matchday orange is behind. |
| Club | `jiisan72/kickario-club` | none — vendors a copy (per the brand README) | Not looked at today. |

The pin never floats: `#main` in an app's `package.json` resolves to a
commit in its lockfile, and `npm install` rebuilds that commit forever.
Shipping a change is push here, then `npm update @kickario/ui` + commit
the lockfile in each app. That is also the version gate — there is no
other.

## 4. What remains, in the order I'd do it

1. **Matchday onto the rules.** Merge the pending pin-bump PR (13px tab
   labels land there; check its five-tab bar at 390px), then work the
   check's findings. The 10–11px text is the bulk; most is eyebrow/
   caption usage that should be `SectionHeading` or 13px.
2. **One source for the palette.** `kickario-brand` and `kickario-club`
   vendor copies of an older `packages/ui`. Move both onto this package
   (git URL + `data-product`); delete the copies. The brand site's
   `productColors.ts` then reads from tokens rather than restating them.
3. **`tokens.ts` ↔ `tokens.css` are maintained in parallel.** The same
   values exist twice (TS for Tailwind, CSS custom properties for
   runtime). Generate one from the other — probably a tiny build step
   that emits `tokens.css` from `tokens.ts` — so a value can't drift.
   This is the prerequisite for a Figma-variables sync.
4. **Components Trainer had to hand-roll** (each is a signal the system
   is missing something): a multi-select chip (`ToggleChip` in
   Trainer's `Registration.tsx`), `Select` and `Textarea` styled to
   `Input`'s metrics, a side-nav for desktop (Trainer's
   `components/nav.tsx` `Shell` — the sidebar half belongs here next to
   `BottomNav`), a `SubNav` pill-link row, a `Page` width container,
   list-row and calendar-cell controls. Lift them here once the Trainer
   pass settles what they look like.
5. **A public rendered reference.** The brand site's footer links to
   this repo because the Matchday app's `/design-system` route is behind
   sign-in. Either ungate that route (it renders static local content)
   or give this repo a small docs page built from `src/`.
6. **Figma loop.** Once (3) is done: pull Figma Variables through the
   connector, regenerate `tokens.ts`, PR. Code Connect for the
   components so Dev Mode shows real source. Not automatic without
   Figma Enterprise; "you change it, say sync, it's a PR" is the
   realistic version.
7. **Versioning.** Tag releases here so an app can pin `#v0.2.0`
   instead of a sha, and keep a CHANGELOG. Cheap now, painful later.
8. **Check improvements.** Detect hand-rolled `<input>`s; treat hex in
   `.css` differently (an app shouldn't have any); a `--strict` that
   promotes the warnings.

## 5. How to work in here

```bash
npm install && npm run build && npm run typecheck
```

- Try a change in an app without pushing: `npm link` here, `npm link
  @kickario/ui` in the app; or push a branch and point the app's
  dependency at `#that-branch`.
- Verify visually the way the apps do: Playwright is available in the
  cloud environment (`import { chromium } from
  "/opt/node22/lib/node_modules/playwright/index.mjs"`, executable
  `/opt/pw-browsers/chromium`); start an app's dev server and run the
  script in the same shell command — a backgrounded server doesn't
  survive to the next tool call. `ssh-keygen`, `apt`, and Python's
  `cryptography` are absent there; don't plan on them.
- The apps' CI is the real proof that a change installs: their `npm ci`
  clones and builds this repo over the git URL on GitHub Actions.

## 6. Gotchas that cost time today

- `files: ["dist","bin"]` — anything an app needs must come out of the
  build. Adding a file to `src/` doesn't ship it.
- A push here changes nothing anywhere until each app bumps its lock.
- Opacity modifiers (`/40`) need the RGB-triplet variables; a hex in a
  var breaks them silently (the class is dropped, the ring goes default).
- `SegmentedControl` at >12px must be checked against the main app's
  four-option consent control before shipping.
- Flex children default to `min-width: auto`; every overflow bug in the
  apps so far was this. `min-w-0`.
- The main app is the parent brand's own app and legitimately uses
  `brand-red`; don't "fix" that — it runs the check with
  `--allow brand-token`.

## 7. Questions for the founder

- Should Matchday's orange be the brand site's #F06B00 or the app's
  retuned #FF991C? This file says the app's; the brand site disagrees.
- Is 12px the right floor for `SegmentedControl` labels, given the
  four-option constraint, or should that control get a two-row layout
  so 13px works everywhere?
- Which repo owns the product shields/favicons long-term — the brand
  site (today) or this package (an `assets/` export)?
