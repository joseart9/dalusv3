import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export function getAuthenticatedUser(
  request: NextRequest
): AuthenticatedUser | null {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  if (!userId || !userEmail) {
    return null;
  }

  return {
    id: userId,
    email: userEmail,
  };
}

export function requireAuth(request: NextRequest): AuthenticatedUser {
  const user = getAuthenticatedUser(request);
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
}

// New function to validate JWT token from request headers
export function validateToken(request: NextRequest): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured");
      return null;
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
    };

    return {
      id: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}
