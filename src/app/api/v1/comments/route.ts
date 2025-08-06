"use server";

import { NextRequest, NextResponse } from "next/server";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "@/server/services/comments";

export async function POST(request: NextRequest) {
  const comment = await request.json();

  const { error, data } = await createComment(comment);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const comment = await request.json();
  const { error, data } = await updateComment(comment);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const { error, data } = await deleteComment(id);

  if (error) {
    return NextResponse.json({ data: {}, error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const welder_id = searchParams.get("welder_id");
  const { error, data } = await getComments(welder_id);
  if (error) {
    return NextResponse.json({ data: [], error }, { status: 400 });
  }
  return NextResponse.json({ data }, { status: 200 });
}
