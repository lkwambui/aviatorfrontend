import React from "react";
import { useGame } from "../hooks/useGame";

const MultiplierDisplay = () => {
  const { multiplier, gameStatus } = useGame();

  const isRunning = gameStatus === "running";
  const isCrashed = gameStatus === "crashed";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className={`text-center ${isCrashed ? "opacity-50" : ""}`}>
        <div className="text-8xl font-bold text-white drop-shadow-lg">
          {multiplier.toFixed(2)}
          <span className="text-4xl ml-2">x</span>
        </div>
        {isCrashed && (
          <div className="text-red-500 text-3xl font-bold mt-4">CRASHED</div>
        )}
      </div>
    </div>
  );
};

export default MultiplierDisplay;
