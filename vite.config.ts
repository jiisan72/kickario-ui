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
//
// Two entries:
//   index  -> dist/kickario-ui.{js,cjs}  components + tokens (needs React)
//   tokens -> dist/tokens.{js,cjs}       tokens only, no React — this is
//             what consumers' tailwind.config.ts imports for the theme,
//             since Tailwind loads its config in plain Node where the
//             component bundle's jsx-runtime import is dead weight.
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
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        tokens: resolve(__dirname, "src/tokens.ts"),
      },
      name: "KickarioUI",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const base = entryName === "index" ? "kickario-ui" : entryName;
        return `${base}.${format === "es" ? "js" : "cjs"}`;
      },
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
