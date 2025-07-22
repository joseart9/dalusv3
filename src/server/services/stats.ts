"use server";
import db from "@/supabase/db";
import { ServerResponse } from "@/server/types/response";
import { Stats } from "@/app/types/stats";

export async function getStats(): Promise<ServerResponse<Stats>> {
  try {
    // Total welders
    const totalWelders =
      await db`SELECT COUNT(*) FROM welders WHERE is_deleted = false`;
    // Active/inactive welders
    const weldersActive =
      await db`SELECT COUNT(*) FROM welders WHERE is_active = true AND is_deleted = false`;
    const weldersInactive =
      await db`SELECT COUNT(*) FROM welders WHERE is_active = false AND is_deleted = false`;

    // AWS, IPC, CUSTOM welders by certifications
    const weldersAws = await db`
      SELECT COUNT(DISTINCT w.id) FROM welders w
      JOIN certification c ON c.welder_id = w.id
      WHERE c.type = 'AWS' AND w.is_deleted = false
    `;
    const weldersIpc = await db`
      SELECT COUNT(DISTINCT w.id) FROM welders w
      JOIN certification c ON c.welder_id = w.id
      WHERE c.type = 'IPC' AND w.is_deleted = false
    `;
    const weldersCustom = await db`
      SELECT COUNT(DISTINCT w.id) FROM welders w
      JOIN certification c ON c.welder_id = w.id
      WHERE c.type = 'CUSTOM' AND w.is_deleted = false
    `;

    return {
      data: {
        total_welders: Number(totalWelders[0].count),
        welders_active: Number(weldersActive[0].count),
        welders_inactive: Number(weldersInactive[0].count),
        welders_aws: Number(weldersAws[0].count),
        welders_ipc: Number(weldersIpc[0].count),
        welders_custom: Number(weldersCustom[0].count),
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Error fetching stats", data: {} as Stats };
  }
}
