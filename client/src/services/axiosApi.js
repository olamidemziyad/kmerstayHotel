import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


   //INTERCEPTOR AUTH

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
