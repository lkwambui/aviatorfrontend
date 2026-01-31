import React, { useState, useEffect } from "react";
import * as aviatorAPI from "../api/aviator";

const RecentMultipliers = () => {
  const [multipliers, setMultipliers] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await aviatorAPI.getRecentRounds();
        const rounds = response.data.recent_rounds || [];
        setMultipliers(rounds.map(r => r.crash_point));
      } catch (error) {
        console.error("Failed to fetch recent rounds:", error);
      }
    };

    fetchRecent();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchRecent, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getMultiplierColor = (value) => {
    if (value >= 10) return "text-purple-400";
    if (value >= 5) return "text-pink-400";
    if (value >= 2) return "text-blue-400";
    return "text-gray-400";
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 px-4 bg-gray-900/50">
      {multipliers.length === 0 ? (
        <div className="text-gray-500 text-sm">No recent rounds</div>
      ) : (
        multipliers.map((mult, index) => (
          <div
            key={index}
            className={`shrink-0 text-sm font-bold ${getMultiplierColor(mult)}`}
          >
            {mult.toFixed(2)}x
          </div>
        ))
      )}
    </div>
  );
};

export default RecentMultipliers;
