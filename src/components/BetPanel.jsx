import React, { useState } from "react";
import { useGame } from "../hooks/useGame";

const BetPanel = () => {
  const { gameStatus, balance, loading, error, placeBet } = useGame();
  
  const [betAmount, setBetAmount] = useState(1000);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [betPlaced, setBetPlaced] = useState(false);
  const [localError, setLocalError] = useState("");

  const MAX_BET = 50000;
  const MIN_BET = 100;

  const handleBetChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value <= MAX_BET) {
      setBetAmount(value);
    }
  };

  const handleAutoCashoutChange = (e) => {
    const value = parseFloat(e.target.value) || 1.0;
    setAutoCashout(Math.max(1.01, value)); // Minimum 1.01x
  };

  const handleQuickBet = (amount) => {
    if (amount <= MAX_BET && amount >= MIN_BET) {
      setBetAmount(amount);
    }
  };

  const handlePlaceBet = async () => {
    setLocalError("");

    if (gameStatus !== "open") {
      setLocalError(`Betting is closed (${gameStatus}). Wait for next round.`);
      return;
    }

    if (betAmount < MIN_BET) {
      setLocalError(`Minimum bet is KSH ${MIN_BET}`);
      return;
    }

    if (betAmount > MAX_BET) {
      setLocalError(`Maximum bet is KSH ${MAX_BET}`);
      return;
    }

    if (betAmount > balance) {
      setLocalError("Insufficient balance");
      return;
    }

    try {
      await placeBet(betAmount, autoCashout);
      setBetPlaced(true);
      setTimeout(() => setBetPlaced(false), 2000);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const isBettingEnabled = gameStatus === "open" && !loading && betAmount >= MIN_BET && betAmount <= balance;

  return (
    <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-lg h-fit sticky top-20">
      {/* Balance Display */}
      <div className="bg-linear-to-r from-orange-600 to-orange-500 rounded-lg p-4 text-center">
        <p className="text-orange-100 text-xs sm:text-sm font-medium mb-1">Available Balance</p>
        <p className="text-2xl sm:text-3xl font-bold text-white font-mono">
          KSH {balance.toLocaleString()}
        </p>
      </div>

      {/* Error Messages */}
      {(error || localError) && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-200 text-xs sm:text-sm">
          {error || localError}
        </div>
      )}

      {/* Bet Amount Input */}
      <div>
        <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
          Bet Amount (KSH)
        </label>
        <input
          type="number"
          value={betAmount}
          onChange={handleBetChange}
          disabled={!gameStatus === "open"}
          min={MIN_BET}
          max={MAX_BET}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50 font-mono"
        />
        <p className="text-gray-400 text-xs mt-2">
          Min: KSH {MIN_BET.toLocaleString()} | Max: KSH {MAX_BET.toLocaleString()}
        </p>
      </div>

      {/* Quick Bet Buttons */}
      <div>
        <p className="text-gray-300 text-xs sm:text-sm font-semibold mb-2">Quick Bets</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[1000, 5000, 10000].map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickBet(amount)}
              disabled={gameStatus !== "open"}
              className="bg-gray-700 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
            >
              {(amount / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
      </div>

      {/* Auto Cashout */}
      <div>
        <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
          Auto Cashout at
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={autoCashout}
            onChange={handleAutoCashoutChange}
            disabled={gameStatus !== "open"}
            min={1.01}
            max={100}
            step={0.1}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50 font-mono"
          />
          <span className="text-white font-bold text-base sm:text-lg">x</span>
        </div>
      </div>

      {/* Place Bet Button */}
      <button
        onClick={handlePlaceBet}
        disabled={!isBettingEnabled || loading}
        className={`w-full py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
          isBettingEnabled && !loading
            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white cursor-pointer hover:shadow-lg hover:shadow-orange-500/50"
            : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
        }`}
      >
        {loading ? "Placing..." : gameStatus !== "open" ? "Betting Closed" : `Bet KSH ${betAmount.toLocaleString()}`}
      </button>

      {/* Status Messages */}
      {gameStatus === "open" && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-green-300 text-xs sm:text-sm text-center font-medium">
          ✓ Betting is open
        </div>
      )}

      {gameStatus === "running" && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 text-yellow-300 text-xs sm:text-sm text-center font-medium animate-pulse">
          ⏳ Round running - betting closed
        </div>
      )}

      {gameStatus === "crashed" && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-xs sm:text-sm text-center font-medium">
          💥 Round crashed
        </div>
      )}
    </div>
  );
};

export default BetPanel;
