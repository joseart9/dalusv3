"use server";

import { NextRequest, NextResponse } from "next/server";
import {
  createWelder,
  updateWelder,
  deleteWelder,
} from "@/server/services/welders";
import { Welder } from "@/app/types/welder";

export async function POST(request: NextRequest) {
  const welder: Partial<Welder> = await request.json();
  const { error, data } = await createWelder(welder);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const welder: Partial<Welder> = await request.json();
  const { error, data } = await updateWelder(welder);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const welder: Partial<Welder> = await request.json();
  if (!welder.id) {
    return NextResponse.json(
      { data: {}, error: "ID is required" },
      { status: 400 }
    );
  }
  const { error, data } = await deleteWelder(welder.id);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
