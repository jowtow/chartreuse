"use client";

import { useCallback } from "react";
import { useGame } from "@/hooks/useGame";
import { usePlayerStore } from "@/hooks/usePlayerStore";
import GameCanvas from "@/components/game/GameCanvas";
import StoreGrid from "@/components/store/StoreGrid";

export default function Home() {
  const { tokens, upgrades, owned, addTokens, buyUpgrade } = usePlayerStore();

  const handleTokensEarned = useCallback(
    (n: number) => addTokens(n),
    [addTokens]
  );

  const { snapshot, startGame, nextRound, goToStore, handleHit } = useGame(
    upgrades,
    handleTokensEarned
  );

  if (snapshot.status === "store") {
    return (
      <StoreGrid
        tokens={tokens}
        owned={owned}
        onBuy={buyUpgrade}
        onBack={nextRound}
      />
    );
  }

  return (
    <GameCanvas
      snapshot={snapshot}
      tokens={tokens}
      upgrades={upgrades}
      onHit={handleHit}
      onStart={startGame}
      onNextRound={nextRound}
      onGoToStore={goToStore}
    />
  );
}
