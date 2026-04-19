"use client";

import { useState, useCallback } from "react";
import { UpgradeId } from "@/types/game";
import { getUpgradeDef } from "@/lib/store-items";

interface StoreState {
  tokens: number;
  owned: Partial<Record<UpgradeId, number>>; // id → count owned
  upgrades: UpgradeId[]; // flat list (repeats if owned > 1)
}

const STORE_KEY = "chartreuse_store";

function loadStore(): StoreState {
  if (typeof window === "undefined") return { tokens: 0, owned: {}, upgrades: [] };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as StoreState;
  } catch {
    // ignore
  }
  return { tokens: 0, owned: {}, upgrades: [] };
}

function saveStore(s: StoreState) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function usePlayerStore() {
  const [store, setStore] = useState<StoreState>(loadStore);

  const addTokens = useCallback((amount: number) => {
    setStore((prev) => {
      const next = { ...prev, tokens: prev.tokens + amount };
      saveStore(next);
      return next;
    });
  }, []);

  const buyUpgrade = useCallback(
    (id: UpgradeId): { success: boolean; message: string } => {
      const def = getUpgradeDef(id);
      if (!def) return { success: false, message: "Unknown upgrade" };

      let result: { success: boolean; message: string } = {
        success: false,
        message: "",
      };

      setStore((prev) => {
        const currentOwned = prev.owned[id] ?? 0;
        if (currentOwned >= def.maxOwned) {
          result = { success: false, message: "Already maxed out!" };
          return prev;
        }
        if (prev.tokens < def.cost) {
          result = { success: false, message: "Not enough tokens!" };
          return prev;
        }
        const newOwned = { ...prev.owned, [id]: currentOwned + 1 };
        const newUpgrades = [...prev.upgrades, id];
        const next = {
          tokens: prev.tokens - def.cost,
          owned: newOwned,
          upgrades: newUpgrades,
        };
        saveStore(next);
        result = { success: true, message: `Purchased ${def.name}!` };
        return next;
      });

      return result;
    },
    []
  );

  const canAfford = useCallback(
    (id: UpgradeId) => {
      const def = getUpgradeDef(id);
      if (!def) return false;
      const owned = store.owned[id] ?? 0;
      return owned < def.maxOwned && store.tokens >= def.cost;
    },
    [store]
  );

  const getOwnedCount = useCallback(
    (id: UpgradeId) => store.owned[id] ?? 0,
    [store]
  );

  return {
    tokens: store.tokens,
    upgrades: store.upgrades,
    owned: store.owned,
    addTokens,
    buyUpgrade,
    canAfford,
    getOwnedCount,
  };
}
