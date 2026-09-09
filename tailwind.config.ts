import type { Config } from "tailwindcss";
import { kickarioTheme } from "./src/tokens";

// Tailwind config for building the design system itself. Consuming apps
// don't import this file (it isn't shipped — see `files` in package.json);
// they build their own config from the same theme:
//
//   import { kickarioTheme } from "@kickario/ui/tokens";
//   export default { content: [...], theme: { extend: kickarioTheme } };
//
// so every app resolves to the exact same token-backed utility classes.
const config: Config = {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: kickarioTheme,
  },
};

export default config;
