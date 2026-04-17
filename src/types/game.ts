export type HitRating = "stellar" | "great" | "good" | "miss";
export type GameStatus =
  | "idle"
  | "playing"
  | "round-complete"
  | "game-over"
  | "store";

export interface ColorEntry {
  name: string;
  hex: string;
}

export interface HitResult {
  rating: HitRating;
  points: number;
  tokens: number;
  colorMatch: boolean;
}

export interface RoundResult {
  round: number;
  score: number;
  tokensEarned: number;
  hits: HitResult[];
}

export interface GameState {
  status: GameStatus;
  round: number;
  score: number;
  tokens: number;
  targetColor: ColorEntry;
  currentShapeColorIndex: number;
  colorPool: ColorEntry[];
  beatProgress: number; // 0–1 sin-wave beat cycle progress
  lastHit: HitResult | null;
  lastHitAt: number;
  roundsPlayed: RoundResult[];
}

export type UpgradeId =
  | "wider-zone"
  | "slowdown"
  | "more-blues"
  | "more-purples"
  | "chartreuse-bonus"
  | "fuschia-bonus"
  | "goldenrod-bonus";
