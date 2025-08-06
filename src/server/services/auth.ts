"use server";

import db from "@/supabase/db";
import { Role, User } from "@/app/types/users";
import { ServerResponse } from "../types/response";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function getUserByEmail(
  email: string,
  includePassword: boolean = false
): Promise<ServerResponse<Partial<User>>> {
  try {
    const user = await db`SELECT * FROM users WHERE email = ${email}`;
    if (!user || user.length === 0) {
      return { data: {} as User, error: "Usuario no encontrado" };
    }

    const userData: Partial<User> = {
      id: user[0].id,
      email: user[0].email,
      first_name: user[0].first_name,
      last_name: user[0].last_name,
      role: user[0].role,
    };

    if (includePassword) {
      userData.password = user[0].password;
    }

    return { data: userData };
  } catch (error) {
    console.error(error);
    return { data: {} as User, error: "Failed to get user by email" };
  }
}

export async function createUser(
  user: Partial<User>
): Promise<ServerResponse<Partial<User>>> {
  try {
    if (!user.email || !user.password) {
      return {
        data: {} as User,
        error: "Correo electrónico y contraseña son requeridos",
      };
    }

    const existingUser = await getUserByEmail(user.email);
    if (existingUser.data && Object.keys(existingUser.data).length > 0) {
      return { data: {} as User, error: "El usuario ya existe" };
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser =
      await db`INSERT INTO users (email, password, role, first_name, last_name) VALUES (
        ${user.email ?? null},
        ${hashedPassword},
        ${user.role ?? Role.USER},
        ${user.first_name ?? null},
        ${user.last_name ?? null}
      ) RETURNING *`;
    if (!newUser) {
      return {
        data: {} as User,
        error: "Ha ocurrido un error inesperado, contacta al administrador",
      };
    }
    return { data: newUser[0] as User };
  } catch (error) {
    console.error(error);
    return {
      data: {} as User,
      error: "Ha ocurrido un error inesperado, contacta al administrador",
    };
  }
}

export async function updateUser(
  user: Partial<User>
): Promise<ServerResponse<Partial<User>>> {
  try {
    if (!user.id) {
      return {
        data: {} as User,
        error: "El usuario no existe",
      };
    }
    const updatedUser = await db`UPDATE users SET email = ${
      user.email ?? null
    }, password = ${user.password ?? null}, updated_at = now(), role = ${
      user.role ?? Role.USER
    }, first_name = ${user.first_name ?? null}, last_name = ${
      user.last_name ?? null
    } WHERE id = ${user.id ?? null} RETURNING *`;
    if (!updatedUser) {
      return {
        data: {} as User,
        error: "Ha ocurrido un error inesperado, contacta al administrador",
      };
    }
    return { data: updatedUser[0] as User };
  } catch (error) {
    console.error(error);
    return {
      data: {} as User,
      error: "Ha ocurrido un error inesperado, contacta al administrador",
    };
  }
}

export async function deleteUser(id: string): Promise<ServerResponse<User>> {
  try {
    const deletedUser =
      await db`DELETE FROM users WHERE id = ${id} RETURNING *`;
    if (!deletedUser) {
      return {
        data: {} as User,
        error: "Ha ocurrido un error inesperado, contacta al administrador",
      };
    }
    return { data: deletedUser[0] as User };
  } catch (error) {
    console.error(error);
    return {
      data: {} as User,
      error: "Ha ocurrido un error inesperado, contacta al administrador",
    };
  }
}

export async function getUserById(id: string): Promise<ServerResponse<User>> {
  try {
    const user = await db`SELECT * FROM users WHERE id = ${id}`;
    return { data: user[0] as User };
  } catch (error) {
    console.error(error);
    return {
      data: {} as User,
      error: "Ha ocurrido un error inesperado, contacta al administrador",
    };
  }
}

interface LoginResponse {
  user: Partial<User>;
  token: string;
}

export async function login(
  email: string,
  password: string
): Promise<ServerResponse<LoginResponse>> {
  const { data: user, error } = await getUserByEmail(email, true);
  if (error || !user || Object.keys(user).length === 0) {
    return { data: {} as LoginResponse, error: "Usuario no encontrado" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
  if (!isPasswordValid) {
    return { data: {} as LoginResponse, error: "Contraseña incorrecta" };
  }

  // Generate JWT
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return { data: {} as LoginResponse, error: "No JWT secret configured" };
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
    expiresIn: "7d",
  });

  return { data: { user, token } as LoginResponse };
}

export async function getUserByToken(
  token: string
): Promise<ServerResponse<User>> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return { data: {} as User, error: "No JWT secret configured" };
  }
  const decoded = jwt.verify(token, secret) as {
    userId: string;
    email: string;
  };
  const { data: user, error } = await getUserById(decoded.userId);
  return { data: user, error };
}
