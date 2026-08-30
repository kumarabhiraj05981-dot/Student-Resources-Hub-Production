import axios from "axios";

// ==========================================
// PRODUCTION BACKEND URL
// ==========================================
//
// VITE_API_URL agar Vercel mein set hai,
// to wahi use hoga.
//
// Agar environment variable missing hai,
// to live Render backend use hoga.
//
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://student-resources-hub-1.onrender.com";

// ==========================================
// AXIOS INSTANCE
// ==========================================

const api = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
//
// Har request mein login token automatically
// Authorization header mein add hoga.
//
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (
      error.response?.status === 401
    ) {
      console.warn(
        "Unauthorized request"
      );
    }

    return Promise.reject(error);
  }
);

export default api;
