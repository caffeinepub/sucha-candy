import type React from "react";
import { LEVELS } from "../game/constants";
import type { GoalType } from "../game/types";

interface Props {
  score: number;
  moves: number;
  level: number;
  combo: number;
  goalProgress: number;
}

const GOAL_META: Record<
  GoalType,
  { icon: string; label: string; color: string }
> = {
  score: { icon: "🎯", label: "Score Goal", color: "#ffd700" },
  collect: { icon: "🍬", label: "Collect Candies", color: "#ff88cc" },
  special: { icon: "✨", label: "Make Specials", color: "#bb44ff" },
};

export const ScorePanel: React.FC<Props> = ({
  score,
  moves,
  level,
  combo,
  goalProgress,
}) => {
  const cfg = LEVELS[level];
  const goal = cfg.goal;
  const meta = GOAL_META[goal.type];
  const currentProgress = goal.type === "score" ? score : goalProgress;
  const goalPct = Math.min(100, (currentProgress / goal.target) * 100);
  const scorePct = Math.min(100, (score / cfg.targetScore) * 100);

  return (
    <div data-ocid="score.panel" className="w-full flex flex-col gap-2">
      <div className="flex gap-3 justify-between">
        <StatCard
          label="Score"
          value={score.toLocaleString()}
          color="#ffd700"
        />
        <StatCard label="Level" value={`${level + 1}`} color="#bb44ff" />
        <StatCard
          label="Moves"
          value={moves}
          color={moves <= 5 ? "#ff3366" : "#39d353"}
        />
        {combo > 1 && (
          <StatCard label="Combo" value={`x${combo}`} color="#ff8c00" pulse />
        )}
      </div>

      {/* Goal card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${meta.color}18, ${meta.color}08)`,
          border: `1px solid ${meta.color}55`,
          borderRadius: "12px",
          padding: "0.55rem 0.8rem",
        }}
      >
        <div className="flex justify-between items-center mb-1.5">
          <span
            style={{
              color: meta.color,
              fontWeight: 800,
              fontSize: "0.78rem",
              letterSpacing: "0.02em",
            }}
          >
            {meta.icon} {meta.label}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {currentProgress.toLocaleString()} / {goal.target.toLocaleString()}
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${goalPct}%`,
              background: `linear-gradient(90deg, ${meta.color}, ${meta.color}bb)`,
              boxShadow: `0 0 8px ${meta.color}88`,
            }}
          />
        </div>
      </div>

      {/* Score progress (for non-score goals) */}
      {goal.type !== "score" && (
        <div className="w-full">
          <div
            className="flex justify-between mb-0.5"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}
          >
            <span>Score</span>
            <span>
              {score.toLocaleString()} / {cfg.targetScore.toLocaleString()}
            </span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${scorePct}%`,
                background: "linear-gradient(90deg, #ffd700, #ff8c00)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  pulse?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, pulse }) => (
  <div
    className={`flex-1 rounded-xl p-2 text-center ${pulse ? "animate-pulse" : ""}`}
    style={{
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
    }}
  >
    <div className="text-xs text-white/50 uppercase tracking-wider">
      {label}
    </div>
    <div className="text-xl font-bold" style={{ color }}>
      {value}
    </div>
  </div>
);

export default ScorePanel;
