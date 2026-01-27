import React from "react";

const NetworkStatus = ({ isConnected }) => {
  return (
    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      <span className="text-xs sm:text-sm font-semibold text-gray-300">
        {isConnected ? "🔌 Online" : "📡 Offline"}
      </span>
    </div>
  );
};

export default NetworkStatus;
