"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GameSnapshot } from "@/hooks/useGame";
import { UpgradeId } from "@/types/game";
import ColorShape from "./ColorShape";
import RhythmRing from "./RhythmRing";
import SplashMessage from "./SplashMessage";
import ColorNameDisplay from "./ColorNameDisplay";
import ScoreHUD from "./ScoreHUD";
import { useSpacebar } from "@/hooks/useKeyPress";
import { Button } from "@/components/ui/button";
import { Play, ShoppingBag } from "lucide-react";
import Link from "next/link";

const SHAPE_SIZE = 180;

interface GameCanvasProps {
  snapshot: GameSnapshot;
  tokens: number;
  upgrades: UpgradeId[];
  onHit: () => void;
  onStart: () => void;
  onNextRound: () => void;
  onGoToStore: () => void;
}

export default function GameCanvas({
  snapshot,
  tokens,
  upgrades,
  onHit,
  onStart,
  onNextRound,
  onGoToStore,
}: GameCanvasProps) {
  const isPlaying = snapshot.status === "playing";

  useSpacebar(onHit, isPlaying);

  // Touch / click support for mobile
  const handleScreenTap = () => {
    if (isPlaying) onHit();
  };

  // Background particle field (CSS only, performant)
  return (
    <div
      className="relative flex flex-col items-center justify-between w-full min-h-screen overflow-hidden bg-[#050505] select-none"
      onClick={handleScreenTap}
    >
      {/* Ambient background glow tied to shape color */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${snapshot.shapeColor.hex}22 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Starfield grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header HUD */}
      <div className="relative z-10 w-full flex flex-col items-center gap-4 pt-6 px-4">
        {/* Logo */}
        <motion.h1
          className="text-sm font-black tracking-[0.3em] uppercase"
          style={{ color: "#7fff00", textShadow: "0 0 20px #7fff0088" }}
        >
          chartreuse
        </motion.h1>

        {(isPlaying || snapshot.status === "round-complete") && (
          <ScoreHUD
            score={snapshot.score}
            tokens={tokens}
            round={snapshot.round}
            multiplier={snapshot.roundMultiplier}
            beatsRemaining={snapshot.beatsRemaining}
          />
        )}
      </div>

      {/* Main game area */}
      <div className="relative z-10 flex flex-col items-center gap-8 flex-1 justify-center py-8">
        <AnimatePresence mode="wait">
          {snapshot.status === "idle" && (
            <motion.div
              key="idle"
              className="flex flex-col items-center gap-6 text-center px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2
                className="text-6xl font-black uppercase tracking-wider"
                style={{
                  color: "#7fff00",
                  textShadow: "0 0 40px #7fff0088, 0 0 80px #7fff0044",
                  fontFamily: "'Arial Black', sans-serif",
                }}
              >
                chartreuse
              </h2>
              <p className="text-white/60 text-lg max-w-sm">
                A color-rhythm game. Match the color name with the shape,
                then hit{" "}
                <kbd className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white text-sm">
                  SPACE
                </kbd>{" "}
                at the perfect beat.
              </p>

              <div className="grid grid-cols-3 gap-3 text-center text-sm my-2">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div style={{ color: "#a3e635" }} className="font-black text-lg">GOOD</div>
                  <div className="text-white/40 text-xs">×1 tokens</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div style={{ color: "#22d3ee" }} className="font-black text-lg">GREAT</div>
                  <div className="text-white/40 text-xs">×3 tokens</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div style={{ color: "#7fff00" }} className="font-black text-lg">STELLAR</div>
                  <div className="text-white/40 text-xs">×5 tokens</div>
                </div>
              </div>

              <Button
                size="lg"
                className="gap-2 font-black text-lg px-10 py-6"
                style={{ background: "#7fff00", color: "#000" }}
                onClick={(e) => { e.stopPropagation(); onStart(); }}
              >
                <Play className="w-5 h-5 fill-current" />
                PLAY
              </Button>

              <Link href="/leaderboard" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                View Leaderboard
              </Link>
            </motion.div>
          )}

          {snapshot.status === "playing" && (
            <motion.div
              key="playing"
              className="flex flex-col items-center gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ColorNameDisplay color={snapshot.targetColor} />

              {/* Shape + Ring arena */}
              <div
                className="relative flex items-center justify-center"
                style={{ width: SHAPE_SIZE * 3.5, height: SHAPE_SIZE * 3.5 }}
              >
                {/* Rhythm ring behind shape */}
                <RhythmRing
                  beatProgress={snapshot.beatProgress}
                  shapeSize={SHAPE_SIZE}
                  upgrades={upgrades}
                />

                {/* Colored shape */}
                <ColorShape
                  color={snapshot.shapeColor}
                  beatProgress={snapshot.beatProgress}
                  size={SHAPE_SIZE}
                />

                {/* Splash rating message */}
                <SplashMessage
                  rating={snapshot.lastHit?.rating ?? null}
                  points={snapshot.lastHit?.points ?? 0}
                  triggeredAt={snapshot.lastHitAt}
                />
              </div>

              <p className="text-white/30 text-sm tracking-widest">
                PRESS <span className="text-white/60 font-bold">SPACE</span> OR TAP TO HIT
              </p>
            </motion.div>
          )}

          {snapshot.status === "round-complete" && (
            <motion.div
              key="round-complete"
              className="flex flex-col items-center gap-6 text-center px-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <div
                className="text-4xl font-black uppercase"
                style={{ color: "#7fff00", textShadow: "0 0 30px #7fff00" }}
              >
                Round {snapshot.round} Complete!
              </div>
              <div className="text-white/60 text-xl">
                Score: <span className="text-white font-bold">{snapshot.score.toLocaleString()}</span>
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  onClick={(e) => { e.stopPropagation(); onNextRound(); }}
                  className="gap-2 font-bold"
                  style={{ background: "#7fff00", color: "#000" }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Next Round
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); onGoToStore(); }}
                  className="gap-2 font-bold border-purple-500 text-purple-300 hover:bg-purple-500/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Store ({tokens} tokens)
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="relative z-10 flex items-center gap-6 pb-6 text-white/30 text-xs">
        <Link href="/leaderboard" className="hover:text-white/60 transition-colors">
          Leaderboard
        </Link>
        <button
          onClick={(e) => { e.stopPropagation(); onGoToStore(); }}
          className="hover:text-white/60 transition-colors flex items-center gap-1"
        >
          <ShoppingBag className="w-3 h-3" />
          Store
        </button>
      </div>
    </div>
  );
}
