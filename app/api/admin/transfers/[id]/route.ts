import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { sendEmail, emailTransferConfirmed } from "@/app/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      buyer: { select: { email: true, name: true } },
      offers: {
        where: { status: "ACCEPTED" },
        take: 1,
        include: { traveler: { select: { email: true, name: true } } },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  if (order.status !== "IN_PROGRESS") {
    return NextResponse.json(
      { error: "Solo se pueden confirmar pedidos en estado IN_PROGRESS" },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: "COMPLETED" },
  });

  // Notificar al comprador y al viajero
  const buyerEmail = emailTransferConfirmed(order.title, "buyer");
  const travelerEmail = emailTransferConfirmed(order.title, "traveler");

  const emailPromises = [
    sendEmail({ to: order.buyer.email, subject: buyerEmail.subject, html: buyerEmail.html }),
  ];

  const acceptedOffer = order.offers[0];
  if (acceptedOffer?.traveler) {
    emailPromises.push(
      sendEmail({
        to: acceptedOffer.traveler.email,
        subject: travelerEmail.subject,
        html: travelerEmail.html,
      })
    );
  }

  Promise.all(emailPromises).catch(console.error);

  return NextResponse.json({ success: true, order: updated });
}
