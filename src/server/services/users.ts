"use server";

import db from "@/supabase/db";
import { User } from "@/app/types/users";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getUsers(
  query?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Partial<User>>> {
  try {
    const safePageSize = Math.max(1, Math.min(pageSize, 20));
    let response;
    let total;
    const offset = (page - 1) * safePageSize;

    if (query && query.trim() !== "") {
      response = await db`
        SELECT * FROM users 
        WHERE (first_name ILIKE '%' || ${query} || '%' 
          OR last_name ILIKE '%' || ${query} || '%' 
          OR email ILIKE '%' || ${query} || '%')
        ORDER BY created_at DESC 
        LIMIT ${safePageSize} OFFSET ${offset}
      `;
      const totalRes = await db`
        SELECT COUNT(*) FROM users 
        WHERE (first_name ILIKE '%' || ${query} || '%' 
          OR last_name ILIKE '%' || ${query} || '%' 
          OR email ILIKE '%' || ${query} || '%')
      `;
      total = Number(totalRes[0]?.count ?? 0);
    } else {
      response = await db`
        SELECT * FROM users 
        ORDER BY created_at DESC 
        LIMIT ${safePageSize} OFFSET ${offset}
      `;
      const totalRes = await db`SELECT COUNT(*) FROM users`;
      total = Number(totalRes[0]?.count ?? 0);
    }

    const users = response.map((user) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    return {
      data: users,
      total,
      page,
      pageSize: safePageSize,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      total: 0,
      page,
      pageSize: Math.max(1, Math.min(pageSize, 50)),
    };
  }
}
