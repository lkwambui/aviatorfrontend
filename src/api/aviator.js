import api from "./axios";

export const getRound = () => api.get("/aviator/round");

export const placeBet = (amount, autoCashout) =>
  api.post("/aviator/bet", {
    amount,
    auto_cashout: autoCashout,
  });
