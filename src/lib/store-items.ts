import { UpgradeId } from "@/types/game";

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  icon: string; // lucide icon name
  maxOwned: number; // how many times you can buy it
  /** tags help filter/categorise in the store */
  tags: string[];
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: "wider-zone",
    name: "Wider Landing Zone",
    description:
      "Expands the DDR timing ring hit window, making it easier to land Stellar and Great hits.",
    cost: 8,
    icon: "Expand",
    maxOwned: 3,
    tags: ["timing", "starter"],
  },
  {
    id: "slowdown",
    name: "Slow Motion",
    description:
      "Reduces the game speed by 40%, giving you more time to react each round.",
    cost: 15,
    icon: "Gauge",
    maxOwned: 1,
    tags: ["timing", "power"],
  },
  {
    id: "more-blues",
    name: "Blue Surge",
    description:
      "Replaces random colors in the pool with blue variants, increasing blue concentration.",
    cost: 10,
    icon: "Droplets",
    maxOwned: 2,
    tags: ["color", "blue"],
  },
  {
    id: "more-purples",
    name: "Purple Haze",
    description:
      "Replaces random colors in the pool with purple variants, increasing purple concentration.",
    cost: 10,
    icon: "Grape",
    maxOwned: 2,
    tags: ["color", "purple"],
  },
  {
    id: "chartreuse-bonus",
    name: "Chartreuse Frenzy",
    description:
      "Earn 10× points whenever you nail the Chartreuse color. The game's namesake pays big!",
    cost: 25,
    icon: "Zap",
    maxOwned: 1,
    tags: ["bonus", "legend"],
  },
  {
    id: "fuchsia-bonus",
    name: "Fuchsia Power",
    description: "Earn 5× points whenever you hit the Fuchsia color.",
    cost: 18,
    icon: "Heart",
    maxOwned: 1,
    tags: ["bonus"],
  },
  {
    id: "goldenrod-bonus",
    name: "Goldenrod Glory",
    description: "Earn 3× points whenever you hit the Goldenrod color.",
    cost: 12,
    icon: "Star",
    maxOwned: 1,
    tags: ["bonus"],
  },
];

export function getUpgradeDef(id: UpgradeId): UpgradeDef | undefined {
  return UPGRADES.find((u) => u.id === id);
}
