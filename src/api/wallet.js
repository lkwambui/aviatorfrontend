import api from "./axios";

export const getBalance = () => api.get("/wallet/balance");

export const deposit = (amount) =>
  api.post("/wallet/deposit/stk", { amount });

export const withdraw = (amount, phone) =>
  api.post("/wallet/withdraw/mpesa", { amount, phone_number: phone });
