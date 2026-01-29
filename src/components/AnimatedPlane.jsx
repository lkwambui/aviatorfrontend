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

    // Calculate position based on multiplier (backend-controlled)
    // Multiplier typically ranges from 1.00x to ~100x+
    // We'll map this to screen position
    const progress = Math.min((multiplier - 1.0) / 20, 1); // Normalize: 1x-20x maps to 0-1

    // Smooth curve trajectory
    const easeProgress = progress * progress * 0.5 + progress * 0.5;

    // Calculate position using curve (diagonal upward path)
    const leftPos = 5 + easeProgress * 85;
    const bottomPos = 10 + easeProgress * 70; // Diagonal climb

    // Rotation based on trajectory (climbing angle)
    const rotation = -15 + easeProgress * 50;

    // Scale effect (gets smaller as it goes higher)
    const scale = 1 - easeProgress * 0.4;

    setPlaneStyle({
      left: `${leftPos}%`,
      bottom: `${bottomPos}%`,
      opacity: 1 - easeProgress * 0.2,
      transform: `rotate(${rotation}deg) scale(${scale})`,
    });
  }, [isRunning, multiplier]);

  // Realistic Plane SVG (commercial jet)
  const PlaneIcon = () => (
    <svg
      viewBox="0 0 120 120"
      width="100"
      height="100"
      style={{
        filter: isCrashed 
          ? "drop-shadow(0 0 20px #ef4444) drop-shadow(0 0 40px #dc2626)" 
          : "drop-shadow(0 0 12px rgba(96, 165, 250, 0.6)) drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))",
      }}
    >
      {/* Main Fuselage (body) */}
      <ellipse 
        cx="60" 
        cy="60" 
        rx="10" 
        ry="35" 
        fill="url(#fuselageGradient)" 
        stroke="#1e40af" 
        strokeWidth="1"
      />
      
      {/* Cockpit Window */}
      <ellipse 
        cx="60" 
        cy="30" 
        rx="7" 
        ry="8" 
        fill="url(#cockpitGradient)" 
        stroke="#1e3a8a" 
        strokeWidth="0.8"
      />
      
      {/* Passenger Windows */}
      <circle cx="60" cy="42" r="2" fill="#60a5fa" opacity="0.9" />
      <circle cx="60" cy="48" r="2" fill="#60a5fa" opacity="0.9" />
      <circle cx="60" cy="54" r="2" fill="#60a5fa" opacity="0.9" />
      <circle cx="60" cy="60" r="2" fill="#60a5fa" opacity="0.9" />
      <circle cx="60" cy="66" r="2" fill="#60a5fa" opacity="0.9" />
      <circle cx="60" cy="72" r="2" fill="#60a5fa" opacity="0.9" />
      
      {/* Main Wings (swept back) */}
      <path 
        d="M 60 55 L 25 62 L 27 66 L 60 58 Z" 
        fill="url(#wingGradient)" 
        stroke="#1e40af" 
        strokeWidth="1"
      />
      <path 
        d="M 60 55 L 95 62 L 93 66 L 60 58 Z" 
        fill="url(#wingGradient)" 
        stroke="#1e40af" 
        strokeWidth="1"
      />
      
      {/* Wing Details (ailerons) */}
      <path 
        d="M 30 63 L 35 64 L 35 65 L 30 64 Z" 
        fill="#2563eb" 
        opacity="0.8"
      />
      <path 
        d="M 90 63 L 85 64 L 85 65 L 90 64 Z" 
        fill="#2563eb" 
        opacity="0.8"
      />
      
      {/* Tail Wing (horizontal stabilizer) */}
      <path 
        d="M 60 85 L 45 88 L 46 90 L 60 87 Z" 
        fill="url(#tailGradient)" 
        stroke="#1e40af" 
        strokeWidth="0.8"
      />
      <path 
        d="M 60 85 L 75 88 L 74 90 L 60 87 Z" 
        fill="url(#tailGradient)" 
        stroke="#1e40af" 
        strokeWidth="0.8"
      />
      
      {/* Vertical Stabilizer (tail fin) */}
      <path 
        d="M 58 85 L 52 98 L 60 96 L 68 98 L 62 85 Z" 
        fill="url(#tailGradient)" 
        stroke="#1e40af" 
        strokeWidth="1"
      />
      
      {/* Engine Nacelles (under wings) */}
      <ellipse 
        cx="35" 
        cy="68" 
        rx="4" 
        ry="8" 
        fill="url(#engineGradient)" 
        stroke="#1e40af" 
        strokeWidth="0.8"
      />
      <ellipse 
        cx="85" 
        cy="68" 
        rx="4" 
        ry="8" 
        fill="url(#engineGradient)" 
        stroke="#1e40af" 
        strokeWidth="0.8"
      />
      
      {/* Engine Glow/Thrust (animated when running) */}
      {isRunning && (
        <>
          <ellipse 
            cx="35" 
            cy="76" 
            rx="3" 
            ry="6" 
            fill="#fbbf24" 
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse 
            cx="85" 
            cy="76" 
            rx="3" 
            ry="6" 
            fill="#fbbf24" 
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Vapor trail effect */}
          <path 
            d="M 35 76 Q 30 85 25 95" 
            stroke="#93c5fd" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.3"
          >
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="0.5s" repeatCount="indefinite" />
          </path>
          <path 
            d="M 85 76 Q 90 85 95 95" 
            stroke="#93c5fd" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.3"
          >
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="0.5s" repeatCount="indefinite" />
          </path>
        </>
      )}
      
      {/* Gradients Definitions */}
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
      
      {/* Airline logo/stripe */}
      <path 
        d="M 54 45 Q 60 45 66 45" 
        stroke="#fbbf24" 
        strokeWidth="1.5" 
        fill="none"
      />
    </svg>
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-linear-to-b from-gray-900 via-gray-800 to-gray-900">
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
