import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@/server/services/auth";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 400 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "JWT_SECRET no configurado" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      exp?: number;
    };

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: "Token expirado" }, { status: 401 });
    }

    const { data: user, error } = await getUserByEmail(decoded.email);

    if (error || !user || Object.keys(user).length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      data: user,
      valid: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Token inválido", valid: false },
      { status: 401 }
    );
  }
}
