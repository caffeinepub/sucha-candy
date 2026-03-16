import type React from "react";
import { LEVELS } from "../game/constants";

interface Props {
  score: number;
  level: number;
  bonusChanceUsed: boolean;
  onRestart: () => void;
  onBonusChance: () => void;
}

export const GameOverScreen: React.FC<Props> = ({
  score,
  level,
  bonusChanceUsed,
  onRestart,
  onBonusChance,
}) => {
  const target = LEVELS[level].targetScore;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 rounded-2xl"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="text-center px-8 py-10 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #1a0033, #330066)",
          border: "2px solid rgba(255,100,100,0.5)",
          minWidth: 280,
        }}
      >
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-4xl font-black text-red-400 mb-2">Game Over!</h2>
        <p className="text-white/60 mb-4">You ran out of moves</p>
        <p className="text-white mb-1">
          Score:{" "}
          <span className="text-yellow-400 font-bold">
            {score.toLocaleString()}
          </span>
        </p>
        <p className="text-white/60 mb-6">
          Target was: {target.toLocaleString()}
        </p>

        {!bonusChanceUsed && (
          <button
            type="button"
            data-ocid="game.bonus_chance_button"
            onClick={onBonusChance}
            className="w-full mb-3 px-8 py-3 rounded-full font-bold text-lg text-white cursor-pointer transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ff9900, #ffcc00)",
              boxShadow: "0 4px 24px rgba(255,180,0,0.45)",
            }}
          >
            ⭐ Bonus Chance! +5 Moves
          </button>
        )}

        <button
          type="button"
          data-ocid="game.primary_button"
          onClick={onRestart}
          className="w-full px-8 py-3 rounded-full font-bold text-lg text-white cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #ff3366, #ff0044)",
            boxShadow: "0 4px 20px rgba(255,50,100,0.4)",
          }}
        >
          Try Again 🔄
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
