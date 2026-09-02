import type { Config } from "tailwindcss";
import { kickarioTheme } from "./src/tokens";

// Shared Tailwind config for the design system. packages/web re-exports
// this (extending `content`) so both packages resolve to the exact same
// token-backed utility classes.
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,html}",
    "../web/src/**/*.{ts,tsx,html}",
    "../web/index.html",
  ],
  theme: {
    extend: kickarioTheme,
  },
};

export default config;
