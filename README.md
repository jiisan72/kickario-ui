# @kickario/ui

The Kickario design system: tokens (colors, spacing, type, radius,
elevation) and the React components built on them, generated from the
Figma "Matchday Design System" Foundations frame. Every Kickario app uses
it — `jiisan72/kickario` (the main app, live at kickario.com) and
`jiisan72/kickario-trainer` (Kickario Trainer) — so a change here reaches
all of them.

## Using it from an app

Depend on it by git URL (there's no npm registry involved):

```json
"dependencies": {
  "@kickario/ui": "github:jiisan72/kickario-ui#main"
}
```

`npm install` clones it and runs its `prepare` script, which builds
`dist/` — so a fresh install takes a few seconds longer than a registry
package, and needs `git` on the machine. Pin to a commit
(`#<sha>`) instead of `#main` when an app needs a frozen version.

Then, in the app:

```ts
// main.tsx — component styles
import "@kickario/ui/styles.css";

// anywhere — components and tokens
import { Button, Card, kickarioTheme } from "@kickario/ui";
```

```ts
// tailwind.config.ts — same theme as the design system, so the app's
// own utility classes resolve to the same tokens
import type { Config } from "tailwindcss";
import { kickarioTheme } from "@kickario/ui/tokens";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: kickarioTheme },
} satisfies Config;
```

`@kickario/ui/tokens` is a React-free entry — Tailwind loads its config in
plain Node, where the component bundle's `react/jsx-runtime` import would
just be dead weight.

### Your product's color

The components paint their interactive states with the `accent*` colors
— Matchday's orange by default. Those five colors are bound to CSS custom
properties, so an app with its own product color overrides them once, in
its own stylesheet, and every Button/Toggle/Radio/SegmentedControl/
BottomNav follows:

```css
/* channel triplets, not hex — Tailwind's opacity modifiers need them */
:root {
  --md-color-accent-rgb: 20 153 84;
  --md-color-on-accent-rgb: 255 255 255;
  --md-color-accent-strong-rgb: 13 122 66;
  --md-color-accent-text-rgb: 13 122 66;
  --md-color-accent-tint-rgb: 221 246 231;
}
```

(`kickario-trainer`'s `src/index.css` is the live example.) Check the
contrast of your `on-accent` on your `accent` before shipping — the
Matchday pair is measured in `src/tokens.ts`.

### Picking up a change

`npm install` in an app builds the commit its `package-lock.json` pins,
not whatever `main` is now — `#main` in `package.json` does not float.
After a change lands here, run `npm update @kickario/ui` in the app and
commit its lockfile; that is the deploy.

## Rules for products

Kickario is one house with several rooms (Club, Team, Matchday, Trainer).
These rules are what make a room recognizably part of the house while
keeping its own color — and what make "change the green" a one-line
edit here instead of a hunt through an app. Every app runs the check at
the end in CI; Trainer was the pilot.

1. **A product is declared, not styled.** `<html data-product="trainer">`
   is the entire theme. `src/tokens.css` maps that attribute to the
   product's accent palette; the app restates nothing. To change a
   product's color, edit the block in `tokens.css` and bump the pin.
2. **Apps use semantic tokens only.** `accent`, `accent-text`,
   `accent-strong`, `accent-tint`, `on-accent`, the neutrals, and the
   state colors. Never `brand-*` (that is the parent brand's own red,
   reserved for Kickario-the-brand marks), never a hex, never Tailwind's
   default palette. If a color is missing, add a token here first.
3. **Components come from the system.** `Button`, `Input`,
   `SegmentedControl`, `Card`, `SectionHeading`, `BottomNav`, `Toggle`,
   `Radio`, `Chip`, `Icon`. An app does not hand-roll a pill button or a
   tab bar. A component that's missing gets added here, then used —
   the shared component is what carries the product color through.
4. **Type and target floors.** Buttons 15px (`primary`/`secondary`/
   `bare`); tab labels 13px; body text 13px minimum; SegmentedControl's
   12px labels are the one control-label exception. Every interactive
   element is at least 44px tall.
5. **Five tabs, maximum.** More screens than that fold into groups with
   a secondary row (see Trainer's Progress/Learn tabs).
6. **Icons live in the sprite.** A new icon is drawn to the System/UI
   set's style and added to `src/icons/sprite.svg` + `IconName`, not
   inlined in a page.
7. **The product mark is the brand's.** Favicons and shields come from
   the family logo set in `jiisan72/kickario-brand/frontend/public/logos`.
8. **Propagation is the lockfile bump.** One change here, then
   `npm update @kickario/ui` per app. Nothing flows automatically, and
   nothing is copied by hand.

### The check

```bash
npx kickario-ui-check src index.html            # in an app
npx kickario-ui-check src index.html --allow brand-token   # the Matchday app
```

It fails CI on `brand-*` classes, literal hex colors, Tailwind palette
colors, any `text-[<13px]`, and a missing `data-product`; it warns on
pill-shaped hand-rolled `<button>`s and stray 11–12px tiers. A line that
must break a rule for a documented reason carries `ds-allow` in a comment
on that line.

## Working on it

```bash
npm install
npm run build       # dist/ — kickario-ui.{js,cjs,css}, tokens.{js,cjs,css}, .d.ts
npm run typecheck
```

To see a change in an app before pushing it, `npm link` from here and
`npm link @kickario/ui` in the app; or push to a branch and point the
app's dependency at `#that-branch`. Once it's on `main`, every app picks
it up on its next `npm install` (or `npm update @kickario/ui`).

## History

Lived at `packages/ui` inside `jiisan72/kickario` until 2026-09-09, when
Kickario Trainer became its own repo and needed the same components. The
commit history here is that directory's, split out with `git subtree`.
