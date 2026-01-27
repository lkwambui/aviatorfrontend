import React, { useState, useEffect } from "react";
import { useGame } from "../hooks/useGame";
import { useAuth } from "../hooks/useAuth";
import AnimatedPlane from "../components/AnimatedPlane";
import BetPanel from "../components/BetPanel";
import BetHistory from "../components/BetHistory";
import NetworkStatus from "../components/NetworkStatus";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

const Aviator = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { fetchBalance, gameStatus, multiplier, currentRound, balance } = useGame();
  const [isConnected, setIsConnected] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated, fetchBalance]);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const isCrashed = gameStatus === "crashed";
  const isRunning = gameStatus === "running";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Logo and Status */}
            <div className="flex items-center gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                ✈️ AVIATOR
              </h1>
              <span className="hidden sm:block text-gray-600">|</span>
              <NetworkStatus isConnected={isConnected} />
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
              {isAuthenticated && user ? (
                <>
                  <div className="text-right hidden sm:block">
                    <p className="text-gray-400 text-xs sm:text-sm">User</p>
                    <p className="text-white font-semibold text-sm">{user?.phone_number}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left: Game Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Animated Plane Game */}
            <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gray-700 overflow-hidden shadow-2xl h-96 sm:h-[500px]">
              <AnimatedPlane
                multiplier={multiplier}
                isRunning={isRunning}
                isCrashed={isCrashed}
              />
            </div>

            {/* Game Statistics */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-4 sm:p-6 shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Game Status</p>
                  <p
                    className={`font-bold text-base sm:text-lg mt-1 capitalize ${
                      gameStatus === "open"
                        ? "text-green-400"
                        : gameStatus === "running"
                        ? "text-yellow-400 animate-pulse"
                        : gameStatus === "crashed"
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {gameStatus}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Multiplier</p>
                  <p className="font-bold text-base sm:text-lg mt-1 text-orange-400">
                    {multiplier.toFixed(2)}x
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Round</p>
                  <p className="font-bold text-base sm:text-lg mt-1 text-white">
                    #{currentRound?.id || "--"}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Balance</p>
                  <p className="font-bold text-base sm:text-lg mt-1 text-green-400">
                    {isAuthenticated ? `${balance?.toFixed(2) || "0.00"} KSH` : "Login"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bet History */}
            {isAuthenticated && <BetHistory />}
          </div>

          {/* Right: Bet Panel (1/3 width) */}
          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <BetPanel />
            ) : (
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 text-center h-fit sticky top-20">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-3">Login to Play</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Create an account or login to start placing bets and playing.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => setShowRegisterModal(true)}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => setShowLoginModal(true)}
      />
    </div>
  );
};

export default Aviator;

