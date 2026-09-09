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
