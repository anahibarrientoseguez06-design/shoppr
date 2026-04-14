import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { sendEmail, emailOfferAccepted } from "@/app/lib/email";

// PATCH /api/offers/[id] — aceptar o rechazar una oferta
// Solo el dueño del pedido puede aceptar/rechazar
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
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Oferta no encontrada" }, { status: 404 });
    }

    if (
      offer.order.buyerId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const { action } = await req.json(); // "accept" | "reject"

    if (action === "accept") {
      await prisma.offer.updateMany({
        where: { orderId: offer.orderId, id: { not: id } },
        data: { status: "REJECTED" },
      });

      const [updatedOffer] = await Promise.all([
        prisma.offer.update({
          where: { id },
          data: { status: "ACCEPTED" },
        }),
        prisma.order.update({
          where: { id: offer.orderId },
          data: { status: "IN_PROGRESS" },
        }),
      ]);

      // Notificar al viajero que su oferta fue aceptada
      const traveler = await prisma.user.findUnique({
        where: { id: offer.travelerId },
        select: { email: true },
      });
      const buyer = await prisma.user.findUnique({
        where: { id: offer.order.buyerId },
        select: { name: true, email: true },
      });

      if (traveler && buyer) {
        const { subject, html } = emailOfferAccepted(
          offer.order.title,
          buyer.name,
          buyer.email
        );
        sendEmail({ to: traveler.email, subject, html }).catch(console.error);
      }

      return NextResponse.json(updatedOffer);
    }

    if (action === "reject") {
      const updatedOffer = await prisma.offer.update({
        where: { id },
        data: { status: "REJECTED" },
      });
      return NextResponse.json(updatedOffer);
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la oferta" },
      { status: 500 }
    );
  }
}
