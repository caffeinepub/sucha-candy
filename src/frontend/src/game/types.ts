export type CandyType =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple";
export type SpecialType =
  | "none"
  | "striped-h"
  | "striped-v"
  | "bomb"
  | "colorbomb";

export interface Cell {
  id: number;
  type: CandyType;
  special: SpecialType;
  isSelected: boolean;
  isMatched: boolean;
  isNew: boolean;
  isFalling: boolean;
  isEmpty: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export type Board = Cell[][];

export interface LevelConfig {
  level: number;
  targetScore: number;
  moves: number;
}

export type GamePhase =
  | "playing"
  | "animating"
  | "gameover"
  | "levelcomplete"
  | "win";

export interface GameState {
  board: Board;
  score: number;
  moves: number;
  level: number;
  combo: number;
  phase: GamePhase;
  selectedCell: Position | null;
  bonusChanceUsed: boolean;
}
