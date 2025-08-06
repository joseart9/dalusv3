import { useAuth } from "@/providers/auth-provider";

export const useApi = () => {
  const { user, logout } = useAuth();

  const apiCall = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = localStorage.getItem("auth-token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is invalid, logout user
    if (response.status === 401) {
      logout();
    }

    return response;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth-token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return { apiCall, user, getAuthHeaders };
};
