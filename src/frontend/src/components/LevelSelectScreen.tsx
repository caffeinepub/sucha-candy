import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  totalLevels: number;
  unlockedUpTo: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const CANDY_EMOJIS = ["🍒", "🍇", "🍓", "🍎", "🥭", "🍑"];
const LEVELS_PER_PAGE = 30;

export const LevelSelectScreen: React.FC<Props> = ({
  totalLevels,
  unlockedUpTo,
  onSelectLevel,
  onBack,
}) => {
  const [activePage, setActivePage] = useState(0);
  const totalPages = Math.ceil(totalLevels / LEVELS_PER_PAGE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const page = Math.floor(unlockedUpTo / LEVELS_PER_PAGE);
    setActivePage(Math.min(page, totalPages - 1));
    setTimeout(() => setVisible(true), 50);
  }, [unlockedUpTo, totalPages]);

  const startIdx = activePage * LEVELS_PER_PAGE;
  const endIdx = Math.min(startIdx + LEVELS_PER_PAGE, totalLevels);
  const levelsOnPage = Array.from(
    { length: endIdx - startIdx },
    (_, i) => startIdx + i,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, #3d0066 0%, #1a0033 40%, #0d001a 100%)",
        padding: "1.5rem 1rem",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <button
          type="button"
          data-ocid="levelselect.back_button"
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "100px",
            padding: "0.5rem 1.2rem",
            color: "rgba(255,220,255,0.8)",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ◀ Back
        </button>

        <h2
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: "1.6rem",
            background: "linear-gradient(135deg, #ff88cc, #ffd700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 10px rgba(255,150,200,0.4))",
          }}
        >
          🍒 Choose Level
        </h2>

        <div style={{ width: "80px" }} />
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "1.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(255,200,255,0.5)",
            fontSize: "0.75rem",
            marginBottom: "0.4rem",
          }}
        >
          <span>
            {unlockedUpTo + 1} / {totalLevels} levels unlocked
          </span>
          <span>{Math.round(((unlockedUpTo + 1) / totalLevels) * 100)}%</span>
        </div>
        <div
          style={{
            height: "6px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "100px",
              background: "linear-gradient(90deg, #ff4499, #ffd700)",
              width: `${((unlockedUpTo + 1) / totalLevels) * 100}%`,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* Level grid */}
      <div
        ref={scrollRef}
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "0.6rem",
          marginBottom: "1.5rem",
        }}
      >
        {levelsOnPage.map((levelIdx) => {
          const levelNum = levelIdx + 1;
          const isUnlocked = levelIdx <= unlockedUpTo;
          const isCurrent = levelIdx === unlockedUpTo;
          const candy = CANDY_EMOJIS[levelIdx % CANDY_EMOJIS.length];

          return (
            <button
              key={levelIdx}
              type="button"
              data-ocid={`levelselect.item.${levelNum}`}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelectLevel(levelIdx)}
              style={{
                position: "relative",
                aspectRatio: "1",
                border: isCurrent
                  ? "2px solid #ffd700"
                  : isUnlocked
                    ? "1px solid rgba(255,150,200,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                background: isCurrent
                  ? "linear-gradient(135deg, rgba(255,180,0,0.3), rgba(255,80,150,0.3))"
                  : isUnlocked
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.03)",
                color: isUnlocked ? "#fff" : "rgba(255,255,255,0.2)",
                cursor: isUnlocked ? "pointer" : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.2rem",
                padding: "0.4rem",
                transition: "transform 0.12s ease, background 0.12s ease",
                boxShadow: isCurrent ? "0 0 16px rgba(255,200,0,0.4)" : "none",
              }}
              onMouseEnter={(e) => {
                if (isUnlocked) e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>
                {isUnlocked ? candy : "🔒"}
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  opacity: isUnlocked ? 1 : 0.35,
                }}
              >
                {levelNum}
              </span>
              {isCurrent && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-4px",
                    fontSize: "0.65rem",
                    background: "#ffd700",
                    color: "#1a0033",
                    borderRadius: "100px",
                    padding: "1px 5px",
                    fontWeight: 800,
                  }}
                >
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginTop: "auto",
          paddingBottom: "1rem",
        }}
      >
        <button
          type="button"
          data-ocid="levelselect.pagination_prev"
          disabled={activePage === 0}
          onClick={() => setActivePage((p) => Math.max(0, p - 1))}
          style={{
            background:
              activePage === 0
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "100px",
            padding: "0.4rem 1rem",
            color:
              activePage === 0
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,220,255,0.8)",
            cursor: activePage === 0 ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          ◀ Prev
        </button>

        <span
          style={{
            color: "rgba(255,200,255,0.5)",
            fontSize: "0.85rem",
            minWidth: "80px",
            textAlign: "center",
          }}
        >
          {activePage + 1} / {totalPages}
        </span>

        <button
          type="button"
          data-ocid="levelselect.pagination_next"
          disabled={activePage === totalPages - 1}
          onClick={() => setActivePage((p) => Math.min(totalPages - 1, p + 1))}
          style={{
            background:
              activePage === totalPages - 1
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "100px",
            padding: "0.4rem 1rem",
            color:
              activePage === totalPages - 1
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,220,255,0.8)",
            cursor: activePage === totalPages - 1 ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default LevelSelectScreen;
