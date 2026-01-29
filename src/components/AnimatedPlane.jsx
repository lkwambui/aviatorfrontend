import React, { useEffect, useState } from "react";

const AnimatedPlane = ({ multiplier = 1.5, isRunning = false, isCrashed = false }) => {
  const [planeStyle, setPlaneStyle] = useState({
    left: "5%",
    bottom: "8%",
    opacity: 1,
    transform: "rotate(0deg) scale(1)",
  });

  const clampMultiplier = Math.max(1, multiplier);
  const progress = isRunning ? Math.min((clampMultiplier - 1.0) / 20, 1) : 0;
  const easeProgress = progress * progress * 0.5 + progress * 0.5;

  const startX = 5;
  const startY = 8;
  const controlX = 35;
  const controlY = 88;
  const endX = 90;
  const endY = 80;

  const currentX =
    (1 - easeProgress) * (1 - easeProgress) * startX +
    2 * (1 - easeProgress) * easeProgress * controlX +
    easeProgress * easeProgress * endX;
  const currentY =
    (1 - easeProgress) * (1 - easeProgress) * startY +
    2 * (1 - easeProgress) * easeProgress * controlY +
    easeProgress * easeProgress * endY;

  const tangentX =
    2 * (1 - easeProgress) * (controlX - startX) +
    2 * easeProgress * (endX - controlX);
  const tangentY =
    2 * (1 - easeProgress) * (controlY - startY) +
    2 * easeProgress * (endY - controlY);

  const rotation = Math.atan2(tangentY, tangentX) * (180 / Math.PI);
  const scale = 1 - easeProgress * 0.35;

  useEffect(() => {
    if (!isRunning) {
      // Reset position
      setPlaneStyle({
        left: "5%",
        bottom: "8%",
        opacity: 1,
        transform: "rotate(0deg) scale(1)",
      });
      return;
    }

    setPlaneStyle({
      left: `${currentX}%`,
      bottom: `${currentY}%`,
      opacity: 1 - easeProgress * 0.2,
      transform: `rotate(${rotation}deg) scale(${scale})`,
    });
  }, [isRunning, currentX, currentY, easeProgress, rotation, scale]);

  // Sleek jet silhouette (UI only)
  const PlaneIcon = () => (
    <svg
      viewBox="0 0 160 80"
      width="90"
      height="90"
      style={{
        filter: isCrashed 
          ? "drop-shadow(0 0 20px #ef4444) drop-shadow(0 0 40px #dc2626)" 
          : "drop-shadow(0 0 12px rgba(96, 165, 250, 0.6)) drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))",
      }}
    >
      {/* Body */}
      <path
        d="M 10 40 Q 30 28 70 26 L 130 26 Q 145 26 150 34 Q 152 38 150 40 Q 152 42 150 46 Q 145 54 130 54 L 70 54 Q 30 52 10 40 Z"
        fill="url(#fuselageGradient)"
        stroke="#1e40af"
        strokeWidth="1"
      />

      {/* Nose */}
      <path
        d="M 150 34 Q 158 38 156 40 Q 158 42 150 46"
        fill="url(#fuselageGradient)"
        stroke="#1e40af"
        strokeWidth="1"
      />

      {/* Cockpit */}
      <path
        d="M 132 32 Q 138 34 140 40 Q 138 46 132 48"
        fill="url(#cockpitGradient)"
        stroke="#1e3a8a"
        strokeWidth="0.8"
      />

      {/* Wing */}
      <path
        d="M 80 38 L 45 18 L 52 18 L 92 36 Z"
        fill="url(#wingGradient)"
        stroke="#1e40af"
        strokeWidth="0.8"
      />
      <path
        d="M 80 42 L 50 62 L 58 62 L 95 46 Z"
        fill="url(#wingGradient)"
        stroke="#1e40af"
        strokeWidth="0.8"
      />

      {/* Tail */}
      <path
        d="M 30 30 L 18 16 L 30 18 Z"
        fill="url(#tailGradient)"
        stroke="#1e40af"
        strokeWidth="0.8"
      />
      <path
        d="M 28 50 L 18 64 L 30 60 Z"
        fill="url(#tailGradient)"
        stroke="#1e40af"
        strokeWidth="0.8"
      />

      {/* Engine */}
      <ellipse cx="72" cy="50" rx="6" ry="3" fill="url(#engineGradient)" stroke="#1e40af" strokeWidth="0.8" />

      {/* Windows */}
      <circle cx="90" cy="40" r="2" fill="#60a5fa" opacity="0.9" />
      <circle cx="100" cy="40" r="2" fill="#60a5fa" opacity="0.9" />
      <circle cx="110" cy="40" r="2" fill="#60a5fa" opacity="0.9" />

      {/* Engine Glow */}
      {isRunning && (
        <>
          <ellipse cx="60" cy="50" rx="6" ry="3" fill="#fbbf24" opacity="0.7">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <path d="M 48 50 Q 36 52 24 56" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="0.5s" repeatCount="indefinite" />
          </path>
        </>
      )}

      <defs>
        <linearGradient id="fuselageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="cockpitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="engineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="50%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-linear-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Background rays */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "conic-gradient(from 210deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02), rgba(255,255,255,0.05))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* Curve path and fill */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={`M ${startX} ${100 - startY} Q ${controlX} ${100 - controlY} ${currentX} ${100 - currentY} L ${currentX} 100 L ${startX} 100 Z`}
          fill="rgba(96, 165, 250, 0.35)"
        />
        <path
          d={`M ${startX} ${100 - startY} Q ${controlX} ${100 - controlY} ${currentX} ${100 - currentY}`}
          stroke="rgba(96, 165, 250, 0.9)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Axis dots */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <span
            key={`bottom-dot-${i}`}
            className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-blue-400"
            style={{ left: `${8 + i * 12}%` }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <span
            key={`left-dot-${i}`}
            className="absolute left-2 w-1.5 h-1.5 rounded-full bg-blue-400"
            style={{ bottom: `${8 + i * 10}%` }}
          />
        ))}
      </div>

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
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div
            className={`text-6xl font-bold font-mono tracking-wider transition-all duration-150 ${
              isCrashed ? "text-red-500" : "text-blue-400"
            }`}
            style={{
              textShadow: isCrashed
                ? "0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(220, 38, 38, 0.6)"
                : "0 0 20px rgba(96, 165, 250, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)",
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
