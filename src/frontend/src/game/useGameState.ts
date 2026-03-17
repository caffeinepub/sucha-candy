import { useCallback, useReducer } from "react";
import { LEVELS } from "./constants";
import {
  applyGravity,
  applyMatches,
  applySpecialCombo,
  clearFlags,
  cloneBoard,
  createBoard,
  isAdjacent,
  swapCells,
} from "./gameLogic";
import type { Board, GamePhase, GameState, Position } from "./types";

const BONUS_MOVES = 5;

type Action =
  | { type: "SELECT_CELL"; pos: Position }
  | { type: "SET_BOARD"; board: Board }
  | { type: "ADD_SCORE"; score: number }
  | { type: "DECREMENT_MOVES" }
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "NEXT_LEVEL" }
  | { type: "RESTART" }
  | { type: "SET_COMBO"; combo: number }
  | { type: "USE_BONUS_CHANCE" };

function initState(level = 0): GameState {
  return {
    board: createBoard(),
    score: 0,
    moves: LEVELS[level].moves,
    level,
    combo: 1,
    phase: "playing",
    selectedCell: null,
    bonusChanceUsed: false,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SELECT_CELL": {
      const { pos } = action;
      if (!state.selectedCell) {
        const board = cloneBoard(state.board);
        board[pos.row][pos.col].isSelected = true;
        return { ...state, selectedCell: pos, board };
      }
      if (
        state.selectedCell.row === pos.row &&
        state.selectedCell.col === pos.col
      ) {
        const board = cloneBoard(state.board);
        board[pos.row][pos.col].isSelected = false;
        return { ...state, selectedCell: null, board };
      }
      const board = cloneBoard(state.board);
      board[state.selectedCell.row][state.selectedCell.col].isSelected = false;
      board[pos.row][pos.col].isSelected = true;
      return { ...state, selectedCell: pos, board };
    }
    case "SET_BOARD":
      return { ...state, board: action.board };
    case "ADD_SCORE": {
      const newScore = state.score + action.score;
      const levelCfg = LEVELS[state.level];
      if (newScore >= levelCfg.targetScore) {
        if (state.level >= LEVELS.length - 1)
          return { ...state, score: newScore, phase: "win" };
        return { ...state, score: newScore, phase: "levelcomplete" };
      }
      return { ...state, score: newScore };
    }
    case "DECREMENT_MOVES": {
      const newMoves = state.moves - 1;
      if (
        newMoves <= 0 &&
        state.phase !== "levelcomplete" &&
        state.phase !== "win"
      ) {
        return { ...state, moves: 0 };
      }
      return { ...state, moves: newMoves };
    }
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "SET_COMBO":
      return { ...state, combo: action.combo };
    case "USE_BONUS_CHANCE":
      if (state.bonusChanceUsed || state.phase !== "gameover") return state;
      return {
        ...state,
        moves: BONUS_MOVES,
        phase: "playing",
        bonusChanceUsed: true,
      };
    case "NEXT_LEVEL": {
      const nextLevel = state.level + 1;
      const next = initState(nextLevel);
      return { ...next, score: state.score };
    }
    case "RESTART":
      return initState(0);
    default:
      return state;
  }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initState(0));

  const processCascade = useCallback(
    async (initialBoard: Board, currentLevel: number) => {
      let board = initialBoard;
      let combo = 1;
      let totalScore = 0;

      for (let i = 0; i < 10; i++) {
        const result = applyMatches(board, combo);
        if (!result.hasMatches) break;

        dispatch({ type: "SET_BOARD", board: result.board });
        await delay(350);

        totalScore += result.score;
        combo++;

        board = applyGravity(result.board);
        dispatch({ type: "SET_BOARD", board });
        await delay(400);

        board = clearFlags(board);
        dispatch({ type: "SET_BOARD", board });
        await delay(100);
      }

      dispatch({ type: "ADD_SCORE", score: totalScore });
      dispatch({ type: "DECREMENT_MOVES" });

      setTimeout(() => {
        dispatch({ type: "SET_PHASE", phase: "playing" });
      }, 0);

      void currentLevel;
    },
    [],
  );

  const selectCell = useCallback(
    async (pos: Position) => {
      if (state.phase !== "playing") return;

      if (!state.selectedCell) {
        dispatch({ type: "SELECT_CELL", pos });
        return;
      }

      const prev = state.selectedCell;

      if (prev.row === pos.row && prev.col === pos.col) {
        dispatch({ type: "SELECT_CELL", pos });
        return;
      }

      if (!isAdjacent(prev, pos)) {
        dispatch({ type: "SELECT_CELL", pos });
        return;
      }

      dispatch({ type: "SET_PHASE", phase: "animating" });

      const clearedBoard = cloneBoard(state.board);
      clearedBoard[prev.row][prev.col].isSelected = false;
      dispatch({ type: "SET_BOARD", board: clearedBoard });
      await delay(50);

      const swapped = swapCells(clearedBoard, prev, pos);
      dispatch({ type: "SET_BOARD", board: swapped });
      await delay(300);

      // Check for special combo (Color Bomb + Striped, or Color Bomb + Color Bomb)
      const comboResult = applySpecialCombo(swapped, prev, pos);
      if (comboResult.isSpecialCombo) {
        dispatch({ type: "SET_BOARD", board: comboResult.board });
        await delay(400);

        const afterGravity = applyGravity(comboResult.board);
        dispatch({ type: "SET_BOARD", board: afterGravity });
        await delay(400);

        const cleaned = clearFlags(afterGravity);
        dispatch({ type: "SET_BOARD", board: cleaned });
        dispatch({ type: "ADD_SCORE", score: comboResult.score }); // +100 combo bonus
        await delay(100);

        // Then cascade for any new matches
        await processCascade(cleaned, state.level);
        return;
      }

      const testResult = applyMatches(swapped, 1);
      if (!testResult.hasMatches) {
        const reverted = swapCells(swapped, prev, pos);
        dispatch({ type: "SET_BOARD", board: reverted });
        await delay(300);
        dispatch({ type: "SET_PHASE", phase: "playing" });
        return;
      }

      await processCascade(swapped, state.level);
    },
    [state, processCascade],
  );

  const checkGameOver = useCallback(() => {
    if (state.phase === "playing" && state.moves <= 0) {
      dispatch({ type: "SET_PHASE", phase: "gameover" });
    }
  }, [state.phase, state.moves]);

  const nextLevel = useCallback(() => dispatch({ type: "NEXT_LEVEL" }), []);
  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);
  const useBonusChance = useCallback(
    () => dispatch({ type: "USE_BONUS_CHANCE" }),
    [],
  );

  return {
    state,
    selectCell,
    nextLevel,
    restart,
    checkGameOver,
    useBonusChance,
  };
}
