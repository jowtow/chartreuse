"use client";

import { usePlayerStore } from "@/hooks/usePlayerStore";
import StoreGrid from "@/components/store/StoreGrid";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const { tokens, owned, buyUpgrade } = usePlayerStore();
  const router = useRouter();

  return (
    <StoreGrid
      tokens={tokens}
      owned={owned}
      onBuy={buyUpgrade}
      onBack={() => router.push("/")}
    />
  );
}
