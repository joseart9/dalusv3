"use server";
import db from "@/supabase/db";
import { Welder } from "@/app/types/welder";
import { ServerResponse } from "../types/response";
import { CertificationType } from "@/app/types/certification";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getWelders(
  query?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Partial<Welder>>> {
  try {
    const safePageSize = Math.max(1, Math.min(pageSize, 20));
    let response;
    let total;
    const offset = (page - 1) * safePageSize;
    if (query && query.trim() !== "") {
      response =
        await db`SELECT * FROM welders WHERE (first_name ILIKE '%' || ${query} || '%' OR middle_name ILIKE '%' || ${query} || '%' OR paternal_last_name ILIKE '%' || ${query} || '%' OR maternal_last_name ILIKE '%' || ${query} || '%' OR email ILIKE '%' || ${query} || '%') AND is_deleted = false ORDER BY created_at DESC LIMIT ${safePageSize} OFFSET ${offset}`;
      const totalRes =
        await db`SELECT COUNT(*) FROM welders WHERE (first_name ILIKE '%' || ${query} || '%' OR middle_name ILIKE '%' || ${query} || '%' OR paternal_last_name ILIKE '%' || ${query} || '%' OR maternal_last_name ILIKE '%' || ${query} || '%' OR email ILIKE '%' || ${query} || '%') AND is_deleted = false`;
      total = Number(totalRes[0]?.count ?? 0);
    } else {
      response =
        await db`SELECT * FROM welders WHERE is_deleted = false ORDER BY created_at DESC LIMIT ${safePageSize} OFFSET ${offset}`;
      const totalRes =
        await db`SELECT COUNT(*) FROM welders WHERE is_deleted = false`;
      total = Number(totalRes[0]?.count ?? 0);
    }
    return {
      data: response,
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

export async function getWelder(
  id: string
): Promise<ServerResponse<Partial<Welder>>> {
  try {
    const response = await db`
    SELECT * FROM welders WHERE id = ${id} LIMIT 1
    `;
    if (!response[0]) {
      return {
        error: "Error al obtener el soldador",
        data: {},
      };
    }
    const welder = response[0];
    // Address
    const addressArr =
      await db`SELECT * FROM address WHERE welder_id = ${String(
        welder.id
      )} LIMIT 1`;
    const address = addressArr[0]
      ? {
          id: addressArr[0].id,
          street: addressArr[0].street,
          number: addressArr[0].number,
          city: addressArr[0].city,
          state: addressArr[0].state,
          country: addressArr[0].country,
          zip_code: addressArr[0].zip_code,
          created_at: addressArr[0].created_at,
          updated_at: addressArr[0].updated_at,
        }
      : undefined;
    // Groups
    const groupsRaw =
      await db`SELECT g.* FROM "welder-groups" wg JOIN groups g ON wg.group_id = g.id WHERE wg.welder_id = ${String(
        welder.id
      )}`;
    const groups = groupsRaw.map((g: Record<string, unknown>) => ({
      id: g.id as string,
      group_id: g.group_id as string,
      name: g.name as string,
      date: g.date as string,
      created_at: g.created_at as string,
      updated_at: g.updated_at as string,
    }));
    // Certifications
    const certificationsRaw =
      await db`SELECT * FROM certification WHERE welder_id = ${String(
        welder.id
      )}`;
    // For each certification, fetch endorsements and primitive details
    const certifications = await Promise.all(
      certificationsRaw.map(async (cert: Record<string, unknown>) => {
        const certEndorsementsRaw =
          await db`SELECT * FROM endorsement WHERE certification_id = ${String(
            cert.id
          )}`;
        const endorsements = certEndorsementsRaw.map(
          (e: Record<string, unknown>) => ({
            id: e.id as string,
            name: e.name as string,
            created_at: e.created_at as string,
            updated_at: e.updated_at as string,
          })
        );
        // Fetch primitive details
        let primitive = {
          id: cert.certification_primitive as string,
          name: "",
          type: "",
          created_at: "",
          updated_at: "",
        };
        if (cert.certification_primitive) {
          const primitiveArr =
            await db`SELECT * FROM certifications WHERE id = ${String(
              cert.certification_primitive
            )}`;
          if (primitiveArr[0]) {
            primitive = {
              id: primitiveArr[0].id,
              name: primitiveArr[0].name,
              type: primitiveArr[0].type,
              created_at: primitiveArr[0].created_at,
              updated_at: primitiveArr[0].updated_at,
            };
          }
        }
        return {
          id: cert.id as string,
          certification_id: cert.certification_id as string,
          type: cert.type as CertificationType,
          certification_primitive: primitive,
          level: cert.level as string,
          start_date: cert.start_date as string,
          end_date: cert.end_date as string,
          endorsements,
          created_at: cert.created_at as string,
          updated_at: cert.updated_at as string,
        };
      })
    );
    // Endorsements (not certification endorsements)
    const endorsementsRaw =
      await db`SELECT * FROM endorsements WHERE welder_id = ${String(
        welder.id
      )}`;
    const endorsements = endorsementsRaw.map((e: Record<string, unknown>) => ({
      id: e.id as string,
      name: e.name as string,
      created_at: e.created_at as string,
      updated_at: e.updated_at as string,
    }));
    return {
      data: {
        ...welder,
        address,
        groups,
        certifications,
        endorsements,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
      data: {},
    };
  }
}

export async function createWelder(
  welder: Partial<Welder>
): Promise<ServerResponse<Welder>> {
  if (!welder.first_name || !welder.email) {
    return {
      error: "El nombre y el correo electrónico son requeridos",
      data: {} as Welder,
    };
  }

  try {
    // 1. Create the welder
    const welderResponse = await db`
      INSERT INTO welders (first_name, middle_name, paternal_last_name, maternal_last_name, email, secondary_email, phone, welder_id, is_active, is_deleted, is_in_waiting_list) VALUES (
        ${welder.first_name ?? ""},
        ${welder.middle_name ?? ""},
        ${welder.paternal_last_name ?? ""},
        ${welder.maternal_last_name ?? ""},
        ${welder.email ?? ""},
        ${welder.secondary_email ?? ""},
        ${welder.phone ?? ""},
        ${welder.welder_id ?? ""},
        ${welder.is_active ?? false},
        ${welder.is_deleted ?? false},
        ${welder.is_in_waiting_list ?? false}
      )
      RETURNING id
    `;
    const welderId = welderResponse[0]?.id;
    if (!welderId) {
      return {
        error: "Error al crear el soldador",
        data: {} as Welder,
      };
    }

    // 2. Create address if provided
    if (welder.address) {
      await db`
        INSERT INTO address (welder_id, street, number, city, state, country, zip_code) VALUES (
          ${welderId},
          ${welder.address?.street ?? ""},
          ${welder.address?.number ?? ""},
          ${welder.address?.city ?? ""},
          ${welder.address?.state ?? ""},
          ${welder.address?.country ?? ""},
          ${welder.address?.zip_code ?? ""}
        )
        RETURNING *
      `;
    }

    // 3. Insert welder-groups
    if (Array.isArray(welder.groups)) {
      for (const group of welder.groups) {
        if (group.id) {
          await db`
            INSERT INTO "welder-groups" (welder_id, group_id) VALUES (
              ${welderId},
              ${group.id}
            )
          `;
        }
      }
    }

    // 4. Insert certifications and their endorsements
    if (Array.isArray(welder.certifications)) {
      for (const cert of welder.certifications) {
        // Insert certification (no timestamps, add welder_id)
        const certResponse = await db`
          INSERT INTO certification (certification_id, type, certification_primitive, level, start_date, end_date, welder_id) VALUES (
            ${cert.certification_id ?? ""},
            ${cert.type ?? ""},
            ${
              cert.certification_primitive &&
              typeof cert.certification_primitive === "object"
                ? cert.certification_primitive.id
                : cert.certification_primitive || ""
            },
            ${cert.level ?? ""},
            ${cert.start_date ?? ""},
            ${cert.end_date ?? ""},
            ${welderId}
          )
          RETURNING id
        `;
        const certificationId = certResponse[0]?.id;
        // Insert certification endorsements
        if (
          certificationId &&
          Array.isArray(
            (cert as unknown as { endorsements?: { name: string }[] })
              .endorsements
          )
        ) {
          for (const end of (
            cert as unknown as { endorsements?: { name: string }[] }
          ).endorsements ?? []) {
            if (end && end.name) {
              await db`
                INSERT INTO endorsement (certification_id, name) VALUES (
                  ${certificationId},
                  ${end.name}
                )
              `;
            }
          }
        }
      }
    }

    // 5. Insert welder endorsements (not certification endorsements)
    if (
      Array.isArray(
        (welder as unknown as { endorsements?: { name: string }[] })
          .endorsements
      )
    ) {
      for (const end of (
        welder as unknown as { endorsements?: { name: string }[] }
      ).endorsements ?? []) {
        if (end && end.name) {
          await db`
            INSERT INTO endorsements (welder_id, name) VALUES (
              ${welderId},
              ${end.name}
            )
          `;
        }
      }
    }

    return {
      data: welderResponse[0] as unknown as Welder,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
      data: {} as Welder,
    };
  }
}

export async function updateWelder(
  welder: Partial<Welder>
): Promise<ServerResponse<Welder>> {
  try {
    if (!welder.id) {
      return {
        error: "El ID del soldador es requerido",
        data: {} as Welder,
      };
    }
    if (!welder.first_name || !welder.email) {
      return {
        error: "El nombre y el correo electrónico son requeridos",
        data: {} as Welder,
      };
    }
    // 1. Update the welder
    const welderResponse = await db`
      UPDATE welders 
      SET 
        first_name = ${welder.first_name ?? ""},
        middle_name = ${welder.middle_name ?? ""},
        paternal_last_name = ${welder.paternal_last_name ?? ""},
        maternal_last_name = ${welder.maternal_last_name ?? ""},
        email = ${welder.email ?? ""},
        secondary_email = ${welder.secondary_email ?? ""},
        phone = ${welder.phone ?? ""},
        welder_id = ${welder.welder_id ?? ""},
        is_active = ${welder.is_active ?? false},
        is_deleted = ${welder.is_deleted ?? false},
        is_in_waiting_list = ${welder.is_in_waiting_list ?? false},
        updated_at = NOW()
      WHERE id = ${welder.id}
      RETURNING *
    `;
    if (!welderResponse[0]) {
      return {
        error: "Error al actualizar el soldador",
        data: {} as Welder,
      };
    }
    // 2. Update or insert address
    const hasAddressData =
      welder.address &&
      (welder.address.street ||
        welder.address.number ||
        welder.address.city ||
        welder.address.state ||
        welder.address.country ||
        welder.address.zip_code);
    if (hasAddressData) {
      const existingAddress = await db`
        SELECT * FROM address WHERE welder_id = ${welder.id} LIMIT 1
      `;
      if (existingAddress[0]) {
        await db`
          UPDATE address 
          SET 
            street = ${welder.address?.street ?? ""},
            number = ${welder.address?.number ?? ""},
            city = ${welder.address?.city ?? ""},
            state = ${welder.address?.state ?? ""},
            country = ${welder.address?.country ?? ""},
            zip_code = ${welder.address?.zip_code ?? ""},
            updated_at = NOW()
          WHERE welder_id = ${welder.id}
          RETURNING *
        `;
      } else {
        await db`
          INSERT INTO address (welder_id, street, number, city, state, country, zip_code) VALUES (
            ${welder.id},
            ${welder.address?.street ?? ""},
            ${welder.address?.number ?? ""},
            ${welder.address?.city ?? ""},
            ${welder.address?.state ?? ""},
            ${welder.address?.country ?? ""},
            ${welder.address?.zip_code ?? ""}
          )
          RETURNING *
        `;
      }
    }
    // 3. Update welder-groups: delete all and re-insert
    await db`DELETE FROM "welder-groups" WHERE welder_id = ${welder.id}`;
    if (Array.isArray(welder.groups)) {
      for (const group of welder.groups) {
        if (group.id) {
          await db`
            INSERT INTO "welder-groups" (welder_id, group_id) VALUES (
              ${welder.id},
              ${group.id}
            )
          `;
        }
      }
    }
    // 4. Update certifications: delete all and re-insert
    const certs =
      await db`SELECT id FROM certification WHERE welder_id = ${welder.id}`;
    const certIds = certs.map((c: Record<string, unknown>) => c.id as string);
    if (certIds.length > 0) {
      await db`DELETE FROM endorsement WHERE certification_id = ANY(${certIds})`;
      await db`DELETE FROM certification WHERE welder_id = ${welder.id}`;
    }
    if (Array.isArray(welder.certifications)) {
      for (const cert of welder.certifications) {
        const certResponse = await db`
          INSERT INTO certification (certification_id, type, certification_primitive, level, start_date, end_date, welder_id) VALUES (
            ${cert.certification_id ?? ""},
            ${cert.type ?? ""},
            ${
              cert.certification_primitive &&
              typeof cert.certification_primitive === "object"
                ? cert.certification_primitive.id
                : cert.certification_primitive || ""
            },
            ${cert.level ?? ""},
            ${cert.start_date ?? ""},
            ${cert.end_date ?? ""},
            ${welder.id}
          )
          RETURNING id
        `;
        const certificationId = certResponse[0]?.id;
        if (
          certificationId &&
          Array.isArray(
            (cert as unknown as { endorsements?: { name: string }[] })
              .endorsements
          )
        ) {
          for (const end of (
            cert as unknown as { endorsements?: { name: string }[] }
          ).endorsements ?? []) {
            if (end && end.name) {
              await db`
                INSERT INTO endorsement (certification_id, name) VALUES (
                  ${certificationId},
                  ${end.name}
                )
              `;
            }
          }
        }
      }
    }
    // 5. Update endorsements: delete all and re-insert
    await db`DELETE FROM endorsements WHERE welder_id = ${welder.id}`;
    if (
      Array.isArray(
        (welder as unknown as { endorsements?: { name: string }[] })
          .endorsements
      )
    ) {
      for (const end of (
        welder as unknown as { endorsements?: { name: string }[] }
      ).endorsements ?? []) {
        if (end && end.name) {
          await db`
            INSERT INTO endorsements (welder_id, name, updated_at) VALUES (
              ${welder.id},
              ${end.name},
              NOW()
            )
          `;
        }
      }
    }
    return {
      data: welderResponse[0] as unknown as Welder,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
      data: {} as Welder,
    };
  }
}

interface DeleteWelderResponse {
  message: string;
}

export async function deleteWelder(
  id: string
): Promise<ServerResponse<DeleteWelderResponse>> {
  try {
    await db`DELETE FROM welders WHERE id = ${id}`;
    return {
      data: {
        message: "Soldador eliminado correctamente",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
      data: {
        message: "Ha ocurrido un error inesperado, contacta al administrador.",
      },
    };
  }
}
