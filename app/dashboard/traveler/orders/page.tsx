import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import TravelerOrdersList from "./TravelerOrdersList";

export default async function TravelerOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TRAVELER") {
    redirect("/login");
  }

  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.isApproved) {
    redirect("/dashboard");
  }

  // Pedidos OPEN con conteo de ofertas
  const orders = await prisma.order.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { offers: true } } },
  });

  // IDs de pedidos en los que este viajero ya ofertó
  const myOffers = await prisma.offer.findMany({
    where: { travelerId: session.user.id },
    select: { orderId: true },
  });
  const offeredOrderIds = myOffers.map((o) => o.orderId);

  // Serializar fechas para el client component
  const serialized = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Pedidos disponibles
        </h1>
        <p className="text-gray-500 mt-1">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} abierto
          {orders.length !== 1 ? "s" : ""} esperando un viajero
        </p>
      </div>

      <TravelerOrdersList
        orders={serialized}
        offeredOrderIds={offeredOrderIds}
      />
    </div>
  );
}
