"use client";

import { motion } from "framer-motion";
import { ColorEntry } from "@/types/game";

interface ColorNameDisplayProps {
  color: ColorEntry;
}

export default function ColorNameDisplay({ color }: ColorNameDisplayProps) {
  return (
    <motion.div
      key={color.name}
      className="text-center select-none"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "backOut" }}
    >
      <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
        Find this color
      </p>
      <h2
        className="text-4xl md:text-5xl font-black uppercase tracking-wider"
        style={{
          color: color.hex,
          textShadow: `0 0 20px ${color.hex}88, 0 0 60px ${color.hex}44`,
          fontFamily: "'Arial Black', Arial, sans-serif",
        }}
      >
        {color.name}
      </h2>
    </motion.div>
  );
}
