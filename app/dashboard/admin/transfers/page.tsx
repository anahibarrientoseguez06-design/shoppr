import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import TransfersList from "./TransfersList";

export default async function AdminTransfersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const orders = await prisma.order.findMany({
    where: { status: "IN_PROGRESS" },
    orderBy: { createdAt: "desc" },
    include: {
      buyer: { select: { name: true, email: true } },
      offers: {
        where: { status: "ACCEPTED" },
        take: 1,
        include: {
          traveler: { select: { name: true, email: true } },
        },
      },
    },
  });

  const transfers = orders.map((order) => {
    const acceptedOffer = order.offers[0] ?? null;
    return {
      id: order.id,
      title: order.title,
      productPrice: order.productPrice,
      buyer: order.buyer,
      traveler: acceptedOffer?.traveler ?? null,
      travelersReward: acceptedOffer?.proposedReward ?? order.reward,
      totalAmount:
        order.productPrice + (acceptedOffer?.proposedReward ?? order.reward),
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transferencias</h1>
        <p className="text-gray-500 mt-1">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} esperando
          confirmación de pago
        </p>
      </div>

      {/* Instrucciones bancarias */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800 space-y-1">
        <p className="font-semibold text-blue-900 mb-2">
          Instrucciones para el cobro
        </p>
        <p>
          Los compradores deben transferir el monto total a la cuenta bancaria
          de Shoppr.
        </p>
        <p>
          <strong>Banco:</strong> Banco Unión &nbsp;·&nbsp;
          <strong>Cuenta:</strong> 1234567890 &nbsp;·&nbsp;
          <strong>Titular:</strong> Just a Shopper SRL
        </p>
        <p className="text-blue-600 mt-2">
          Una vez verificada la transferencia, confirmá el pago aquí para
          liberar el pedido al viajero.
        </p>
      </div>

      <TransfersList transfers={transfers} />
    </div>
  );
}
