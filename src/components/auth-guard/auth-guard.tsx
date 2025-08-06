"use client";

import { useAuth } from "@/providers/auth-provider";
import { Loading } from "../loading";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Loading />;
  }

  return <>{children}</>;
};
