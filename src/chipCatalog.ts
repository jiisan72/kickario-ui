import type { ChipTone } from "./components/Chip";

export interface ChipCatalogEntry {
  group: "Cast & Game Status" | "Content Provenance" | "Report & Safety";
  label: string;
  tone: ChipTone;
}

/**
 * Documented examples mapping the real Figma chip labels to the generic
 * `Chip` primitive's `tone` prop. This is reference/story data — not part
 * of the Chip component itself — so new product labels can be added here
 * without ever touching Chip.tsx.
 */
export const chipCatalog: ChipCatalogEntry[] = [
  // Cast & Game Status
  { group: "Cast & Game Status", label: "ON AIR", tone: "live" },
  { group: "Cast & Game Status", label: "Upcoming", tone: "neutral" },
  { group: "Cast & Game Status", label: "Completed", tone: "neutral" },
  { group: "Cast & Game Status", label: "Score suppressed", tone: "warning" },

  // Content Provenance
  { group: "Content Provenance", label: "AI-generated · reviewed", tone: "provenance" },
  { group: "Content Provenance", label: "Backfilled event", tone: "provenance" },
  { group: "Content Provenance", label: "Corrected score", tone: "provenance" },
  { group: "Content Provenance", label: "Chosen by the team", tone: "provenance" },
  { group: "Content Provenance", label: "Set by Coach Alvarez", tone: "provenance" },

  // Report & Safety
  { group: "Report & Safety", label: "Harassment", tone: "danger" },
  { group: "Report & Safety", label: "Blocked", tone: "danger" },
  { group: "Report & Safety", label: "Not collected yet", tone: "neutral" },
];
