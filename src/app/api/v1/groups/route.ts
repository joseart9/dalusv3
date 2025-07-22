"use server";

import { NextRequest, NextResponse } from "next/server";
import { createGroup, updateGroup, getGroups } from "@/server/services/groups";

export async function POST(request: NextRequest) {
  const group = await request.json();
  const { error, data } = await createGroup(group);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const group = await request.json();
  const { error, data } = await updateGroup(group);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function GET() {
  const groups = await getGroups();
  return NextResponse.json({ data: groups }, { status: 200 });
}
