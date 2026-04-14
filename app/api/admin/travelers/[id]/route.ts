import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { action } = body;

  if (action !== "approve" && action !== "revoke") {
    return NextResponse.json(
      { error: 'action debe ser "approve" o "revoke"' },
      { status: 400 }
    );
  }

  // Verificar que el usuario exista y sea TRAVELER
  const user = await prisma.user.findUnique({
    where: { id },
    include: { travelerProfile: true },
  });

  if (!user || user.role !== "TRAVELER") {
    return NextResponse.json(
      { error: "Viajero no encontrado" },
      { status: 404 }
    );
  }

  const isApproved = action === "approve";

  // Upsert del perfil: lo crea si no existe
  const profile = await prisma.travelerProfile.upsert({
    where: { userId: id },
    update: { isApproved },
    create: { userId: id, isApproved },
  });

  return NextResponse.json({ success: true, profile });
}
