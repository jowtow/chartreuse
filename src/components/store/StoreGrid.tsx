"use client";

import { motion } from "framer-motion";
import { UPGRADES } from "@/lib/store-items";
import { UpgradeId } from "@/types/game";
import StoreItemCard from "./StoreItemCard";
import { ShoppingBag, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreGridProps {
  tokens: number;
  owned: Partial<Record<UpgradeId, number>>;
  onBuy: (id: UpgradeId) => { success: boolean; message: string };
  onBack: () => void;
}

export default function StoreGrid({
  tokens,
  owned,
  onBuy,
  onBack,
}: StoreGridProps) {
  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 50% 0%, #7fff0015 0%, transparent 70%)"
        }}
      />

      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Game
          </Button>

          <motion.h1
            className="text-sm font-black tracking-[0.3em] uppercase"
            style={{ color: "#7fff00", textShadow: "0 0 20px #7fff0088" }}
          >
            chartreuse
          </motion.h1>

          <div className="flex items-center gap-2 text-sm font-bold">
            <Star className="w-4 h-4" style={{ color: "#a78bfa" }} />
            <span style={{ color: "#a78bfa" }}>{tokens} tokens</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingBag className="w-6 h-6" style={{ color: "#7fff00" }} />
            <h2 className="text-3xl font-black uppercase tracking-wider text-white">
              The Shop
            </h2>
          </div>
          <p className="text-white/40 text-sm">
            Spend your tokens to unlock power-ups and bonuses
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UPGRADES.map((def, i) => (
            <motion.div
              key={def.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <StoreItemCard
                def={def}
                owned={owned[def.id as UpgradeId] ?? 0}
                tokens={tokens}
                onBuy={onBuy}
              />
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs">
          More upgrades coming soon!
        </p>
      </div>
    </div>
  );
}
