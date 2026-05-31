import axios from "axios";

const API = axios.create({
  baseURL: "https://tak-manager-9cns.onrender.com",
});

API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  if (userInfo?.token) {
    config.headers.Authorization =
      `Bearer ${userInfo.token}`;
  }

  return config;
});

export default API;