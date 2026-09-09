# @kickario/ui — Lessons learned

Non-obvious findings worth not rediscovering. The Brand DNA section in
`jiisan72/kickario`'s `CLAUDE.md` is the north star for anything
visual here; it isn't repeated in this file.

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
- Any commit to `main` is live for every app on its next `npm install`.
  There's no version gate; pin apps to a `#<sha>` if a change needs to
  roll out one app at a time.

## Environment

- `SegmentedControl.tsx` documents the flex `min-width: auto` overflow
  gotcha; it has bitten every app since. `min-w-0` on the flex child.
