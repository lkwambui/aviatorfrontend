import React from "react";

const LiveBetsSidebar = () => {
  // Mock data for live bets
  const liveBets = [
    { user: "2***3", betAmount: 8850.00, cashout: "1.16x", wonAmount: 10267.44 },
    { user: "2***2", betAmount: 6600.00, cashout: "1.58x", wonAmount: 10427.53 },
    { user: "2***7", betAmount: 4650.00, cashout: "1.45x", wonAmount: 6742.61 },
    { user: "2***7", betAmount: 3400.00, cashout: "1.36x", wonAmount: 4623.79 },
    { user: "2***9", betAmount: 3350.00, cashout: "1.37x", wonAmount: 4589.54 },
    { user: "2***9", betAmount: 3310.00, cashout: "1.20x", wonAmount: 3971.83 },
    { user: "2***7", betAmount: 3220.00, cashout: "1.31x", wonAmount: 4218.09 },
    { user: "2***1", betAmount: 2990.00, cashout: "1.34x", wonAmount: 4006.40 },
    { user: "2***9", betAmount: 2900.00, cashout: "1.12x", wonAmount: 3247.84 },
    { user: "2***9", betAmount: 2770.00, cashout: "", wonAmount: 0 },
    { user: "2***6", betAmount: 2710.00, cashout: "", wonAmount: 0 },
    { user: "2***3", betAmount: 2610.00, cashout: "1.35x", wonAmount: 3388.35 },
    { user: "2***6", betAmount: 2270.00, cashout: "1.87x", wonAmount: 3790.89 },
    { user: "2***3", betAmount: 2140.00, cashout: "1.23x", wonAmount: 2632.32 },
  ];

  // Generate random avatar colors
  const getAvatarColor = (index) => {
    const colors = [
      "bg-purple-600", "bg-blue-600", "bg-green-600", 
      "bg-yellow-600", "bg-red-600", "bg-pink-600",
      "bg-indigo-600", "bg-teal-600"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col border-r border-gray-800">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button className="flex-1 py-3 px-4 text-sm font-semibold bg-purple-900/30 text-purple-400 border-b-2 border-purple-500">
          Live Bets
        </button>
        <button className="flex-1 py-3 px-4 text-sm font-semibold text-gray-500 hover:text-gray-300">
          My Bets
        </button>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-4 gap-2 px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-800">
        <div>User</div>
        <div className="text-right">Bet KSH</div>
        <div className="text-right">Cashout</div>
        <div className="text-right">Won KSH</div>
      </div>

      {/* Live Bets List */}
      <div className="flex-1 overflow-y-auto">
        {liveBets.map((bet, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-2 px-3 py-2.5 items-center border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
          >
            {/* User with Avatar */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-xs font-bold`}>
                {bet.user.charAt(0)}
              </div>
              <span className="text-xs text-gray-300">{bet.user}</span>
            </div>

            {/* Bet Amount */}
            <div className="text-right text-xs text-gray-300">
              {bet.betAmount.toFixed(2)}
            </div>

            {/* Cashout */}
            <div className="text-right">
              {bet.cashout ? (
                <span className="text-xs font-bold bg-red-900/40 text-red-400 px-2 py-0.5 rounded">
                  {bet.cashout}
                </span>
              ) : (
                <span className="text-xs text-gray-600">-</span>
              )}
            </div>

            {/* Won Amount */}
            <div className="text-right text-xs font-semibold text-green-400">
              {bet.wonAmount > 0 ? bet.wonAmount.toFixed(2) : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveBetsSidebar;
