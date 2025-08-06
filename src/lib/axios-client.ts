import axios from "axios";

// For Next.js API routes, we use relative URLs since they're on the same domain
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
