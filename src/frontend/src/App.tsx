import React, { useEffect, useState } from "react";
import { GameBoard } from "./components/GameBoard";
import { GameOverScreen } from "./components/GameOverScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LevelCompleteScreen } from "./components/LevelCompleteScreen";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { ScorePanel } from "./components/ScorePanel";
import { LEVELS } from "./game/constants";
import { useGameState } from "./game/useGameState";

type Screen = "home" | "levelselect" | "playing";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [unlockedUpTo, setUnlockedUpTo] = useState(0);
  const {
    state,
    selectCell,
    nextLevel,
    restart,
    checkGameOver,
    useBonusChance,
  } = useGameState();

  useEffect(() => {
    if (screen === "playing") {
      checkGameOver();
    }
  }, [checkGameOver, screen]);

  // Track unlocked levels
  useEffect(() => {
    if (state.phase === "levelcomplete" || state.phase === "win") {
      setUnlockedUpTo((prev) => Math.max(prev, state.level + 1));
    }
  }, [state.phase, state.level]);

  const handleGoHome = () => {
    restart();
    setScreen("home");
  };

  if (screen === "home") {
    return <HomeScreen onStart={() => setScreen("levelselect")} />;
  }

  if (screen === "levelselect") {
    return (
      <LevelSelectScreen
        totalLevels={LEVELS.length}
        unlockedUpTo={unlockedUpTo}
        onSelectLevel={(_levelIdx) => {
          restart();
          setScreen("playing");
        }}
        onBack={() => setScreen("home")}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-6 px-4"
      style={{
        background:
          "linear-gradient(160deg, #0d001a 0%, #1a0033 50%, #0d001a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="w-full flex items-center justify-between mb-4"
        style={{ maxWidth: "min(90vw, 520px)" }}
      >
        <button
          type="button"
          data-ocid="game.back_button"
          onClick={() => setScreen("levelselect")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "100px",
            padding: "0.4rem 1rem",
            color: "rgba(255,220,255,0.8)",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.14)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
        >
          ◀ Levels
        </button>

        <h1
          className="text-2xl font-black tracking-tight"
          style={{
            background: "linear-gradient(135deg, #ff88cc, #ffd700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 10px rgba(255,150,200,0.4))",
          }}
        >
          🍬 Sucha Candy
        </h1>

        <button
          type="button"
          data-ocid="game.exit_button"
          onClick={handleGoHome}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(255,50,50,0.1)",
            border: "1px solid rgba(255,80,80,0.2)",
            borderRadius: "100px",
            padding: "0.4rem 1rem",
            color: "rgba(255,150,150,0.8)",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,50,50,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,50,50,0.1)";
          }}
        >
          Exit ✕
        </button>
      </div>

      <div className="w-full mb-4" style={{ maxWidth: "min(90vw, 520px)" }}>
        <ScorePanel
          score={state.score}
          moves={state.moves}
          level={state.level}
          combo={state.combo}
        />
      </div>

      <div className="relative">
        <GameBoard board={state.board} onCellClick={selectCell} />

        {state.phase === "gameover" && (
          <GameOverScreen
            score={state.score}
            level={state.level}
            bonusChanceUsed={state.bonusChanceUsed}
            onRestart={restart}
            onBonusChance={useBonusChance}
          />
        )}

        {(state.phase === "levelcomplete" || state.phase === "win") && (
          <LevelCompleteScreen
            score={state.score}
            level={state.level}
            isWin={state.phase === "win"}
            onNext={nextLevel}
            onRestart={restart}
          />
        )}
      </div>

      <div className="mt-6 text-center text-white/30 text-xs">
        <p>Click a candy, then click adjacent candy to swap</p>
        <p className="mt-1">Match 4+ for special candies ✨</p>
      </div>
    </div>
  );
}
