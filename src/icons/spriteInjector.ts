// eslint-disable-next-line import/no-unresolved -- Vite's `?raw` import suffix
import spriteMarkup from "./sprite.svg?raw";

let injected = false;

/**
 * Injects the icon sprite's <symbol> defs into the document once, so any
 * <Icon> anywhere on the page can reference them via <use href="#icon-...">
 * without every consumer having to remember to mount a sprite element.
 */
export function ensureIconSpriteInjected(): void {
  if (injected || typeof document === "undefined") return;
  injected = true;

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "absolute";
  container.style.width = "0";
  container.style.height = "0";
  container.style.overflow = "hidden";
  container.innerHTML = spriteMarkup;
  document.body.appendChild(container);
}
