import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/server/services/auth";
import { validateToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const user = validateToken(request);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, password, first_name, last_name, role } = await request.json();
  const { error } = await createUser({
    email,
    password,
    first_name,
    last_name,
    role,
  });
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  return NextResponse.json({ data: {} }, { status: 201 });
}
