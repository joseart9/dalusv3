import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/server/services/auth";

export async function POST(request: NextRequest) {
  const { email, password, first_name, last_name, role } = await request.json();
  const { data, error } = await createUser({
    email,
    password,
    first_name,
    last_name,
    role,
  });
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
