"use client";

import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Placeholder leaderboard data (will be replaced with real API data when backend is connected)
const MOCK_ENTRIES = [
  { rank: 1, name: "chartreuse_king", score: 124_500, round: 18 },
  { rank: 2, name: "neon_gamer", score: 98_200, round: 15 },
  { rank: 3, name: "colorblind_pro", score: 87_750, round: 13 },
  { rank: 4, name: "beatmaster", score: 72_100, round: 11 },
  { rank: 5, name: "pixel_wizard", score: 65_300, round: 10 },
  { rank: 6, name: "teal_queen", score: 58_000, round: 9 },
  { rank: 7, name: "vibecheck99", score: 45_500, round: 8 },
  { rank: 8, name: "hue_know_it", score: 38_800, round: 7 },
  { rank: 9, name: "saturation_max", score: 29_600, round: 6 },
  { rank: 10, name: "pastel_punk", score: 21_000, round: 5 },
];

const RANK_COLORS = ["#ffd700", "#c0c0c0", "#cd7f32"];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, #7fff0012 0%, transparent 70%)",
        }}
      />

      {/* Starfield */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <motion.h1
            className="text-sm font-black tracking-[0.3em] uppercase"
            style={{ color: "#7fff00", textShadow: "0 0 20px #7fff0088" }}
          >
            chartreuse
          </motion.h1>
          <div className="w-20" />
        </div>

        {/* Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-6 h-6" style={{ color: "#ffd700" }} />
            <h2 className="text-3xl font-black uppercase tracking-wider text-white">
              Leaderboard
            </h2>
          </div>
          <p className="text-white/40 text-sm">
            Top scores from around the world
          </p>
          <p className="text-white/25 text-xs mt-1">
            Google login coming soon — sign in to save your score!
          </p>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-3">
          {MOCK_ENTRIES.map((entry, i) => {
            const rankColor = RANK_COLORS[i] ?? "rgba(255,255,255,0.5)";
            const isTop3 = i < 3;

            return (
              <motion.div
                key={entry.rank}
                className="flex items-center gap-4 p-4 rounded-2xl border bg-white/5 backdrop-blur-sm"
                style={{
                  borderColor: isTop3
                    ? `${rankColor}40`
                    : "rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Rank */}
                <div
                  className="text-2xl font-black w-10 text-center flex-shrink-0"
                  style={{ color: rankColor }}
                >
                  {isTop3 ? ["🥇", "🥈", "🥉"][i] : entry.rank}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate">
                    {entry.name}
                  </div>
                  <div className="text-xs text-white/40">
                    Round {entry.round}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div
                    className="font-black text-lg"
                    style={{ color: isTop3 ? rankColor : "white" }}
                  >
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/30">pts</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/">
            <Button
              className="font-black gap-2 px-8"
              style={{ background: "#7fff00", color: "#000" }}
            >
              <Star className="w-4 h-4" />
              Play & Claim Your Spot
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
