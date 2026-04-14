import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "TRAVELER") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const body = await req.json();
  const { name, travelHistory } = body;

  // Actualizar nombre si se provee
  if (name && typeof name === "string" && name.trim().length > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });
  }

  // Actualizar o crear el perfil de viajero
  const profile = await prisma.travelerProfile.upsert({
    where: { userId: session.user.id },
    update: {
      travelHistory:
        travelHistory !== undefined ? travelHistory : undefined,
    },
    create: {
      userId: session.user.id,
      travelHistory: travelHistory ?? null,
      isApproved: false,
    },
  });

  return NextResponse.json({ success: true, profile });
}
