import type React from "react";
import { LEVELS } from "../game/constants";

interface Props {
  score: number;
  level: number;
  isWin: boolean;
  onNext: () => void;
  onRestart: () => void;
}

export const LevelCompleteScreen: React.FC<Props> = ({
  score,
  level,
  isWin,
  onNext,
  onRestart,
}) => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 rounded-2xl"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="text-center px-8 py-10 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #001a33, #003366)",
          border: "2px solid rgba(100,200,255,0.4)",
        }}
      >
        <div className="text-6xl mb-4">{isWin ? "🏆" : "⭐"}</div>
        <h2
          className="text-4xl font-black mb-2"
          style={{ color: isWin ? "#ffd700" : "#39d353" }}
        >
          {isWin ? "You Win!" : "Level Complete!"}
        </h2>
        <p className="text-white/60 mb-4">
          {isWin
            ? "Congratulations, candy master!"
            : `Level ${level + 1} cleared!`}
        </p>
        <p className="text-white mb-6">
          Score:{" "}
          <span className="text-yellow-400 font-bold">
            {score.toLocaleString()}
          </span>
        </p>
        {!isWin && level < LEVELS.length - 1 && (
          <p className="text-white/60 mb-4">
            Next target:{" "}
            <span className="text-blue-300">
              {LEVELS[level + 1].targetScore.toLocaleString()}
            </span>
          </p>
        )}
        <div className="flex gap-3 justify-center">
          {!isWin && (
            <button
              type="button"
              data-ocid="game.primary_button"
              onClick={onNext}
              className="px-8 py-3 rounded-full font-bold text-lg text-white cursor-pointer transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #39d353, #00aa33)",
                boxShadow: "0 4px 20px rgba(50,220,80,0.4)",
              }}
            >
              Next Level →
            </button>
          )}
          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-3 rounded-full font-bold text-white/70 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelCompleteScreen;
