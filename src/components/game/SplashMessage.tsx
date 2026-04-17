"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HitRating } from "@/types/game";

interface SplashMessageProps {
  rating: HitRating | null;
  points: number;
  triggeredAt: number;
}

const CONFIG: Record<
  HitRating,
  { text: string; color: string; emoji: string }
> = {
  stellar: { text: "STELLAR!", color: "#7fff00", emoji: "⭐" },
  great: { text: "GREAT!", color: "#22d3ee", emoji: "🔥" },
  good: { text: "GOOD", color: "#fbbf24", emoji: "👍" },
  miss: { text: "MISS", color: "#ef4444", emoji: "💨" },
};

export default function SplashMessage({
  rating,
  points,
  triggeredAt,
}: SplashMessageProps) {
  if (!rating) return null;
  const cfg = CONFIG[rating];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={triggeredAt}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-30"
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.5, y: -60 }}
        transition={{ duration: 0.25 }}
      >
        <span
          className="text-5xl font-black tracking-widest uppercase drop-shadow-2xl"
          style={{
            color: cfg.color,
            textShadow: `0 0 30px ${cfg.color}, 0 0 60px ${cfg.color}88`,
            fontFamily: "'Arial Black', sans-serif",
          }}
        >
          {cfg.emoji} {cfg.text}
        </span>
        {points > 0 && (
          <motion.span
            className="text-2xl font-bold mt-1"
            style={{ color: cfg.color, opacity: 0.85 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            +{points.toLocaleString()} pts
          </motion.span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
