"use server";

import db from "@/supabase/db";
import { CertificationPrimitive } from "@/app/types/certification-primitive";
import { ServerResponse } from "../types/response";

export async function getCertifications(): Promise<
  ServerResponse<CertificationPrimitive[]>
> {
  try {
    const response = await db`SELECT * FROM certifications ORDER BY type`;
    const certifications = response.map((certification) => ({
      id: certification.id,
      name: certification.name,
      type: certification.type,
      created_at: certification.created_at,
      updated_at: certification.updated_at,
    }));

    return {
      data: certifications,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
    };
  }
}

export async function createCertification(
  certification: Partial<CertificationPrimitive>
): Promise<ServerResponse<Partial<CertificationPrimitive>>> {
  try {
    const response = await db`INSERT INTO certifications (name, type) VALUES (${
      certification.name ?? ""
    }, ${certification.type ?? ""}) RETURNING *`;
    const createdCertification = response[0];
    return {
      data: createdCertification,
    };
  } catch (error) {
    console.error(error);
    return {
      data: {},
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
    };
  }
}

export async function updateCertification(
  certification: Partial<CertificationPrimitive>
): Promise<ServerResponse<Partial<CertificationPrimitive>>> {
  try {
    if (!certification.id) {
      return {
        data: {},
        error: "El ID de la certificación es requerido.",
      };
    }

    const response =
      await db`UPDATE certifications SET updated_at = now(), name = ${
        certification.name ?? ""
      }, type = ${certification.type ?? ""} WHERE id = ${
        certification.id
      } RETURNING *`;
    const updatedCertification = response[0];
    return {
      data: updatedCertification,
    };
  } catch (error) {
    console.error(error);
    return {
      data: {},
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
    };
  }
}

export async function deleteCertification(
  certification: Partial<CertificationPrimitive>
): Promise<ServerResponse<Partial<CertificationPrimitive>>> {
  try {
    if (!certification.id) {
      return {
        data: {},
        error: "El ID de la certificación es requerido.",
      };
    }

    const response =
      await db`UPDATE certifications SET is_deleted = true, updated_at = now() WHERE id = ${certification.id} RETURNING *`;
    const deletedCertification = response[0];
    return {
      data: deletedCertification,
    };
  } catch (error) {
    console.error(error);
    return {
      data: {},
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
    };
  }
}

export async function getCertificationsByType(
  type: string
): Promise<ServerResponse<CertificationPrimitive[]>> {
  try {
    const response =
      await db`SELECT * FROM certifications WHERE type = ${type}`;
    const certifications = response.map((certification) => ({
      id: certification.id,
      name: certification.name,
      type: certification.type,
      created_at: certification.created_at,
      updated_at: certification.updated_at,
    }));
    return {
      data: certifications,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      error: "Ha ocurrido un error inesperado, contacta al administrador.",
    };
  }
}
