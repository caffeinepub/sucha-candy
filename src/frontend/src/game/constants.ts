import type { CandyType, LevelConfig } from "./types";

export const BOARD_SIZE = 8;

export const CANDY_TYPES: CandyType[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
];

export const CANDY_EMOJI: Record<CandyType, string> = {
  red: "🍬",
  orange: "🍊",
  yellow: "🍋",
  green: "🍏",
  blue: "🫐",
  purple: "🍇",
};

export const CANDY_COLOR: Record<CandyType, string> = {
  red: "#ff3366",
  orange: "#ff8c00",
  yellow: "#ffd700",
  green: "#39d353",
  blue: "#4488ff",
  purple: "#bb44ff",
};

export const CANDY_BG: Record<CandyType, string> = {
  red: "bg-rose-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

export const LEVELS: LevelConfig[] = Array.from({ length: 500 }, (_, i) => ({
  level: i + 1,
  targetScore: Math.round(500 * 1.035 ** i),
  moves: Math.max(10, 20 - Math.floor(i / 25)),
}));

export const SCORE_PER_MATCH: Record<number, number> = {
  3: 60,
  4: 120,
  5: 200,
};

export const SPECIAL_SCORE = 500;
