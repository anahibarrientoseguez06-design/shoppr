import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { sendEmail, emailNewOffer } from "@/app/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "TRAVELER") {
    return NextResponse.json(
      { error: "Solo los viajeros pueden hacer ofertas" },
      { status: 403 }
    );
  }

  // Verificar que el viajero esté aprobado
  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.isApproved) {
    return NextResponse.json(
      { error: "Tu cuenta de viajero no está aprobada aún" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { orderId, proposedReward, message } = body;

  if (!orderId || proposedReward === undefined || proposedReward === null || !message) {
    return NextResponse.json(
      { error: "Campos requeridos: orderId, proposedReward, message" },
      { status: 400 }
    );
  }

  if (typeof proposedReward !== "number" || proposedReward <= 0) {
    return NextResponse.json(
      { error: "proposedReward debe ser un número positivo en BOB" },
      { status: 400 }
    );
  }

  if (typeof message !== "string" || message.trim().length < 20) {
    return NextResponse.json(
      { error: "El mensaje debe tener al menos 20 caracteres" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { buyer: { select: { email: true, name: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  if (order.status !== "OPEN") {
    return NextResponse.json(
      { error: "El pedido ya no está disponible para ofertas" },
      { status: 400 }
    );
  }

  const existing = await prisma.offer.findFirst({
    where: { orderId, travelerId: session.user.id },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Ya enviaste una oferta en este pedido" },
      { status: 409 }
    );
  }

  const offer = await prisma.offer.create({
    data: {
      orderId,
      travelerId: session.user.id,
      proposedReward,
      message: message.trim(),
      status: "PENDING",
    },
  });

  // Notificar al comprador por email (sin bloquear la respuesta)
  const { subject, html } = emailNewOffer(order.title, session.user.name ?? "Un viajero");
  sendEmail({ to: order.buyer.email, subject, html }).catch(console.error);

  return NextResponse.json(offer, { status: 201 });
}
