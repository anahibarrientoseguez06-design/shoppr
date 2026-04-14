import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import AcceptOfferButton from "./AcceptOfferButton";

const statusLabel: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const statusColor: Record<string, string> = {
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

const offerStatusColor: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

const offerStatusLabel: Record<string, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true } },
      offers: {
        include: {
          traveler: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) notFound();

  // Solo el dueño del pedido o ADMIN puede ver esta página
  if (order.buyerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const canAcceptOffers = order.status === "OPEN";

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/buyer/my-orders" className="hover:text-green-600">
          Mis pedidos
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{order.title}</span>
      </div>

      {/* Order card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900 flex-1">{order.title}</h1>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColor[order.status]}`}>
            {statusLabel[order.status]}
          </span>
        </div>

        <p className="text-gray-600 mt-3 text-sm leading-relaxed">{order.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Precio producto</p>
            <p className="font-semibold text-gray-900 mt-0.5">
              Bs. {Number(order.productPrice).toLocaleString("es-BO")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Recompensa</p>
            <p className="font-semibold text-green-600 mt-0.5">
              Bs. {Number(order.reward).toLocaleString("es-BO")}
            </p>
          </div>
          {order.category && (
            <div>
              <p className="text-xs text-gray-400">Categoría</p>
              <p className="font-semibold text-gray-900 mt-0.5">{order.category}</p>
            </div>
          )}
          {order.deliveryCity && (
            <div>
              <p className="text-xs text-gray-400">Ciudad de entrega</p>
              <p className="font-semibold text-gray-900 mt-0.5">{order.deliveryCity}</p>
            </div>
          )}
        </div>

        {order.productUrl && (
          <div className="mt-4">
            <a
              href={order.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              Ver producto en tienda →
            </a>
          </div>
        )}

        {order.notes && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Notas para el viajero</p>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Offers */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Ofertas recibidas ({order.offers.length})
        </h2>

        {order.offers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-gray-500">
              Aún no hay ofertas. Los viajeros interesados aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {order.offers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white rounded-xl border p-5 ${offer.status === "ACCEPTED" ? "border-green-300" : "border-gray-200"}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                        {offer.traveler.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {offer.traveler.name}
                        </p>
                        <p className="text-xs text-gray-400">{offer.traveler.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Recompensa propuesta</p>
                      <p className="font-bold text-green-600">
                        Bs. {Number(offer.proposedReward).toLocaleString("es-BO")}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${offerStatusColor[offer.status]}`}>
                      {offerStatusLabel[offer.status]}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {offer.message}
                </p>

                {canAcceptOffers && offer.status === "PENDING" && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <AcceptOfferButton offerId={offer.id} />
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(offer.createdAt).toLocaleDateString("es-BO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
