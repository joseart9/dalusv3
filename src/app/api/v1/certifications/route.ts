"use server";

import { NextRequest, NextResponse } from "next/server";
import {
  createCertification,
  updateCertification,
  getCertificationsByType,
} from "@/server/services/certifications";

export async function POST(request: NextRequest) {
  const certification = await request.json();
  const { error, data } = await createCertification(certification);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const certification = await request.json();
  const { error, data } = await updateCertification(certification);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  if (!type) {
    return NextResponse.json(
      { data: {}, error: "Tipo de certificación requerido" },
      { status: 400 }
    );
  }
  const { error, data } = await getCertificationsByType(type);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
