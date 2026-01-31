import React, { createContext, useState, useCallback, useEffect } from "react";
import * as aviatorAPI from "../api/aviator";
import * as walletAPI from "../api/wallet";

export const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [roundData, setRoundData] = useState(null);
  const [balance, setBalance] = useState(0);
  const [bets, setBets] = useState([]);
  const [currentBets, setCurrentBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState("closed"); // open, running, crashed, closed

  // Fetch current round
  const fetchRound = useCallback(async () => {
    try {
      const res = await aviatorAPI.getRound();
      setRoundData(res.data);
      setGameStatus(res.data.status);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch round");
    }
  }, []);

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    try {
      const res = await walletAPI.getBalance();
      setBalance(res.data.balance || 0);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  }, []);

  // Fetch bet history
  const fetchBetHistory = useCallback(async () => {
    try {
      const res = await aviatorAPI.getBetHistory();
      setBets(res.data.bets || []);
    } catch (err) {
      console.error("Failed to fetch bet history", err);
    }
  }, []);

  // Fetch current active bets
  const fetchCurrentBets = useCallback(async () => {
    try {
      const res = await aviatorAPI.getCurrentBets();
      setCurrentBets(res.data.bets || []);
    } catch (err) {
      console.error("Failed to fetch current bets", err);
    }
  }, []);

  // Place bet
  const placeBet = useCallback(
    async (amount, autoCashout) => {
      setLoading(true);
      setError(null);
      try {
        const res = await aviatorAPI.placeBet(amount, autoCashout);
        await fetchBalance();
        await fetchCurrentBets();
        return res.data;
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to place bet";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [fetchBalance, fetchCurrentBets]
  );

  // Cashout bet
  const cashout = useCallback(
    async (betId) => {
      setLoading(true);
      setError(null);
      try {
        const res = await aviatorAPI.manualCashout(betId);
        await fetchBalance();
        await fetchCurrentBets();
        return res.data;
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to cashout";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [fetchBalance, fetchCurrentBets]
  );

  // Simulate multiplier increment (FRONTEND RESPONSIBILITY per integration manual)
  useEffect(() => {
    if (gameStatus !== "running") return;

    const interval = setInterval(() => {
      setMultiplier((prev) => {
        const newMultiplier = prev + 0.6;
        return newMultiplier > 20 ? 20 : newMultiplier; // Cap at 20x (backend cap)
      });
    }, 30);

    return () => clearInterval(interval);
  }, [gameStatus]);

  // Poll round every 300-500ms
  useEffect(() => {
    fetchRound();
    const interval = setInterval(fetchRound, 500);
    return () => clearInterval(interval);
  }, [fetchRound]);

  // Reset multiplier on round status change
  useEffect(() => {
    if (roundData?.status === "open" || roundData?.status === "closed") {
      setMultiplier(1.0);
      setGameStatus(roundData?.status || "closed");
    } else if (roundData?.status === "running") {
      setGameStatus("running");
    } else if (roundData?.status === "crashed") {
      setGameStatus("crashed");
    }
  }, [roundData?.status, roundData?.id]);

  return (
    <GameContext.Provider
      value={{
        roundData,
        currentRound: roundData,
        balance,
        bets,
        currentBets,
        loading,
        error,
        multiplier,
        gameStatus,
        fetchRound,
        fetchBalance,
        fetchBetHistory,
        fetchCurrentBets,
        placeBet,
        cashout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
