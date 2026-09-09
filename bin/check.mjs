#!/usr/bin/env node
// kickario-ui-check — does an app follow the design system's rules?
//
//   npx kickario-ui-check <dir-or-file>... [--allow <regex>]...
//
// Scans .tsx/.ts/.jsx/.js/.css/.html under the given paths and reports
// every line that breaks a rule from the README's "Rules for products".
// Exits 1 on any error so CI fails; warnings only print.
//
// A line that must break a rule for a documented reason carries the
// marker `ds-allow` in a comment on that same line, e.g.
//   className="text-brand-red"   // ds-allow: LIVE treatment, see PR #93
// `--allow <regex>` skips a rule for a whole run (the Matchday app passes
// `--allow brand-red` because it is the parent brand's own app).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const args = process.argv.slice(2);
const allow = [];
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--allow") allow.push(new RegExp(args[++i]));
  else if (args[i] === "--help" || args[i] === "-h") {
    console.log("usage: kickario-ui-check <dir-or-file>... [--allow <regex>]...");
    process.exit(0);
  } else targets.push(args[i]);
}
if (targets.length === 0) {
  console.error("kickario-ui-check: give it at least one directory or file (the app's src/, and its index.html)");
  process.exit(2);
}

const EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".css", ".html"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".git"]);

function* walk(p) {
  const st = statSync(p);
  if (st.isFile()) {
    if (EXT.has(extname(p))) yield p;
    return;
  }
  for (const e of readdirSync(p, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) yield* walk(join(p, e.name));
    } else if (EXT.has(extname(e.name))) yield join(p, e.name);
  }
}

const TAILWIND_PALETTE =
  "(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)";

// [id, level, regex, message]. Regexes run per line.
const RULES = [
  [
    "brand-token",
    "error",
    /\b(?:bg|text|border|ring|fill|stroke|from|to|via|decoration|outline|accent|divide|placeholder)-brand-(?:red|green|strong|tint)\b/,
    "brand-* is the parent brand's own color, defined in the design system — a product uses the semantic accent* tokens (bg-accent, text-accent-text, bg-accent-tint, ...) and gets its color from data-product",
  ],
  [
    "hex-color",
    "error",
    /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?![\w-])/,
    "no literal colors in an app — every color is a token; add missing ones to the design system",
  ],
  [
    "tailwind-palette",
    "error",
    new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|to|via|divide|placeholder)-${TAILWIND_PALETTE}-[0-9]{2,3}\\b`),
    "Tailwind's default palette isn't the design system's; use the token names",
  ],
  [
    "type-floor",
    "error",
    /\btext-\[(?:[0-9]|1[0-2])(?:\.\d+)?px\]/,
    "nothing below 13px in an app (buttons 15px, tab labels 13px, body 13px); control labels at 12px come from SegmentedControl, not from a page",
  ],
  [
    "small-tier",
    "warn",
    /\btext-(?:body-12|eyebrow-11)\b/,
    "the 11-12px tiers are field-caption/control-label tiers the shared Input and SegmentedControl already apply — check this isn't standing in for a section heading or a button",
  ],
  [
    "handrolled-pill",
    "warn",
    /<button\b[^>]*className=[^>]*\brounded-pill\b/,
    "a pill-shaped <button> is what @kickario/ui's Button is for (variant primary/secondary/compact/bare); keep a custom <button> only for a control that isn't one",
  ],
];

// index.html must declare the product.
function checkHtml(file, text) {
  if (!/<html\b[^>]*\bdata-product="(?:matchday|trainer|club|team)"/.test(text)) {
    return [
      {
        file,
        line: (text.split("\n").findIndex((l) => /<html\b/.test(l)) ?? 0) + 1,
        level: "error",
        id: "data-product",
        msg: 'the <html> element must declare which product this is — data-product="trainer" — that attribute IS the theme',
      },
    ];
  }
  return [];
}

const findings = [];
let files = 0;
for (const t of targets) {
  for (const file of walk(t)) {
    files++;
    const text = readFileSync(file, "utf8");
    if (extname(file) === ".html") {
      findings.push(...checkHtml(file, text));
      continue;
    }
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (/ds-allow/.test(line)) return;
      for (const [id, level, re, msg] of RULES) {
        if (!re.test(line)) continue;
        if (allow.some((a) => a.test(id) || a.test(line))) continue;
        findings.push({ file, line: i + 1, level, id, msg });
      }
    });
  }
}

const cwd = process.cwd();
let errors = 0;
for (const f of findings.sort((a, b) => (a.file + a.line).localeCompare(b.file + b.line))) {
  if (f.level === "error") errors++;
  console.log(`${relative(cwd, f.file)}:${f.line}: ${f.level}: [${f.id}] ${f.msg}`);
}
console.log(
  `\nkickario-ui-check: ${files} files, ${errors} error${errors === 1 ? "" : "s"}, ${findings.length - errors} warning${findings.length - errors === 1 ? "" : "s"}`,
);
process.exit(errors ? 1 : 0);
