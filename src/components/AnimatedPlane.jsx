import React, { useEffect, useState } from "react";

const AnimatedPlane = ({ multiplier = 1.5, isRunning = false, isCrashed = false }) => {
  const [planeStyle, setPlaneStyle] = useState({
    left: "5%",
    bottom: "10%",
    opacity: 1,
    transform: "rotate(-15deg) scale(1)",
  });

  useEffect(() => {
    if (!isRunning) {
      // Reset position
      setPlaneStyle({
        left: "5%",
        bottom: "10%",
        opacity: 1,
        transform: "rotate(-15deg) scale(1)",
      });
      return;
    }

    const startTime = Date.now();
    const duration = 5000; // 5 second animation

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Curve trajectory (quadratic easing)
      const easeProgress = progress * progress * 0.5 + progress * 0.5;

      // Calculate position using curve
      const leftPos = 5 + easeProgress * 85;
      const bottomPos = 10 + Math.sin(progress * Math.PI) * 60;

      // Rotation based on trajectory
      const rotation = -15 + progress * 50;

      // Scale effect (gets smaller as it goes up and away)
      const scale = 1 - progress * 0.3;

      setPlaneStyle({
        left: `${leftPos}%`,
        bottom: `${bottomPos}%`,
        opacity: 1 - progress * 0.2,
        transform: `rotate(${rotation}deg) scale(${scale})`,
      });

      if (progress >= 1) {
        clearInterval(animationInterval);
      }
    }, 30);

    return () => clearInterval(animationInterval);
  }, [isRunning]);

  // SVG Plane Icon (simplified commercial plane)
  const PlaneIcon = () => (
    <svg
      viewBox="0 0 100 100"
      width="80"
      height="80"
      style={{
        filter: isCrashed ? "drop-shadow(0 0 10px #ef4444)" : "drop-shadow(0 0 8px rgba(251, 146, 60, 0.8))",
      }}
    >
      {/* Fuselage */}
      <ellipse cx="50" cy="50" rx="8" ry="25" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />

      {/* Cockpit */}
      <circle cx="50" cy="30" r="5" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />

      {/* Windows */}
      <circle cx="50" cy="40" r="1.5" fill="#87ceeb" />
      <circle cx="50" cy="45" r="1.5" fill="#87ceeb" />
      <circle cx="50" cy="50" r="1.5" fill="#87ceeb" />

      {/* Left Wing */}
      <path d="M 50 48 L 20 50 L 22 52 L 52 50 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />

      {/* Right Wing */}
      <path d="M 50 48 L 80 50 L 78 52 L 48 50 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />

      {/* Tail */}
      <path d="M 50 70 L 45 80 L 50 78 L 55 80 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />

      {/* Engine glow (animated) */}
      {isRunning && (
        <>
          <circle cx="40" cy="60" r="3" fill="#fbbf24" opacity="0.8" />
          <circle cx="60" cy="60" r="3" fill="#fbbf24" opacity="0.8" />
        </>
      )}
    </svg>
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        style={{ pointerEvents: "none" }}
      >
        {[...Array(10)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 10}%`}
            x2="100%"
            y2={`${(i + 1) * 10}%`}
            stroke="#64748b"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${(i + 1) * 10}%`}
            y1="0"
            x2={`${(i + 1) * 10}%`}
            y2="100%"
            stroke="#64748b"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Animated Plane */}
      <div
        className="absolute transition-all"
        style={{
          ...planeStyle,
          transitionDuration: "0ms",
        }}
      >
        <PlaneIcon />
      </div>

      {/* Multiplier Display */}
      <div className="absolute top-8 left-8 z-10">
        <div className="text-white">
          <div className="text-sm font-semibold text-gray-300 mb-2">Current Multiplier</div>
          <div
            className={`text-6xl font-bold font-mono tracking-wider ${
              isCrashed ? "text-red-500" : "text-orange-400"
            }`}
            style={{
              textShadow: isCrashed
                ? "0 0 20px rgba(239, 68, 68, 0.8)"
                : "0 0 20px rgba(251, 146, 60, 0.8)",
            }}
          >
            {multiplier.toFixed(2)}x
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-8 right-8 z-10 flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isRunning
              ? "bg-green-500 animate-pulse"
              : isCrashed
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        />
        <span className="text-gray-300 text-sm font-medium">
          {isRunning ? "Running" : isCrashed ? "Crashed" : "Waiting"}
        </span>
      </div>

      {/* Crash message */}
      {isCrashed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-500 mb-4">💥 CRASHED!</div>
            <div className="text-white text-2xl">at {multiplier.toFixed(2)}x</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedPlane;
