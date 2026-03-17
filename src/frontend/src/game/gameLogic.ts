import {
  BOARD_SIZE,
  CANDY_TYPES,
  COMBO_BLAST_SCORE,
  SCORE_PER_MATCH,
  SPECIAL_SCORE,
} from "./constants";
import type { Board, CandyType, Cell, Position, SpecialType } from "./types";

let nextId = 1;

export function createCell(type?: CandyType): Cell {
  return {
    id: nextId++,
    type: type ?? CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
    special: "none",
    isSelected: false,
    isMatched: false,
    isNew: false,
    isFalling: false,
    isEmpty: false,
  };
}

export function createBoard(): Board {
  let board: Board;
  let attempts = 0;
  do {
    board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => createCell()),
    );
    attempts++;
  } while (hasAnyMatch(board) && attempts < 100);
  return board;
}

function hasAnyMatch(board: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const type = board[r][c].type;
      if (
        c >= 2 &&
        board[r][c - 1].type === type &&
        board[r][c - 2].type === type
      )
        return true;
      if (
        r >= 2 &&
        board[r - 1][c].type === type &&
        board[r - 2][c].type === type
      )
        return true;
    }
  }
  return false;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function swapCells(board: Board, a: Position, b: Position): Board {
  const newBoard = cloneBoard(board);
  const tmp = { ...newBoard[a.row][a.col] };
  newBoard[a.row][a.col] = { ...newBoard[b.row][b.col] };
  newBoard[b.row][b.col] = tmp;
  return newBoard;
}

export function isAdjacent(a: Position, b: Position): boolean {
  return (
    (Math.abs(a.row - b.row) === 1 && a.col === b.col) ||
    (Math.abs(a.col - b.col) === 1 && a.row === b.row)
  );
}

interface MatchGroup {
  cells: Position[];
  orientation: "horizontal" | "vertical";
}

export function findMatches(board: Board): MatchGroup[] {
  const groups: MatchGroup[] = [];

  // Horizontal
  for (let r = 0; r < BOARD_SIZE; r++) {
    let c = 0;
    while (c < BOARD_SIZE) {
      let len = 1;
      while (
        c + len < BOARD_SIZE &&
        board[r][c + len].type === board[r][c].type &&
        !board[r][c].isEmpty
      ) {
        len++;
      }
      if (len >= 3) {
        groups.push({
          cells: Array.from({ length: len }, (_, i) => ({
            row: r,
            col: c + i,
          })),
          orientation: "horizontal",
        });
      }
      c += len;
    }
  }

  // Vertical
  for (let c = 0; c < BOARD_SIZE; c++) {
    let r = 0;
    while (r < BOARD_SIZE) {
      let len = 1;
      while (
        r + len < BOARD_SIZE &&
        board[r + len][c].type === board[r][c].type &&
        !board[r][c].isEmpty
      ) {
        len++;
      }
      if (len >= 3) {
        groups.push({
          cells: Array.from({ length: len }, (_, i) => ({
            row: r + i,
            col: c,
          })),
          orientation: "vertical",
        });
      }
      r += len;
    }
  }

  return groups;
}

export interface MatchResult {
  board: Board;
  score: number;
  hasMatches: boolean;
}

export function applyMatches(board: Board, combo: number): MatchResult {
  const groups = findMatches(board);
  if (groups.length === 0) return { board, score: 0, hasMatches: false };

  const newBoard = cloneBoard(board);
  let score = 0;
  const comboMultiplier = Math.min(combo, 5);

  const matchedPositions = new Set<string>();

  for (const group of groups) {
    const len = group.cells.length;
    const baseScore = SCORE_PER_MATCH[Math.min(len, 5)] ?? SCORE_PER_MATCH[5];
    score += baseScore * comboMultiplier;

    for (const pos of group.cells) {
      matchedPositions.add(`${pos.row},${pos.col}`);
    }

    // Handle specials created by matches
    if (len === 4) {
      const midPos = group.cells[Math.floor(len / 2)];
      const special: SpecialType =
        group.orientation === "horizontal" ? "striped-h" : "striped-v";
      newBoard[midPos.row][midPos.col].special = special;
      matchedPositions.delete(`${midPos.row},${midPos.col}`);
    } else if (len >= 5) {
      const midPos = group.cells[Math.floor(len / 2)];
      newBoard[midPos.row][midPos.col].special = "colorbomb";
      matchedPositions.delete(`${midPos.row},${midPos.col}`);
    }
  }

  // Trigger specials in matched positions
  const toActivate: Position[] = [];
  for (const key of matchedPositions) {
    const [r, c] = key.split(",").map(Number);
    if (newBoard[r][c].special !== "none") {
      toActivate.push({ row: r, col: c });
    }
  }

  for (const pos of toActivate) {
    const cell = newBoard[pos.row][pos.col];
    score += SPECIAL_SCORE;
    if (cell.special === "striped-h") {
      for (let c = 0; c < BOARD_SIZE; c++)
        matchedPositions.add(`${pos.row},${c}`);
    } else if (cell.special === "striped-v") {
      for (let r = 0; r < BOARD_SIZE; r++)
        matchedPositions.add(`${r},${pos.col}`);
    } else if (cell.special === "bomb") {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = pos.row + dr;
          const nc = pos.col + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
            matchedPositions.add(`${nr},${nc}`);
          }
        }
      }
    } else if (cell.special === "colorbomb") {
      const targetType = cell.type;
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (newBoard[r][c].type === targetType)
            matchedPositions.add(`${r},${c}`);
        }
      }
    }
  }

  // Mark all matched positions as matched (empty)
  for (const key of matchedPositions) {
    const [r, c] = key.split(",").map(Number);
    newBoard[r][c].isMatched = true;
    newBoard[r][c].isEmpty = true;
  }

  return { board: newBoard, score, hasMatches: true };
}

export function applyGravity(board: Board): Board {
  const newBoard = cloneBoard(board);
  for (let c = 0; c < BOARD_SIZE; c++) {
    // Collect non-empty cells from bottom to top
    const column: Cell[] = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (!newBoard[r][c].isEmpty) {
        column.push({ ...newBoard[r][c] });
      }
    }
    // Fill from bottom
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      const idx = BOARD_SIZE - 1 - r;
      if (idx < column.length) {
        newBoard[r][c] = { ...column[idx], isFalling: true };
      } else {
        // New candy from top
        newBoard[r][c] = { ...createCell(), isNew: true };
      }
    }
  }
  return newBoard;
}

export function clearFlags(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isMatched: false,
      isNew: false,
      isFalling: false,
      isSelected: false,
    })),
  );
}

export interface SpecialComboResult {
  board: Board;
  score: number;
  isSpecialCombo: boolean;
}

export function applySpecialCombo(
  board: Board,
  posA: Position,
  posB: Position,
): SpecialComboResult {
  const cellA = board[posA.row][posA.col];
  const cellB = board[posB.row][posB.col];

  const isColorBombA = cellA.special === "colorbomb";
  const isColorBombB = cellB.special === "colorbomb";

  // Color Bomb + Color Bomb => clear entire board
  if (isColorBombA && isColorBombB) {
    const newBoard = cloneBoard(board);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        newBoard[r][c].isMatched = true;
        newBoard[r][c].isEmpty = true;
      }
    }
    return { board: newBoard, score: COMBO_BLAST_SCORE, isSpecialCombo: true };
  }

  // Color Bomb + Striped
  const isStripedA =
    cellA.special === "striped-h" || cellA.special === "striped-v";
  const isStripedB =
    cellB.special === "striped-h" || cellB.special === "striped-v";

  let colorBombPos: Position | null = null;
  let stripedPos: Position | null = null;

  if (isColorBombA && isStripedB) {
    colorBombPos = posA;
    stripedPos = posB;
  } else if (isColorBombB && isStripedA) {
    colorBombPos = posB;
    stripedPos = posA;
  }

  if (colorBombPos !== null && stripedPos !== null) {
    const newBoard = cloneBoard(board);
    const stripedCell = newBoard[stripedPos.row][stripedPos.col];
    const targetColor = stripedCell.type;
    const isHorizontal = stripedCell.special === "striped-h";

    // Find all candies of that color and blast their row/column
    const toBlast = new Set<string>();

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (newBoard[r][c].type === targetColor) {
          // Mark the candy itself
          toBlast.add(`${r},${c}`);
          // Also blast its entire row or column depending on striped orientation
          if (isHorizontal) {
            for (let cc = 0; cc < BOARD_SIZE; cc++) {
              toBlast.add(`${r},${cc}`);
            }
          } else {
            for (let rr = 0; rr < BOARD_SIZE; rr++) {
              toBlast.add(`${rr},${c}`);
            }
          }
        }
      }
    }

    // Also mark the color bomb itself
    toBlast.add(`${colorBombPos.row},${colorBombPos.col}`);

    for (const key of toBlast) {
      const [r, c] = key.split(",").map(Number);
      newBoard[r][c].isMatched = true;
      newBoard[r][c].isEmpty = true;
    }

    return { board: newBoard, score: COMBO_BLAST_SCORE, isSpecialCombo: true };
  }

  return { board, score: 0, isSpecialCombo: false };
}
