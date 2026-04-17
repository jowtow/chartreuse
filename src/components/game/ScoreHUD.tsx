"use client";

import { motion } from "framer-motion";
import { Zap, Star, Trophy } from "lucide-react";

interface ScoreHUDProps {
  score: number;
  tokens: number;
  round: number;
  multiplier: number;
  beatsRemaining: number;
}

export default function ScoreHUD({
  score,
  tokens,
  round,
  multiplier,
  beatsRemaining,
}: ScoreHUDProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 w-full max-w-2xl mx-auto">
      {/* Score */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-xs uppercase tracking-widest text-white/50">
          <Trophy className="w-3 h-3" />
          Score
        </div>
        <motion.div
          key={score}
          className="text-2xl font-black text-white"
          initial={{ scale: 1.3, color: "#7fff00" }}
          animate={{ scale: 1, color: "#ffffff" }}
          transition={{ duration: 0.3 }}
        >
          {score.toLocaleString()}
        </motion.div>
      </div>

      {/* Round */}
      <div className="flex flex-col items-center">
        <div className="text-xs uppercase tracking-widest text-white/50">Round</div>
        <div className="text-2xl font-black text-chartreuse" style={{ color: "#7fff00" }}>
          {round}
        </div>
      </div>

      {/* Multiplier */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-xs uppercase tracking-widest text-white/50">
          <Zap className="w-3 h-3" />
          Mult
        </div>
        <div className="text-2xl font-black" style={{ color: "#f59e0b" }}>
          ×{multiplier}
        </div>
      </div>

      {/* Beats remaining */}
      <div className="flex flex-col items-center">
        <div className="text-xs uppercase tracking-widest text-white/50">Beats</div>
        <div className="text-2xl font-black text-white">{beatsRemaining}</div>
      </div>

      {/* Tokens */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-xs uppercase tracking-widest text-white/50">
          <Star className="w-3 h-3" />
          Tokens
        </div>
        <motion.div
          key={tokens}
          className="text-2xl font-black"
          style={{ color: "#a78bfa" }}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {tokens}
        </motion.div>
      </div>
    </div>
  );
}
