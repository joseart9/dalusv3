"use server";
import db from "@/supabase/db";
import { Group } from "@/app/types/group";

export async function getGroups(): Promise<Group[]> {
  try {
    const response = await db`SELECT * FROM groups`;
    const groups = response.map((group) => ({
      id: group.id,
      group_id: group.group_id,
      name: group.name,
      date: group.date,
      created_at: group.created_at,
      updated_at: group.updated_at,
    }));

    return groups;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get groups");
  }
}

export async function createGroup(
  group: Partial<Group>
): Promise<{ data?: Partial<Group>; error?: string }> {
  try {
    const response =
      await db`INSERT INTO groups (group_id, name, date) VALUES (${
        group.group_id ?? ""
      }, ${group.name ?? ""}, ${group.date ?? ""}) RETURNING *`;
    const createdGroup = response[0];
    return { data: createdGroup };
  } catch (error) {
    console.error(error);
    return {
      data: {},
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
    };
  }
}

export async function updateGroup(
  group: Partial<Group>
): Promise<{ data?: Partial<Group>; error?: string }> {
  try {
    if (!group.id) {
      return { data: {}, error: "El ID del grupo es requerido." };
    }
    const response =
      await db`UPDATE groups SET updated_at = now(), group_id = ${
        group.group_id ?? ""
      }, name = ${group.name ?? ""}, date = ${group.date ?? ""} WHERE id = ${
        group.id
      } RETURNING *`;
    const updatedGroup = response[0];
    return { data: updatedGroup };
  } catch (error) {
    console.error(error);
    return {
      data: {},
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
    };
  }
}
