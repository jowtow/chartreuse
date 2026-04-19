"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UpgradeId } from "@/types/game";
import { getStellarWindow, getGreatWindow, getGoodWindow } from "@/lib/game-logic";

interface RhythmRingProps {
  beatProgress: number; // 0–1; 0 = ring at screen edge, 1 = ring arrives at shape
  shapeSize: number;
  upgrades: UpgradeId[];
}

export default function RhythmRing({
  beatProgress,
  shapeSize,
  upgrades,
}: RhythmRingProps) {
  // Use the viewport diagonal so the ring truly starts from off-screen
  const [outerRadius, setOuterRadius] = useState(700);

  useEffect(() => {
    const update = () => {
      const r = Math.ceil(
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 2
      );
      setOuterRadius(r);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const ringThickness = 6;

  // Inner edge: ring arrives here at beatProgress = 1
  const minR = shapeSize * 0.52;
  // Outer edge: ring starts here at beatProgress = 0
  const maxR = outerRadius;
  const range = maxR - minR;

  // Ring travels INWARD: large → small
  const currentR = maxR - range * beatProgress;

  // Timing zone radii — all measured from minR outward
  // (the ring passes through these as it travels inward)
  const stellarW = getStellarWindow(upgrades);
  const greatW = getGreatWindow(upgrades);
  const goodW = getGoodWindow(upgrades);

  // Zone outer boundaries (from the shape outward)
  const stellarOuterR = minR + range * stellarW;
  const greatOuterR   = minR + range * greatW;
  const goodOuterR    = minR + range * goodW;

  // Opacity: ring brightens as it closes in on the shape
  const ringOpacity = 0.4 + beatProgress * 0.6;

  const cx = outerRadius;
  const cy = outerRadius;
  const size = outerRadius * 2;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        overflow="visible"
      >
        {/* ── Static zone bands near the inner (target) edge ── */}

        {/* Good zone band */}
        <circle
          cx={cx}
          cy={cy}
          r={(greatOuterR + goodOuterR) / 2}
          fill="none"
          stroke="rgba(250, 204, 21, 0.15)"
          strokeWidth={goodOuterR - greatOuterR}
        />
        {/* Great zone band */}
        <circle
          cx={cx}
          cy={cy}
          r={(stellarOuterR + greatOuterR) / 2}
          fill="none"
          stroke="rgba(34, 211, 238, 0.18)"
          strokeWidth={greatOuterR - stellarOuterR}
        />
        {/* Stellar zone band */}
        <circle
          cx={cx}
          cy={cy}
          r={(minR + stellarOuterR) / 2}
          fill="none"
          stroke="rgba(127, 255, 0, 0.22)"
          strokeWidth={stellarOuterR - minR}
        />

        {/* ── Target ring: dashed circle at the inner edge ── */}
        <circle
          cx={cx}
          cy={cy}
          r={minR + ringThickness / 2}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={ringThickness}
          strokeDasharray="10 7"
        />

        {/* ── Moving ring (travels inward) ── */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={currentR}
          fill="none"
          strokeWidth={ringThickness}
          style={{ stroke: `rgba(127,255,0,${ringOpacity})` }}
          animate={{ r: currentR }}
          transition={{ duration: 0.016 }}
        />
      </svg>
    </div>
  );
}
