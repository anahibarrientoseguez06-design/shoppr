import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function TravelerDashboardPage() {
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

  const [totalOffers, acceptedOffers, recentOrders, recentOffers] =
    await Promise.all([
      prisma.offer.count({ where: { travelerId: session.user.id } }),
      prisma.offer.count({
        where: { travelerId: session.user.id, status: "ACCEPTED" },
      }),
      prisma.order.findMany({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          _count: { select: { offers: true } },
        },
      }),
      prisma.offer.findMany({
        where: { travelerId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { order: { select: { title: true } } },
      }),
    ]);

  const acceptedOffersData = await prisma.offer.findMany({
    where: { travelerId: session.user.id, status: "ACCEPTED" },
    select: { proposedReward: true },
  });
  const estimatedEarnings = acceptedOffersData.reduce(
    (sum, o) => sum + o.proposedReward,
    0
  );

  const statusLabel = (status: string) => {
    if (status === "ACCEPTED") return "Aceptada ✓";
    if (status === "REJECTED") return "Rechazada";
    return "En espera";
  };

  const statusClass = (status: string) => {
    if (status === "ACCEPTED") return "bg-green-100 text-green-700";
    if (status === "REJECTED") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {session.user.name}
        </h1>
        <p className="text-gray-500 mt-1">Panel de viajero</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Ofertas enviadas</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalOffers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Ofertas aceptadas</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {acceptedOffers}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Ganancias estimadas</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            BOB {estimatedEarnings.toFixed(0)}
          </p>
        </div>
      </div>

      {/* CTA principal */}
      <Link
        href="/dashboard/traveler/orders"
        className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
      >
        🌎 Explorar pedidos disponibles
      </Link>

      {/* Últimos pedidos disponibles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">
            Últimos pedidos disponibles
          </h2>
          <Link
            href="/dashboard/traveler/orders"
            className="text-sm text-green-600 hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No hay pedidos disponibles por ahora.
            </p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {order.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.category && (
                      <span className="mr-2">{order.category}</span>
                    )}
                    {order.deliveryCity && (
                      <span>📍 {order.deliveryCity}</span>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-green-600 font-bold text-sm">
                    BOB {order.reward}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order._count.offers} oferta
                    {order._count.offers !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Últimas ofertas enviadas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Mis últimas ofertas</h2>
          <Link
            href="/dashboard/traveler/my-offers"
            className="text-sm text-green-600 hover:underline"
          >
            Ver todas →
          </Link>
        </div>
        <div className="space-y-3">
          {recentOffers.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Aún no enviaste ninguna oferta.{" "}
              <Link
                href="/dashboard/traveler/orders"
                className="text-green-600 hover:underline"
              >
                Explorá los pedidos disponibles.
              </Link>
            </p>
          ) : (
            recentOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {offer.order.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    BOB {offer.proposedReward} propuesto
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusClass(offer.status)}`}
                >
                  {statusLabel(offer.status)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
