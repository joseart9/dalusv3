"use server";

import { NextRequest, NextResponse } from "next/server";
import { createWeldersRaw } from "@/server/services/welders";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle both formats: direct array or { welders: [...] }
    let welders;
    if (Array.isArray(body)) {
      welders = body;
    } else if (body.welders && Array.isArray(body.welders)) {
      welders = body.welders;
    } else {
      return NextResponse.json(
        {
          error:
            "El cuerpo de la petición debe ser un array de soldadores o un objeto con propiedad 'welders' que contenga un array",
        },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];
    const skipped = [];

    // Process welders in batches to avoid overwhelming the database
    const batchSize = 50; // Process 50 welders at a time
    for (let i = 0; i < welders.length; i += batchSize) {
      const batch = welders.slice(i, i + batchSize);

      // Process each welder in the batch
      for (const welder of batch) {
        try {
          const response = await createWeldersRaw(welder);
          if (response.error) {
            // Check if it's a duplicate welder error
            if (response.error.includes("ya está registrado")) {
              skipped.push({
                welder: welder.first_name || "Unknown",
                welder_id: welder.welder_id || "N/A",
                reason: "Ya registrado en la base de datos",
              });
            } else {
              errors.push({
                welder: welder.first_name || "Unknown",
                welder_id: welder.welder_id || "N/A",
                error: response.error,
              });
            }
          } else {
            results.push({
              welder: welder.first_name || "Unknown",
              welder_id: welder.welder_id || "N/A",
              id: response.data?.id,
            });
          }
        } catch (error) {
          errors.push({
            welder: welder.first_name || "Unknown",
            welder_id: welder.welder_id || "N/A",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: welders.length,
      created: results.length,
      skippedCount: skipped.length,
      errorCount: errors.length,
      results,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("Import welders error:", error);
    return NextResponse.json(
      {
        error: "Error procesando la importación de soldadores",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
