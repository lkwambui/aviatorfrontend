import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, loading, error } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!phone || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await login(phone, password);
      onClose();
    } catch (err) {
      setLocalError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition"
          >
            ✕
          </button>
        </div>

        {(error || localError) && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-200 text-sm">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="254712345678"
              autoComplete="tel"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="text-orange-400 hover:text-orange-300 font-semibold transition"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
