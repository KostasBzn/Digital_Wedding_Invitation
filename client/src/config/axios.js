import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosAuth = axios.create({
  baseURL: baseURL,
});

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosAuth;
