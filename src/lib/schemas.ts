import { z } from "zod";

export const HitRatingSchema = z.enum(["stellar", "great", "good", "miss"]);
export const GameStatusSchema = z.enum([
  "idle",
  "playing",
  "round-complete",
  "game-over",
  "store",
]);

export const UpgradeIdSchema = z.enum([
  "wider-zone",
  "slowdown",
  "more-blues",
  "more-purples",
  "chartreuse-bonus",
  "fuchsia-bonus",
  "goldenrod-bonus",
]);

export const PlayerStatsSchema = z.object({
  userId: z.string().optional(),
  displayName: z.string().optional(),
  highScore: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
  roundsPlayed: z.number().int().nonnegative(),
  upgrades: z.array(UpgradeIdSchema),
});

export const LeaderboardEntrySchema = z.object({
  id: z.string(),
  displayName: z.string(),
  score: z.number().int().nonnegative(),
  round: z.number().int().positive(),
  createdAt: z.string().datetime(),
});

export type PlayerStats = z.infer<typeof PlayerStatsSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export type UpgradeId = z.infer<typeof UpgradeIdSchema>;
