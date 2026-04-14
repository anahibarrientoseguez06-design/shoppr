import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, role } = body;

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: "Nombre, email y contraseña son requeridos." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 6 caracteres." },
      { status: 400 }
    );
  }

  const validRoles = ["BUYER", "TRAVELER"];
  const userRole = validRoles.includes(role) ? role : "BUYER";

  // Verificar si el email ya existe
  const existing = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Ya existe una cuenta con ese email." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: userRole,
      // Si es viajero, crear perfil pendiente de aprobación
      travelerProfile:
        userRole === "TRAVELER"
          ? { create: { isApproved: false } }
          : undefined,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(
    { success: true, user },
    { status: 201 }
  );
}
