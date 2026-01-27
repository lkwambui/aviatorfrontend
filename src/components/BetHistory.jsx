import React, { useEffect } from "react";
import { useGame } from "../hooks/useGame";

const BetHistory = () => {
  const { currentBets, bets, fetchCurrentBets, fetchBetHistory } = useGame();

  // Refresh bet history periodically
  useEffect(() => {
    fetchCurrentBets();
    fetchBetHistory();

    const interval = setInterval(() => {
      fetchCurrentBets();
      fetchBetHistory();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchCurrentBets, fetchBetHistory]);

  const allBets = [...(currentBets || []), ...(bets || [])].slice(0, 15);

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
      <div className="bg-gray-900 px-4 sm:px-6 py-4 border-b border-gray-700">
        <h3 className="text-white font-bold text-lg sm:text-xl">📊 Bet History</h3>
      </div>

      <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {allBets.length > 0 ? (
          allBets.map((bet, index) => {
            const isWin = bet.status === "cashed_out" || bet.payout > bet.bet_amount;
            const isLoss = bet.status === "lost";
            const isActive = bet.status === "active";

            return (
              <div
                key={bet.id || index}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <span className="text-white font-semibold text-sm sm:text-base">
                    KSH {bet.bet_amount?.toLocaleString() || bet.amount?.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full w-fit ${
                      isWin
                        ? "bg-green-900/40 text-green-300 border border-green-700"
                        : isLoss
                        ? "bg-red-900/40 text-red-300 border border-red-700"
                        : "bg-yellow-900/40 text-yellow-300 border border-yellow-700 animate-pulse"
                    }`}
                  >
                    {isWin
                      ? `+KSH ${(bet.payout || bet.amount * (bet.multiplier || 1)).toLocaleString()}`
                      : isLoss
                      ? `-KSH ${bet.bet_amount?.toLocaleString() || bet.amount?.toLocaleString()}`
                      : "Active"}
                  </span>
                </div>
                <div className="text-gray-400 text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span>
                    @{bet.cashout_multiplier?.toFixed(2) || bet.multiplier?.toFixed(2) || "—"}x
                    {bet.auto_cashout && ` | Auto: ${bet.auto_cashout?.toFixed(2)}x`}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(bet.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
            No bets yet. Place your first bet!
          </div>
        )}
      </div>
    </div>
  );
};

export default BetHistory;
