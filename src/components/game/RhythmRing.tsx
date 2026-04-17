"use client";

import { motion } from "framer-motion";
import { UpgradeId } from "@/types/game";
import { getStellarWindow, getGreatWindow, getGoodWindow } from "@/lib/game-logic";

interface RhythmRingProps {
  beatProgress: number; // 0–1
  shapeSize: number;
  upgrades: UpgradeId[];
}

export default function RhythmRing({
  beatProgress,
  shapeSize,
  upgrades,
}: RhythmRingProps) {
  const outerRadius = shapeSize * 1.65;
  const ringThickness = 6;

  // The moving ring: starts at shapeSize/2, expands to outerRadius
  const minR = shapeSize * 0.5;
  const maxR = outerRadius;
  const currentR = minR + (maxR - minR) * beatProgress;

  // Compute zone boundaries (as ring radii)
  const stellarW = getStellarWindow(upgrades);
  const greatW = getGreatWindow(upgrades);
  const goodW = getGoodWindow(upgrades);

  // Positions in radius space
  const stellarR = minR + (maxR - minR) * (1 - stellarW);
  const greatR = minR + (maxR - minR) * (1 - greatW);
  const goodR = minR + (maxR - minR) * (1 - goodW);

  // Opacity: make the ring flash brighter near the outer edge
  const ringOpacity = 0.5 + beatProgress * 0.5;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: outerRadius * 2,
        height: outerRadius * 2,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Good zone ring */}
      <svg
        className="absolute inset-0"
        width={outerRadius * 2}
        height={outerRadius * 2}
        viewBox={`0 0 ${outerRadius * 2} ${outerRadius * 2}`}
      >
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={goodR}
          fill="none"
          stroke="rgba(250, 204, 21, 0.18)"
          strokeWidth={goodR - greatR}
        />
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={greatR}
          fill="none"
          stroke="rgba(34, 211, 238, 0.18)"
          strokeWidth={greatR - stellarR}
        />
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={stellarR}
          fill="none"
          stroke="rgba(167, 243, 208, 0.25)"
          strokeWidth={(maxR - minR) * stellarW}
        />

        {/* Outer target ring */}
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={outerRadius - ringThickness}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={ringThickness}
          strokeDasharray="12 8"
        />

        {/* Moving ring */}
        <motion.circle
          cx={outerRadius}
          cy={outerRadius}
          r={currentR}
          fill="none"
          strokeWidth={ringThickness}
          style={{
            stroke: `rgba(127,255,0,${ringOpacity})`,
          }}
          animate={{
            r: currentR,
          }}
          transition={{ duration: 0.016 }}
        />
      </svg>
    </div>
  );
}
