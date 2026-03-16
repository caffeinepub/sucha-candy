import type React from "react";
import { useEffect, useState } from "react";

interface Props {
  onStart: () => void;
}

const CANDY_EMOJIS = ["🍬", "🍊", "🍋", "🍏", "🫐", "🍇", "🍭", "🍫", "🍡"];

interface FloatingCandy {
  id: number;
  emoji: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

export const HomeScreen: React.FC<Props> = ({ onStart }) => {
  const [candies, setCandies] = useState<FloatingCandy[]>([]);

  useEffect(() => {
    const generated: FloatingCandy[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: CANDY_EMOJIS[Math.floor(Math.random() * CANDY_EMOJIS.length)],
      left: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      size: 20 + Math.random() * 28,
    }));
    setCandies(generated);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 0%, #3d0066 0%, #1a0033 40%, #0d001a 100%)",
      }}
    >
      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* Floating candies */}
      {candies.map((candy) => (
        <span
          key={candy.id}
          style={{
            position: "absolute",
            bottom: "-60px",
            left: `${candy.left}%`,
            fontSize: `${candy.size}px`,
            opacity: 0.6,
            animationName: "floatUp",
            animationDuration: `${candy.duration}s`,
            animationDelay: `${candy.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 0 8px rgba(255,150,200,0.5))",
          }}
        >
          {candy.emoji}
        </span>
      ))}

      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,50,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,80,150,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,200,255,0.15)",
            borderRadius: "100px",
            padding: "0.4rem 1.2rem",
            fontSize: "0.75rem",
            color: "rgba(255,180,255,0.7)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
          }}
        >
          ✨ Match-3 Puzzle Game
        </div>

        {/* Title */}
        <div>
          <h1
            style={{
              fontSize: "clamp(3rem, 12vw, 6rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              margin: 0,
              background:
                "linear-gradient(135deg, #ff88cc 0%, #ffd700 40%, #ff88cc 80%, #cc44ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(255,150,200,0.6))",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            🍬 Sucha
          </h1>
          <h1
            style={{
              fontSize: "clamp(3.5rem, 14vw, 7rem)",
              fontWeight: 900,
              lineHeight: 1,
              margin: 0,
              background:
                "linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ffd700 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,200,0,0.7))",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Candy
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(255,220,255,0.6)",
            fontSize: "1.1rem",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          Match 3 or more to score!
        </p>

        {/* Candy row decoration */}
        <div
          style={{
            fontSize: "2rem",
            letterSpacing: "0.3em",
            filter: "drop-shadow(0 0 10px rgba(255,200,100,0.5))",
          }}
        >
          🍬🍊🍋🍏🫐🍇
        </div>

        {/* Start button */}
        <button
          type="button"
          data-ocid="home.primary_button"
          onClick={onStart}
          style={{
            position: "relative",
            padding: "1rem 3.5rem",
            fontSize: "1.25rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            border: "none",
            borderRadius: "100px",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, #ff4499 0%, #ff8c00 50%, #ffd700 100%)",
            color: "#1a0033",
            boxShadow:
              "0 0 30px rgba(255,100,150,0.5), 0 0 60px rgba(255,180,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.06) translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 0 50px rgba(255,100,150,0.7), 0 0 80px rgba(255,180,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(255,100,150,0.5), 0 0 60px rgba(255,180,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3)";
          }}
        >
          🎮 Play Now
        </button>

        {/* Level count badge */}
        <div
          style={{
            color: "rgba(255,180,255,0.5)",
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
          }}
        >
          500 levels of sweet chaos
        </div>
      </div>

      {/* Bottom footer */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          zIndex: 10,
          color: "rgba(255,255,255,0.2)",
          fontSize: "0.7rem",
        }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "rgba(255,150,200,0.4)", textDecoration: "none" }}
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
};

export default HomeScreen;
