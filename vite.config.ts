import { resolve } from "node:path";
import { copyFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// Copies the raw CSS-custom-properties token file straight into dist/,
// alongside the bundled component styles, so consumers who just need
// `var(--md-color-brand-red)` etc. (no React) can import it directly.
function copyRawTokensCss(): Plugin {
  return {
    name: "copy-raw-tokens-css",
    closeBundle() {
      copyFileSync(
        resolve(__dirname, "src/tokens.css"),
        resolve(__dirname, "dist/tokens.css"),
      );
    },
  };
}

// Library-mode build for the @kickario/ui design-system package.
// Consumers (packages/web, and later real screens) import from
// "@kickario/ui" and "@kickario/ui/styles.css".
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      insertTypesEntry: true,
    }),
    copyRawTokensCss(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "KickarioUI",
      fileName: (format) => `kickario-ui.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // Emit CSS as kickario-ui.css regardless of default asset naming.
        assetFileNames: (assetInfo) =>
          assetInfo.name === "style.css" ? "kickario-ui.css" : (assetInfo.name ?? "[name][extname]"),
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
