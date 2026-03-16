import type React from "react";
import { LEVELS } from "../game/constants";

interface Props {
  score: number;
  moves: number;
  level: number;
  combo: number;
}

export const ScorePanel: React.FC<Props> = ({ score, moves, level, combo }) => {
  const cfg = LEVELS[level];
  const progress = Math.min(100, (score / cfg.targetScore) * 100);

  return (
    <div data-ocid="score.panel" className="w-full flex flex-col gap-3">
      <div className="flex gap-3 justify-between">
        <StatCard
          label="Score"
          value={score.toLocaleString()}
          color="#ffd700"
        />
        <StatCard
          label="Level"
          value={`${level + 1}`}
          color="#bb44ff"
          data-ocid="level.panel"
        />
        <StatCard
          label="Moves"
          value={moves}
          color={moves <= 5 ? "#ff3366" : "#39d353"}
        />
        {combo > 1 && (
          <StatCard label="Combo" value={`x${combo}`} color="#ff8c00" pulse />
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Progress</span>
          <span>
            {score.toLocaleString()} / {cfg.targetScore.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ffd700, #ff8c00)",
              boxShadow: "0 0 10px rgba(255, 200, 0, 0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  pulse?: boolean;
  "data-ocid"?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color,
  pulse,
  "data-ocid": dataOcid,
}) => (
  <div
    data-ocid={dataOcid}
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
