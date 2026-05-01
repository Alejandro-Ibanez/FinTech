import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7062/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Error de Red: El backend no responde en " + BASE_URL);
    }
    return Promise.reject(error);
  },
);

export default api;
