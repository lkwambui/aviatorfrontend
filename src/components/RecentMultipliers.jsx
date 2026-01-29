import React from "react";

const RecentMultipliers = () => {
  // Mock recent multipliers
  const multipliers = [
    82.29, 74.34, 1.83, 2.09, 1.20, 2.55, 1.27, 1.08, 
    1.05, 1.03, 2.80, 1.33, 1.42, 1.23
  ];

  const getMultiplierColor = (value) => {
    if (value >= 10) return "text-purple-400";
    if (value >= 5) return "text-pink-400";
    if (value >= 2) return "text-blue-400";
    return "text-gray-400";
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 px-4 bg-gray-900/50">
      {multipliers.map((mult, index) => (
        <div
          key={index}
          className={`flex-shrink-0 text-sm font-bold ${getMultiplierColor(mult)}`}
        >
          {mult.toFixed(2)}x
        </div>
      ))}
    </div>
  );
};

export default RecentMultipliers;
