import axios from "axios";

export const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return config;
  }

  config.headers["Authorization"] = `Bearer ${accessToken}`;

  return config;
});
