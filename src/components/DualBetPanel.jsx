import React, { useState } from "react";
import { useGame } from "../hooks/useGame";
import { useAuth } from "../hooks/useAuth";

const DualBetPanel = () => {
  const { gameStatus, balance, placeBet, loading } = useGame();
  const { isAuthenticated } = useAuth();
  
  const [bet1Amount, setBet1Amount] = useState(100);
  const [bet2Amount, setBet2Amount] = useState(500);
  const [autoCashout1, setAutoCashout1] = useState(2.0);
  const [autoCashout2, setAutoCashout2] = useState(2.0);
  const [bet1Placed, setBet1Placed] = useState(false);
  const [bet2Placed, setBet2Placed] = useState(false);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  const quickAmounts = [100, 500, 1000, 10000];
  const MIN_BET = 100;
  const MAX_BET = 50000;

  const adjustAmount = (amount, delta, setter) => {
    const newAmount = Math.max(MIN_BET, amount + delta);
    if (newAmount <= MAX_BET) {
      setter(newAmount);
    }
  };

  const handlePlaceBet = async (betNum) => {
    const amount = betNum === 1 ? bet1Amount : bet2Amount;
    const autoCashout = betNum === 1 ? autoCashout1 : autoCashout2;
    const setError = betNum === 1 ? setError1 : setError2;
    const setBetPlaced = betNum === 1 ? setBet1Placed : setBet2Placed;

    setError("");

    if (!isAuthenticated) {
      setError("Please login to place bets");
      return;
    }

    if (gameStatus !== "open") {
      setError(`Betting is ${gameStatus}`);
      return;
    }

    if (amount < MIN_BET) {
      setError(`Min bet: ${MIN_BET} KSH`);
      return;
    }

    if (amount > balance) {
      setError("Insufficient balance");
      return;
    }

    try {
      await placeBet(amount, autoCashout);
      setBetPlaced(true);
      setTimeout(() => setBetPlaced(false), 2000);
    } catch (err) {
      setError(err.message || "Failed to place bet");
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
      {/* Bet Panel 1 */}
      <div className="flex-1 bg-gray-900/80 rounded-lg p-4">
        {error1 && (
          <div className="mb-3 bg-red-900/30 border border-red-700 rounded px-3 py-2 text-red-200 text-xs">
            {error1}
          </div>
        )}

        {/* Amount Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => adjustAmount(bet1Amount, -100, setBet1Amount)}
              disabled={gameStatus !== "open" || loading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg sm:text-xl disabled:opacity-50"
            >
              −
            </button>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{bet1Amount}</div>
            </div>
            <button
              onClick={() => adjustAmount(bet1Amount, 100, setBet1Amount)}
              disabled={gameStatus !== "open" || loading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg sm:text-xl disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBet1Amount(amount)}
                disabled={gameStatus !== "open" || loading}
                className="py-1.5 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors disabled:opacity-50"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Cashout */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">Auto Cashout</label>
          <input
            type="number"
            value={autoCashout1}
            onChange={(e) => setAutoCashout1(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
            disabled={gameStatus !== "open" || loading}
            step="0.1"
            min="1.01"
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm font-mono disabled:opacity-50"
          />
        </div>

        {/* Bet Button */}
        <button
          onClick={() => handlePlaceBet(1)}
          disabled={gameStatus !== "open" || loading || !isAuthenticated || bet1Placed}
          className={`w-full py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg transition-all shadow-lg ${
            gameStatus === "open" && !loading && isAuthenticated && !bet1Placed
              ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-900/50"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {bet1Placed ? (
            <>✓ BET PLACED</>
          ) : loading ? (
            <>PLACING...</>
          ) : !isAuthenticated ? (
            <>LOGIN TO BET</>
          ) : (
            <>
              BET<br />
              <span className="text-sm font-normal">{bet1Amount.toFixed(2)} KSH</span>
            </>
          )}
        </button>
      </div>

      {/* Bet Panel 2 */}
      <div className="flex-1 bg-gray-900/80 rounded-lg p-4">
        {error2 && (
          <div className="mb-3 bg-red-900/30 border border-red-700 rounded px-3 py-2 text-red-200 text-xs">
            {error2}
          </div>
        )}

        {/* Amount Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => adjustAmount(bet2Amount, -100, setBet2Amount)}
              disabled={gameStatus !== "open" || loading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg sm:text-xl disabled:opacity-50"
            >
              −
            </button>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{bet2Amount}</div>
            </div>
            <button
              onClick={() => adjustAmount(bet2Amount, 100, setBet2Amount)}
              disabled={gameStatus !== "open" || loading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg sm:text-xl disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBet2Amount(amount)}
                disabled={gameStatus !== "open" || loading}
                className="py-1.5 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors disabled:opacity-50"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Cashout */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">Auto Cashout</label>
          <input
            type="number"
            value={autoCashout2}
            onChange={(e) => setAutoCashout2(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
            disabled={gameStatus !== "open" || loading}
            step="0.1"
            min="1.01"
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm font-mono disabled:opacity-50"
          />
        </div>

        {/* Bet Button */}
        <button
          onClick={() => handlePlaceBet(2)}
          disabled={gameStatus !== "open" || loading || !isAuthenticated || bet2Placed}
          className={`w-full py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg transition-all shadow-lg ${
            gameStatus === "open" && !loading && isAuthenticated && !bet2Placed
              ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-900/50"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {bet2Placed ? (
            <>✓ BET PLACED</>
          ) : loading ? (
            <>PLACING...</>
          ) : !isAuthenticated ? (
            <>LOGIN TO BET</>
          ) : (
            <>
              BET<br />
              <span className="text-sm font-normal">{bet2Amount.toFixed(2)} KSH</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DualBetPanel;
