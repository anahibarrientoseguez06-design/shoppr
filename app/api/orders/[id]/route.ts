import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// GET /api/orders/[id] — pedido con sus ofertas y datos del viajero
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        offers: {
          include: {
            traveler: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { offers: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el pedido" },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] — el dueño actualiza el status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    if (order.buyerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const { status } = await req.json();
    const validStatuses = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el pedido" },
      { status: 500 }
    );
  }
}
