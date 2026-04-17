import { UpgradeId } from "@/types/game";
import { HitRating } from "@/types/game";

// ─── Timing constants ────────────────────────────────────────────────────────

/** Beat cycle duration in ms (base) */
export const BASE_BEAT_MS = 1600;

/** Minimum beat duration — the game can't go faster than this */
export const MIN_BEAT_MS = 500;

/** How much faster each round gets (ms reduction per round) */
export const BEAT_SPEEDUP_PER_ROUND = 40;

/** How many colors cycle in the shape pool */
export const BASE_COLOR_POOL_SIZE = 6;

/** Number of beat cycles before a new target color is auto-selected */
export const BEATS_PER_ROUND = 8;

// ─── DDR Timing windows ───────────────────────────────────────────────────────
// beatProgress goes 0 → 1 (forward) then 1 → 0 (back) etc. based on a sine wave.
// "Perfect" = ring at ~1.0 (outer edge). We check absolute value.

/** Stellar window: must be within this fraction of 1.0 */
export const STELLAR_WINDOW = 0.1;

/** Great window */
export const GREAT_WINDOW = 0.22;

/** Good window */
export const GOOD_WINDOW = 0.38;

// ─── Scoring ──────────────────────────────────────────────────────────────────

export const RATING_POINTS: Record<HitRating, number> = {
  stellar: 500,
  great: 200,
  good: 75,
  miss: 0,
};

export const RATING_TOKENS: Record<HitRating, number> = {
  stellar: 5,
  great: 3,
  good: 1,
  miss: 0,
};

/** Points multiplier per round (round 1 = ×1, round 5 = ×5, etc.) */
export function getRoundMultiplier(round: number): number {
  return round;
}

// ─── Upgrade helpers ──────────────────────────────────────────────────────────

/** Extra multiplier granted by active upgrades for a given color name */
export function getUpgradeMultiplier(
  colorName: string,
  upgrades: UpgradeId[]
): number {
  if (upgrades.includes("chartreuse-bonus") && colorName === "chartreuse")
    return 10;
  if (upgrades.includes("fuschia-bonus") && colorName === "fuchsia") return 5;
  if (upgrades.includes("goldenrod-bonus") && colorName === "goldenrod")
    return 3;
  return 1;
}

/** Beat duration accounting for slowdown upgrade and round */
export function getBeatMs(round: number, upgrades: UpgradeId[]): number {
  const slowdownFactor = upgrades.includes("slowdown") ? 1.4 : 1;
  const base = Math.max(
    MIN_BEAT_MS,
    BASE_BEAT_MS - (round - 1) * BEAT_SPEEDUP_PER_ROUND
  );
  return Math.round(base * slowdownFactor);
}

/** Good zone half-width, boosted by wider-zone upgrade */
export function getGoodWindow(upgrades: UpgradeId[]): number {
  return upgrades.includes("wider-zone") ? GOOD_WINDOW * 1.6 : GOOD_WINDOW;
}

export function getGreatWindow(upgrades: UpgradeId[]): number {
  return upgrades.includes("wider-zone") ? GREAT_WINDOW * 1.5 : GREAT_WINDOW;
}

export function getStellarWindow(upgrades: UpgradeId[]): number {
  return upgrades.includes("wider-zone") ? STELLAR_WINDOW * 1.4 : STELLAR_WINDOW;
}

/**
 * Determine the hit rating from beat progress (0–1) and color match.
 * beatProgress is normalized: 0 = cycle start, 1 = peak (ring at outer edge).
 */
export function evaluateHit(
  beatProgress: number, // 0–1
  colorMatch: boolean,
  upgrades: UpgradeId[]
): HitRating {
  if (!colorMatch) return "miss";

  // Distance from the "perfect" peak (1.0)
  const dist = Math.abs(1 - beatProgress);

  if (dist <= getStellarWindow(upgrades)) return "stellar";
  if (dist <= getGreatWindow(upgrades)) return "great";
  if (dist <= getGoodWindow(upgrades)) return "good";
  return "miss";
}
