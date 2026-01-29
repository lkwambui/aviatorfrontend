import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryRequest = async (config, retries = 0) => {
  try {
    return await api.request(config);
  } catch (error) {
    if (
      retries < MAX_RETRIES &&
      (error.code === "ECONNREFUSED" ||
        error.code === "ECONNRESET" ||
        error.message === "net::ERR_CONNECTION_CLOSED")
    ) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(config, retries + 1);
    }
    throw error;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
