import db from "@/supabase/db";

export async function createComment(comment: {
  welder_id: string;
  title: string;
  body: string;
}) {
  try {
    const response = await db`
      INSERT INTO comments (welder_id, title, body) VALUES (
        ${comment.welder_id},
        ${comment.title},
        ${comment.body}
      ) RETURNING *
    `;
    return { data: response[0], error: null };
  } catch (error) {
    return {
      data: {},
      error: (error as Error)?.message || "Error creating comment",
    };
  }
}

export async function updateComment(comment: {
  id: string;
  title: string;
  body: string;
}) {
  try {
    const response = await db`
      UPDATE comments SET title = ${comment.title}, body = ${comment.body}, updated_at = NOW() WHERE id = ${comment.id} RETURNING *
    `;
    return { data: response[0], error: null };
  } catch (error) {
    return {
      data: {},
      error: (error as Error)?.message || "Error updating comment",
    };
  }
}

export async function deleteComment(id: string) {
  try {
    const response = await db`
      DELETE FROM comments WHERE id = ${id} RETURNING *
    `;
    return { data: response[0], error: null };
  } catch (error) {
    return {
      data: {},
      error: (error as Error)?.message || "Error deleting comment",
    };
  }
}

export async function getComments(welder_id?: string | null) {
  try {
    let response;
    if (welder_id) {
      response =
        await db`SELECT * FROM comments WHERE welder_id = ${welder_id} ORDER BY created_at DESC`;
    } else {
      response = await db`SELECT * FROM comments ORDER BY created_at DESC`;
    }
    return { data: response, error: null };
  } catch (error) {
    return {
      data: [],
      error: (error as Error)?.message || "Error fetching comments",
    };
  }
}
