"use client";

import { motion } from "framer-motion";
import { ColorEntry } from "@/types/game";

interface ColorShapeProps {
  color: ColorEntry;
  beatProgress: number; // 0–1
  size?: number;
}

// Morph between different border radii to simulate shape changing
const SHAPES = [
  "30% 70% 70% 30% / 30% 30% 70% 70%",
  "50%",
  "20% 80% 20% 80% / 80% 20% 80% 20%",
  "60% 40% 60% 40% / 40% 60% 40% 60%",
  "10% 90% 10% 90% / 90% 10% 90% 10%",
];

/** Deterministically map a color name to a shape index */
function colorToShapeIdx(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h % SHAPES.length;
}

export default function ColorShape({ color, beatProgress, size = 180 }: ColorShapeProps) {
  // Deterministic: each color name maps to a stable shape
  const currentShape = SHAPES[colorToShapeIdx(color.name)];

  // Pulse scale with beat
  const scale = 0.92 + beatProgress * 0.16;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        animate={{ backgroundColor: color.hex }}
        transition={{ duration: 0.3 }}
        style={{ borderRadius: currentShape }}
      />

      {/* Main shape */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: color.hex,
          borderRadius: currentShape,
          scale,
          boxShadow: `0 0 ${30 + beatProgress * 40}px ${color.hex}`,
        }}
        transition={{
          backgroundColor: { duration: 0.25 },
          borderRadius: { duration: 0.6, ease: "easeInOut" },
          scale: { duration: 0.05 },
          boxShadow: { duration: 0.05 },
        }}
      />

      {/* Inner shimmer */}
      <motion.div
        className="absolute"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          top: size * 0.12,
          left: size * 0.18,
        }}
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
