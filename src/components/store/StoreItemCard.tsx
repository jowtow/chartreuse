"use client";

import { motion } from "framer-motion";
import { UpgradeDef } from "@/lib/store-items";
import { UpgradeId } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Expand,
  Gauge,
  Droplets,
  Grape,
  Zap,
  Heart,
  Star,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Expand,
  Gauge,
  Droplets,
  Grape,
  Zap,
  Heart,
  Star,
};

interface StoreItemProps {
  def: UpgradeDef;
  owned: number;
  tokens: number;
  onBuy: (id: UpgradeId) => void;
}

const TAG_COLORS: Record<string, string> = {
  timing: "#22d3ee",
  starter: "#86efac",
  power: "#f59e0b",
  color: "#c084fc",
  blue: "#60a5fa",
  purple: "#a78bfa",
  bonus: "#f87171",
  legend: "#7fff00",
};

export default function StoreItemCard({
  def,
  owned,
  tokens,
  onBuy,
}: StoreItemProps) {
  const Icon = ICON_MAP[def.icon] ?? Star;
  const isMaxed = owned >= def.maxOwned;
  const canAfford = tokens >= def.cost;
  const canBuy = !isMaxed && canAfford;

  return (
    <motion.div
      className="relative flex flex-col gap-3 p-5 rounded-2xl border bg-white/5 backdrop-blur-sm overflow-hidden group"
      style={{
        borderColor: isMaxed ? "#7fff0040" : "rgba(255,255,255,0.1)",
      }}
      whileHover={{ scale: 1.02, borderColor: "rgba(127,255,0,0.3)" }}
      transition={{ duration: 0.15 }}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7fff0008] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Icon + name */}
      <div className="flex items-start gap-3">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: "rgba(127,255,0,0.12)" }}
        >
          <Icon className="w-5 h-5" style={{ color: "#7fff00" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-white text-base leading-tight">
            {def.name}
          </div>
          {def.maxOwned > 1 && (
            <div className="text-xs text-white/40 mt-0.5">
              {owned}/{def.maxOwned} owned
            </div>
          )}
        </div>
        {isMaxed && (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#7fff00" }} />
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 leading-snug">{def.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {def.tags.map((tag) => (
          <Badge
            key={tag}
            className="text-xs font-bold px-2 py-0.5 rounded-full border-0"
            style={{
              background: `${TAG_COLORS[tag] ?? "#ffffff"}22`,
              color: TAG_COLORS[tag] ?? "#ffffff",
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Buy button */}
      <Button
        size="sm"
        disabled={!canBuy}
        onClick={() => onBuy(def.id as UpgradeId)}
        className="w-full font-black gap-2 mt-1"
        style={
          canBuy
            ? { background: "#7fff00", color: "#000" }
            : isMaxed
            ? { background: "#7fff0020", color: "#7fff0080", cursor: "default" }
            : { background: "#ffffff10", color: "#ffffff40", cursor: "not-allowed" }
        }
      >
        {isMaxed ? (
          "MAXED OUT"
        ) : (
          <>
            <Star className="w-3.5 h-3.5" />
            {def.cost} tokens
            {!canAfford && " (need more)"}
          </>
        )}
      </Button>
    </motion.div>
  );
}
