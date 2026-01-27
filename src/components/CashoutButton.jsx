import React from "react";
import { useGame } from "../hooks/useGame";

const CashoutButton = ({ betId, currentMultiplier }) => {
  const { loading, cashout, gameStatus } = useGame();

  const isEnabled =
    gameStatus === "running" && !loading && betId !== null;

  const handleCashout = async () => {
    try {
      await cashout(betId);
    } catch (err) {
      console.error("Cashout failed:", err);
    }
  };

  return (
    <button
      onClick={handleCashout}
      disabled={!isEnabled}
      className={`px-6 py-2 rounded-lg font-bold transition-all ${
        isEnabled
          ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
      }`}
    >
      {loading ? "Processing..." : `CASHOUT ${currentMultiplier?.toFixed(2)}x`}
    </button>
  );
};

export default CashoutButton;
