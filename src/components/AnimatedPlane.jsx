import React, { useEffect, useState } from "react";

/**
 * AnimatedPlane
 * UI-only Aviator animation component
 */
const AnimatedPlane = ({
  multiplier = 1.0,
  isRunning = false,
  isCrashed = false,
}) => {
  const [planeStyle, setPlaneStyle] = useState({
    opacity: 1,
    transform: "translate3d(0,0,0) rotate(0deg) scale(1)",
  });

  // Clamp & normalize multiplier
  const safeMultiplier = Math.max(1, multiplier);
  const progress =
    isRunning && !isCrashed
      ? Math.min((safeMultiplier - 1) / 20, 1)
      : 0;

  const ease = progress * progress * 0.6 + progress * 0.4;

  // Bezier curve (flight path)
  const startX = 5;
  const startY = 8;
  const controlX = 35;
  const controlY = 88;
  const endX = 90;
  const endY = 80;

  const x =
    (1 - ease) * (1 - ease) * startX +
    2 * (1 - ease) * ease * controlX +
    ease * ease * endX;

  const y =
    (1 - ease) * (1 - ease) * startY +
    2 * (1 - ease) * ease * controlY +
    ease * ease * endY;

  const dx =
    2 * (1 - ease) * (controlX - startX) +
    2 * ease * (endX - controlX);

  const dy =
    2 * (1 - ease) * (controlY - startY) +
    2 * ease * (endY - controlY);

  const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
  const scale = 1 - ease * 0.25;

  const px =
    (x / 100) * window.innerWidth - 70;
  const py =
    (y / 100) * window.innerHeight - 70;

  // 🔥 FIX: stop animation on crash
  useEffect(() => {
    if (!isRunning || isCrashed) {
      setPlaneStyle((s) => ({
        ...s,
        opacity: isCrashed ? 0 : 1,
      }));
      return;
    }

    setPlaneStyle({
      opacity: 1,
      transform: `translate3d(${px}px, ${py}px, 0)
                  rotate(${rotation}deg)
                  scale(${scale})`,
    });
  }, [isRunning, isCrashed, px, py, rotation, scale]);

  // ✈️ Plane SVG (bigger & brighter)
  const PlaneIcon = () => (
    <svg
      viewBox="0 0 160 80"
      width="140"
      height="140"
      style={{
        filter: isCrashed
          ? "drop-shadow(0 0 30px #ef4444)"
          : "drop-shadow(0 0 20px rgba(96,165,250,0.9))",
      }}
    >
      <path
        d="M 10 40 Q 30 28 70 26 L 130 26 Q 145 26 150 34 Q 152 38 150 40 Q 152 42 150 46 Q 145 54 130 54 L 70 54 Q 30 52 10 40 Z"
        fill="#60a5fa"
        stroke="#1e40af"
        strokeWidth="1"
      />
    </svg>
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">

      {/* ⭐ STARS */}
      <div className="absolute inset-0 stars-layer" />

      {/* ☁️ CLOUDS */}
      <div className="absolute inset-0 clouds-layer" />

      {/* ✈️ Plane */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          ...planeStyle,
        }}
      >
        <PlaneIcon />
      </div>

      {/* 💥 Crash Overlay */}
      {isCrashed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur">
          <div className="text-center">
            <div className="text-6xl text-red-500 font-bold">💥 CRASHED</div>
            <div className="text-white text-2xl mt-2">
              {multiplier.toFixed(2)}x
            </div>
          </div>
        </div>
      )}

      {/* Multiplier */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-6xl font-mono font-bold text-blue-400">
          {multiplier.toFixed(2)}x
        </div>
      </div>
    </div>
  );
};

export default AnimatedPlane;