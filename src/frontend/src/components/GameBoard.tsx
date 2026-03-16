import type React from "react";
import { BOARD_SIZE } from "../game/constants";
import type { Board, Position } from "../game/types";
import { CandyCell } from "./CandyCell";

interface Props {
  board: Board;
  onCellClick: (pos: Position) => void;
}

export const GameBoard: React.FC<Props> = ({ board, onCellClick }) => {
  return (
    <div
      data-ocid="game.canvas_target"
      className="relative rounded-2xl p-2 shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(120,40,200,0.8) 0%, rgba(60,10,120,0.9) 100%)",
        border: "3px solid rgba(255,255,255,0.15)",
      }}
    >
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          width: "min(90vw, 520px)",
          height: "min(90vw, 520px)",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <CandyCell
              key={cell.id}
              cell={cell}
              row={r}
              col={c}
              onClick={() => onCellClick({ row: r, col: c })}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default GameBoard;
