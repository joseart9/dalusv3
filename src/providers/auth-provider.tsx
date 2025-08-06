"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch("/api/v1/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        return data.data;
      }

      return null;
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  };

  const login = async (token: string) => {
    const validatedUser = await validateToken(token);
    if (validatedUser) {
      localStorage.setItem("auth-token", token);
      setUser(validatedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const validateStoredToken = async () => {
      const token = localStorage.getItem("auth-token");

      if (token) {
        const validatedUser = await validateToken(token);
        if (validatedUser) {
          setUser(validatedUser);
        } else {
          localStorage.removeItem("auth-token");
        }
      }

      setIsLoading(false);
    };

    validateStoredToken();
  }, []);

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
