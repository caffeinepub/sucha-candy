import type React from "react";
import { CANDY_COLOR, CANDY_EMOJI } from "../game/constants";
import type { Cell } from "../game/types";

interface Props {
  cell: Cell;
  onClick: () => void;
  row: number;
  col: number;
}

const SPECIAL_OVERLAY: Record<string, string> = {
  "striped-h": "≡",
  "striped-v": "|||",
  bomb: "💥",
  colorbomb: "🌈",
};

export const CandyCell: React.FC<Props> = ({ cell, onClick }) => {
  const baseColor = CANDY_COLOR[cell.type];

  const innerClasses = [
    "relative w-full h-full rounded-xl flex items-center justify-center select-none",
    "transition-all duration-200 pointer-events-none",
    cell.isMatched ? "scale-0 opacity-0" : "scale-100 opacity-100",
    cell.isSelected ? "ring-4 ring-white ring-offset-2 scale-110 z-10" : "",
    cell.isNew ? "animate-fall-in" : "",
    cell.isFalling ? "animate-fall" : "",
  ].join(" ");

  return (
    <button
      type="button"
      className="p-0.5 w-full h-full cursor-pointer bg-transparent border-0 outline-none"
      onClick={onClick}
    >
      <div
        className={innerClasses}
        style={{
          background: `radial-gradient(circle at 35% 35%, ${lighten(baseColor)}, ${baseColor})`,
          boxShadow: cell.isSelected
            ? `0 0 20px ${baseColor}, 0 4px 8px rgba(0,0,0,0.4)`
            : "0 4px 8px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
        }}
      >
        <span className="text-2xl drop-shadow-sm">
          {cell.isEmpty ? "" : CANDY_EMOJI[cell.type]}
        </span>
        {cell.special !== "none" && !cell.isEmpty && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white opacity-80">
            {SPECIAL_OVERLAY[cell.special]}
          </span>
        )}
      </div>
    </button>
  );
};

function lighten(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)})`;
}

export default CandyCell;
