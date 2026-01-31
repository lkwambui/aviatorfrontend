import api from "./axios";

export const getRound = () => api.get("/aviator/round");

export const getRecentRounds = () => api.get("/aviator/recent");

export const placeBet = (amount, autoCashout) =>
  api.post("/aviator/bet", {
    amount,
    auto_cashout: autoCashout,
  });
