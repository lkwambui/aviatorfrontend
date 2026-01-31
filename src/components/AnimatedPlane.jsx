import React, { useEffect, useRef, useState } from "react";
import "../styles/aviator.css";

export default function AviatorGame() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState("waiting"); // waiting | running | crashed
  const [crashAt, setCrashAt] = useState(2.45); // TEMP (will come from backend)
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // -------- MULTIPLIER ENGINE (FRONTEND SYNC) --------
  useEffect(() => {
    if (status !== "running") return;

    startTimeRef.current = performance.now();

    const animate = (time) => {
      const elapsed = (time - startTimeRef.current) / 1000;

      // Smooth exponential growth (aviator-like)
      const value = Math.exp(elapsed * 0.45);

      if (value >= crashAt) {
        setMultiplier(crashAt);
        setStatus("crashed");
        cancelAnimationFrame(animationRef.current);
        return;
      }

      setMultiplier(Number(value.toFixed(2)));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [status, crashAt]);

  // -------- AUTO START LOOP (TEMP) --------
  useEffect(() => {
    if (status === "waiting") {
      setTimeout(() => {
        setMultiplier(1.0);
        setCrashAt(Number((Math.random() * 3 + 1.2).toFixed(2)));
        setStatus("running");
      }, 2500);
    }

    if (status === "crashed") {
      setTimeout(() => {
        setStatus("waiting");
      }, 3000);
    }
  }, [status]);

  // -------- CURVE POSITION --------
  const progress = Math.min((multiplier - 1) / crashAt, 1);

  const x = 10 + progress * 80;
  const y = 90 - Math.pow(progress, 0.55) * 80;

  return (
    <div className="aviator-container">
      {/* BACKGROUND */}
      <div className={`space-bg ${status === "running" ? "moving" : ""}`} />

      {/* MULTIPLIER */}
      <div className={`multiplier ${status}`}>
        {multiplier.toFixed(2)}x
      </div>

      {/* GRAPH */}
      <svg className="graph" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={`M10 90 Q 40 20 ${x} ${y}`}
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M10 90 Q 40 20 ${x} ${y} L ${x} 100 L 10 100 Z`}
          fill="rgba(239,68,68,0.25)"
        />
      </svg>

      {/* PLANE */}
      <div
        className={`plane ${status}`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(${progress * 35}deg)`
        }}
      >
        ✈️
      </div>

      {/* CRASH OVERLAY */}
      {status === "crashed" && (
        <div className="crash-overlay">
          💥 CRASHED @ {crashAt}x
        </div>
      )}
    </div>
  );
}