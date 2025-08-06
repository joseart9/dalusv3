import { NextRequest, NextResponse } from "next/server";
import { login } from "@/server/services/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const response = await login(email, password);

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 400 });
  }

  return NextResponse.json({ data: response.data.token }, { status: 200 });
}
