import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api/auth", 
});

// Request interceptor to add JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor to catch 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized – maybe redirect to login?");
      // Optional: redirect or logout logic
    }
    return Promise.reject(error);
  }
);

export const register = (userData) => API.post("/register", userData);
export const login = (data) => API.post("/login", data);
