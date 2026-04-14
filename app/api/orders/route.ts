import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// GET /api/orders — pedidos OPEN con datos del comprador
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "OPEN" },
      include: {
        buyer: { select: { id: true, name: true } },
        _count: { select: { offers: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los pedidos" },
      { status: 500 }
    );
  }
}

// POST /api/orders — crear nuevo pedido (requiere BUYER o ADMIN)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "BUYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, productUrl, productPrice, reward, category, deliveryCity, notes } = body;

    if (!title || !description || !productUrl) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: título, descripción, URL del producto" },
        { status: 400 }
      );
    }

    const price = Number(productPrice);
    const rew = Number(reward);

    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "El precio del producto debe ser un número positivo" },
        { status: 400 }
      );
    }

    if (isNaN(rew) || rew <= 0) {
      return NextResponse.json(
        { error: "La recompensa debe ser un número positivo" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        productUrl: productUrl.trim(),
        productPrice: price,
        reward: rew,
        category: category ?? null,
        deliveryCity: deliveryCity ?? null,
        notes: notes?.trim() ?? null,
        status: "OPEN",
        buyerId: session.user.id,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
