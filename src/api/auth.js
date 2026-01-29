import api from "./axios";

export const register = (phone, password) =>
  api.post("/auth/register", {
    phone,
    password,
  });

export const login = async (phone, password) => {
  const res = await api.post("/auth/login", {
    phone,
    password,
  });

  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
