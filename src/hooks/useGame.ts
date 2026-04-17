"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { ColorEntry, HitResult, GameStatus } from "@/types/game";
import { UpgradeId } from "@/types/game";
import { CSS_COLORS, BLUE_COLORS, PURPLE_COLORS, buildColorPool, randomColor } from "@/lib/colors";
import {
  getBeatMs,
  getRoundMultiplier,
  getUpgradeMultiplier,
  evaluateHit,
  RATING_POINTS,
  RATING_TOKENS,
  BASE_COLOR_POOL_SIZE,
  BEATS_PER_ROUND,
} from "@/lib/game-logic";

export interface GameSnapshot {
  status: GameStatus;
  round: number;
  score: number;
  tokens: number;
  targetColor: ColorEntry;
  shapeColor: ColorEntry;
  beatProgress: number; // 0–1 (0 = contracted, 1 = fully expanded)
  lastHit: HitResult | null;
  lastHitAt: number;
  beatsRemaining: number;
  roundMultiplier: number;
}

export function useGame(
  upgrades: UpgradeId[],
  onTokensEarned: (n: number) => void
) {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState<ColorEntry>(CSS_COLORS[0]);
  const [colorPool, setColorPool] = useState<ColorEntry[]>([]);
  const [shapeColorIdx, setShapeColorIdx] = useState(0);
  const [beatProgress, setBeatProgress] = useState(0);
  const [lastHit, setLastHit] = useState<HitResult | null>(null);
  const [lastHitAt, setLastHitAt] = useState(0);
  const [beatsRemaining, setBeatsRemaining] = useState(BEATS_PER_ROUND);

  // Refs for values needed inside RAF / event handler closures
  const statusRef = useRef(status);
  const beatProgressRef = useRef(beatProgress);
  const shapeColorIdxRef = useRef(shapeColorIdx);
  const colorPoolRef = useRef(colorPool);
  const targetColorRef = useRef(targetColor);
  const roundRef = useRef(round);
  const upgradesRef = useRef(upgrades);

  // Sync refs after every render (useLayoutEffect fires before the next RAF)
  useLayoutEffect(() => {
    statusRef.current = status;
    beatProgressRef.current = beatProgress;
    shapeColorIdxRef.current = shapeColorIdx;
    colorPoolRef.current = colorPool;
    targetColorRef.current = targetColor;
    roundRef.current = round;
    upgradesRef.current = upgrades;
  });

  // ── Build color pool for current round ──────────────────────────────────────
  const buildPool = useCallback(
    (target: ColorEntry, currentUpgrades: UpgradeId[]) => {
      let extras = CSS_COLORS;
      if (currentUpgrades.includes("more-blues")) {
        extras = [...CSS_COLORS, ...BLUE_COLORS, ...BLUE_COLORS];
      } else if (currentUpgrades.includes("more-purples")) {
        extras = [...CSS_COLORS, ...PURPLE_COLORS, ...PURPLE_COLORS];
      }
      return buildColorPool(target, BASE_COLOR_POOL_SIZE, extras);
    },
    []
  );

  // ── Start / restart game ────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const target = randomColor(CSS_COLORS);
    const pool = buildPool(target, upgradesRef.current);
    setTargetColor(target);
    setColorPool(pool);
    setShapeColorIdx(0);
    setBeatProgress(0);
    setLastHit(null);
    setLastHitAt(0);
    setRound(1);
    setScore(0);
    setBeatsRemaining(BEATS_PER_ROUND);
    setStatus("playing");
  }, [buildPool]);

  // ── Advance to next round ────────────────────────────────────────────────────
  const nextRound = useCallback(() => {
    setRound((r) => {
      const next = r + 1;
      const target = randomColor(CSS_COLORS);
      const pool = buildPool(target, upgradesRef.current);
      setTargetColor(target);
      setColorPool(pool);
      setShapeColorIdx(0);
      setBeatProgress(0);
      setBeatsRemaining(BEATS_PER_ROUND);
      setStatus("playing");
      return next;
    });
  }, [buildPool]);

  const goToStore = useCallback(() => setStatus("store"), []);

  // ── Beat animation loop ─────────────────────────────────────────────────────
  const beatStartRef = useRef<number>(0);
  const beatCountRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "playing") {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    beatStartRef.current = performance.now();
    beatCountRef.current = 0;

    const tick = (now: number) => {
      const beatMs = getBeatMs(roundRef.current, upgradesRef.current);
      const elapsed = (now - beatStartRef.current) % beatMs;
      const progress = elapsed / beatMs; // 0–1 sawtooth

      setBeatProgress(progress);
      beatProgressRef.current = progress;

      // Advance shape color at shape cycle boundaries
      const currentBeat = Math.floor((now - beatStartRef.current) / beatMs);
      if (currentBeat > beatCountRef.current) {
        beatCountRef.current = currentBeat;

        // Decrease beats remaining
        setBeatsRemaining((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            // Round ends without user completing it – move to store/next
            setStatus("round-complete");
          }
          return next;
        });

        // Cycle shape color on each beat
        setShapeColorIdx((idx) => {
          const pool = colorPoolRef.current;
          if (!pool.length) return idx;
          return (idx + 1) % pool.length;
        });
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status]);

  // ── Handle spacebar hit ─────────────────────────────────────────────────────
  const handleHit = useCallback(() => {
    if (statusRef.current !== "playing") return;

    const pool = colorPoolRef.current;
    const idx = shapeColorIdxRef.current;
    const shapeColor = pool[idx];
    const target = targetColorRef.current;
    const colorMatch = shapeColor?.name === target?.name;
    const bp = beatProgressRef.current;
    const currentUpgrades = upgradesRef.current;

    const rating = evaluateHit(bp, colorMatch, currentUpgrades);
    const basePoints = RATING_POINTS[rating];
    const roundMult = getRoundMultiplier(roundRef.current);
    const upgradeMult = getUpgradeMultiplier(target?.name ?? "", currentUpgrades);
    const points = basePoints * roundMult * upgradeMult;
    const tokens = RATING_TOKENS[rating];

    const hit: HitResult = { rating, points, tokens, colorMatch };
    setLastHit(hit);
    setLastHitAt(Date.now());

    if (rating !== "miss") {
      setScore((s) => s + points);
      onTokensEarned(tokens);

      // Successful hit → advance to next color target
      const newTarget = randomColor(CSS_COLORS);
      const newPool = buildPool(newTarget, currentUpgrades);
      setTargetColor(newTarget);
      setColorPool(newPool);
      setShapeColorIdx(0);
      setBeatsRemaining(BEATS_PER_ROUND);

      // Increase beats consumed based on round (harder = faster round progression)
      setBeatsRemaining(Math.max(4, BEATS_PER_ROUND - Math.floor(roundRef.current / 2)));
    }
  }, [buildPool, onTokensEarned]);

  const shapeColor = colorPool[shapeColorIdx] ?? targetColor;

  const snapshot: GameSnapshot = {
    status,
    round,
    score,
    tokens: 0, // managed by usePlayerStore
    targetColor,
    shapeColor,
    beatProgress,
    lastHit,
    lastHitAt,
    beatsRemaining,
    roundMultiplier: getRoundMultiplier(round),
  };

  return {
    snapshot,
    startGame,
    nextRound,
    goToStore,
    handleHit,
  };
}
