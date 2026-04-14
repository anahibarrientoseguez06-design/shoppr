import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

type OfferStatus = "ACCEPTED" | "PENDING" | "REJECTED";

const STATUS_LABEL: Record<OfferStatus, string> = {
  ACCEPTED: "Aceptada ✓",
  PENDING: "En espera",
  REJECTED: "Rechazada",
};

const STATUS_CLASS: Record<OfferStatus, string> = {
  ACCEPTED: "bg-green-100 text-green-700",
  PENDING: "bg-gray-100 text-gray-600",
  REJECTED: "bg-red-100 text-red-600",
};

export default async function MyOffersPage() {
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

  const offers = await prisma.offer.findMany({
    where: { travelerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: {
          buyer: { select: { name: true, email: true } },
        },
      },
    },
  });

  // Agrupar: ACCEPTED primero, luego PENDING, luego REJECTED
  const statusOrder: OfferStatus[] = ["ACCEPTED", "PENDING", "REJECTED"];
  const grouped = statusOrder.map((status) => ({
    status,
    offers: offers.filter((o) => o.status === status),
  }));

  const total = offers.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis ofertas</h1>
        <p className="text-gray-500 mt-1">
          {total} oferta{total !== 1 ? "s" : ""} enviada
          {total !== 1 ? "s" : ""}
        </p>
      </div>

      {total === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-gray-600">
            Aún no enviaste ninguna oferta.
          </p>
          <Link
            href="/dashboard/traveler/orders"
            className="mt-4 inline-block text-sm text-green-600 hover:underline"
          >
            Explorá los pedidos disponibles →
          </Link>
        </div>
      ) : (
        grouped.map(({ status, offers: groupOffers }) => {
          if (groupOffers.length === 0) return null;
          return (
            <div key={status}>
              <h2 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_CLASS[status]}`}
                >
                  {STATUS_LABEL[status]}
                </span>
                <span className="text-sm text-gray-400">
                  {groupOffers.length}
                </span>
              </h2>

              <div className="space-y-4">
                {groupOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
                  >
                    {/* Título del pedido + estado */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-gray-900">
                        {offer.order.title}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${STATUS_CLASS[status]}`}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </div>

                    {/* Detalles de la oferta */}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>
                        Recompensa propuesta:{" "}
                        <strong className="text-green-600">
                          BOB {offer.proposedReward}
                        </strong>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>
                        Precio del pedido:{" "}
                        <strong className="text-gray-700">
                          BOB {offer.order.productPrice}
                        </strong>
                      </span>
                    </div>

                    {/* Mensaje enviado */}
                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                      <p className="text-xs text-gray-400 mb-1">
                        Tu mensaje:
                      </p>
                      <p className="text-sm text-gray-700">{offer.message}</p>
                    </div>

                    {/* Datos del comprador si fue aceptada */}
                    {status === "ACCEPTED" && (
                      <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                        <p className="text-xs font-semibold text-green-700 mb-2">
                          Coordiná la entrega con el comprador
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Nombre:</strong> {offer.order.buyer.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Email:</strong>{" "}
                          <a
                            href={`mailto:${offer.order.buyer.email}`}
                            className="text-green-600 hover:underline"
                          >
                            {offer.order.buyer.email}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
