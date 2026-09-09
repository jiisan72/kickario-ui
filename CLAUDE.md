# @kickario/ui — Lessons learned

Non-obvious findings worth not rediscovering. The Brand DNA section in
`jiisan72/kickario`'s `CLAUDE.md` is the north star for anything
visual here; it isn't repeated in this file.

**New session? Read `docs/HANDOFF-2026-09-09-design-system.md` first** —
the narrative of the split-out, the reasoning behind the token/theming
design, each consumer's state, and the ordered to-do list.

## Repo setup

- **Status (2026-09-09): split out of `jiisan72/kickario`'s
  `packages/ui` (history preserved via `git subtree split`) so
  `kickario-trainer` could share it.** Both apps depend on it by git URL
  (`github:jiisan72/kickario-ui#main`), which is why this repo is
  public: GitHub Actions' built-in token can't clone a *different*
  private repo, and both apps' CI/deploy run `npm install`.
- Because consumers install from git, **`dist/` is built by the
  `prepare` script at install time** — it is not committed. If an app's
  `npm install` shows a broken `@kickario/ui`, the build here is what
  failed; run `npm install && npm run build` in a clone of this repo to
  see the real error.
- `files` is `["dist"]`, so `src/` and `tailwind.config.ts` never reach
  consumers. Anything an app needs must come out of the build — that's
  why `src/tokens.ts` is its own entry (`@kickario/ui/tokens`) rather
  than apps importing the Tailwind config file directly like they did
  inside the monorepo.
- Changing the theme means changing `src/tokens.ts` **and** (for the raw
  CSS custom properties) `src/tokens.css` — they're maintained in
  parallel, not generated from one another.
- **A commit here reaches an app only when that app's lockfile moves.**
  Apps depend on `github:jiisan72/kickario-ui#main`, but npm resolves
  that to a commit sha in `package-lock.json` and keeps the pin on every
  later install (CI and deploys included) — `#main` does not float.
  Shipping a change is two steps: push here, then `npm update
  @kickario/ui` in the app and commit its lockfile. The upside is the
  version gate for free: an app stays on its pin until someone moves it.
- **Per-product color goes through the five `--md-color-*-rgb` custom
  properties** in `src/tokens.css` (the `accent*` Tailwind colors are
  bound to them, as `rgb(var(...) / <alpha-value>)`), not through a
  per-app build or a fork of the components. Trainer's green override
  lives in kickario-trainer's `src/index.css`. The triplet form
  ("255 153 28") is required — hex there would break `ring-accent/40`.
  Everything else in the palette (brand-red, success, danger, the
  neutrals) is literal hex and shared as-is.
- **Products are declared, not styled (2026-09-09, Trainer as pilot).**
  `<html data-product="trainer">` is an app's entire theme; the
  per-product palette blocks at the end of `src/tokens.css` are the only
  place a product's color exists. The rules an app must follow are in
  README's "Rules for products", and `bin/check.mjs`
  (`npx kickario-ui-check src index.html`) enforces the mechanical ones
  in each app's CI. When a rule and a screen disagree, the fix is a
  component or token added HERE, then used there — never a one-off in
  the app. The main (Matchday) app predates the rules and fails the
  check today (~70 findings, mostly 10–11px text and a missing
  `data-product`); it runs with `--allow brand-token` because it is the
  parent brand's own app.
- **Diverging from `jiisan72/kickario`'s design tokens is now a real
  possibility** — `packages/ui` no longer exists there, so this repo is
  the only copy. Design-system decisions recorded in that repo's
  `docs/DECISIONS.md`/`CLAUDE.md` before 2026-09-09 still apply here.

## Environment

- `SegmentedControl.tsx` documents the flex `min-width: auto` overflow
  gotcha; it has bitten every app since. `min-w-0` on the flex child.
