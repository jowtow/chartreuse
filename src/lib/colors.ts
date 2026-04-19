import { ColorEntry } from "@/types/game";

/**
 * A curated set of CSS named colors used in the game.
 * Each entry has the human-readable name (as typed in CSS) and its hex value.
 */
export const CSS_COLORS: ColorEntry[] = [
  { name: "chartreuse", hex: "#7fff00" },
  { name: "fuchsia", hex: "#ff00ff" },
  { name: "goldenrod", hex: "#daa520" },
  { name: "coral", hex: "#ff7f50" },
  { name: "crimson", hex: "#dc143c" },
  { name: "cyan", hex: "#00ffff" },
  { name: "deepskyblue", hex: "#00bfff" },
  { name: "dodgerblue", hex: "#1e90ff" },
  { name: "firebrick", hex: "#b22222" },
  { name: "forestgreen", hex: "#228b22" },
  { name: "gold", hex: "#ffd700" },
  { name: "hotpink", hex: "#ff69b4" },
  { name: "indianred", hex: "#cd5c5c" },
  { name: "indigo", hex: "#4b0082" },
  { name: "khaki", hex: "#f0e68c" },
  { name: "limegreen", hex: "#32cd32" },
  { name: "magenta", hex: "#ff00ff" },
  { name: "mediumorchid", hex: "#ba55d3" },
  { name: "mediumturquoise", hex: "#48d1cc" },
  { name: "navy", hex: "#000080" },
  { name: "olive", hex: "#808000" },
  { name: "orangered", hex: "#ff4500" },
  { name: "orchid", hex: "#da70d6" },
  { name: "peru", hex: "#cd853f" },
  { name: "plum", hex: "#dda0dd" },
  { name: "royalblue", hex: "#4169e1" },
  { name: "salmon", hex: "#fa8072" },
  { name: "seagreen", hex: "#2e8b57" },
  { name: "sienna", hex: "#a0522d" },
  { name: "skyblue", hex: "#87ceeb" },
  { name: "slateblue", hex: "#6a5acd" },
  { name: "springgreen", hex: "#00ff7f" },
  { name: "steelblue", hex: "#4682b4" },
  { name: "tan", hex: "#d2b48c" },
  { name: "teal", hex: "#008080" },
  { name: "thistle", hex: "#d8bfd8" },
  { name: "tomato", hex: "#ff6347" },
  { name: "turquoise", hex: "#40e0d0" },
  { name: "violet", hex: "#ee82ee" },
  { name: "yellowgreen", hex: "#9acd32" },
];

/** Groups for upgrade-based color replacements */
export const BLUE_COLORS = CSS_COLORS.filter((c) =>
  ["deepskyblue", "dodgerblue", "royalblue", "steelblue", "skyblue", "navy"].includes(c.name)
);

export const PURPLE_COLORS = CSS_COLORS.filter((c) =>
  ["indigo", "slateblue", "mediumorchid", "orchid", "plum", "violet", "thistle"].includes(c.name)
);

export function getColorByName(name: string): ColorEntry | undefined {
  return CSS_COLORS.find((c) => c.name === name);
}

/** Pick a random color from the list */
export function randomColor(pool: ColorEntry[]): ColorEntry {
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Build the color cycling pool for a round.
 * The target color is included at least once, plus N random others.
 */
export function buildColorPool(
  target: ColorEntry,
  totalColors: number,
  extras?: ColorEntry[]
): ColorEntry[] {
  const base = extras ?? CSS_COLORS;
  const others = base.filter((c) => c.name !== target.name);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const pool = [target, ...shuffled.slice(0, totalColors - 1)];
  return pool.sort(() => Math.random() - 0.5);
}
