import React, { useRef, useEffect } from "react";
import { useGame } from "../hooks/useGame";

const MultiplierGraph = () => {
  const canvasRef = useRef(null);
  const { multiplier, gameStatus } = useGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw curve
    if (gameStatus === "running" || gameStatus === "crashed") {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();

      const points = Math.min(Math.floor(multiplier * 10), 200);
      for (let i = 0; i < points; i++) {
        const progress = i / points;
        // Exponential curve
        const curveValue = Math.pow(1.06, i * 0.1);
        const x = (i / 200) * width;
        const y = height - (curveValue / Math.max(multiplier, 10)) * (height * 0.8);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(245, 158, 11, 0.1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, [multiplier, gameStatus]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full bg-linear-to-b from-gray-900 to-black rounded-lg"
    />
  );
};

export default MultiplierGraph;
