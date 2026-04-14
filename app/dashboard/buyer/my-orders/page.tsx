import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

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

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "BUYER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: { _count: { select: { offers: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {orders.length} pedido{orders.length !== 1 ? "s" : ""} publicado{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/buyer/new-order"
          className="bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
        >
          + Nuevo pedido
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Todavía no tenés pedidos
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Publicá tu primer pedido y recibí ofertas de viajeros en minutos.
          </p>
          <Link
            href="/dashboard/buyer/new-order"
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            Crear mi primer pedido
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {order.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColor[order.status]}`}
                    >
                      {statusLabel[order.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="text-gray-500">
                      <span className="text-gray-400 text-xs">Precio</span>
                      <br />
                      <span className="font-medium text-gray-900">
                        Bs. {Number(order.productPrice).toLocaleString("es-BO")}
                      </span>
                    </span>
                    <span className="text-gray-500">
                      <span className="text-gray-400 text-xs">Recompensa</span>
                      <br />
                      <span className="font-medium text-green-600">
                        Bs. {Number(order.reward).toLocaleString("es-BO")}
                      </span>
                    </span>
                    <span className="text-gray-500">
                      <span className="text-gray-400 text-xs">Ofertas</span>
                      <br />
                      <span className="font-medium text-gray-900">
                        {order._count.offers}
                      </span>
                    </span>
                    <span className="text-gray-500">
                      <span className="text-gray-400 text-xs">Publicado</span>
                      <br />
                      <span className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("es-BO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {order._count.offers > 0 && (
                    <Link
                      href={`/dashboard/buyer/orders/${order.id}`}
                      className="text-sm font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Ver {order._count.offers} oferta{order._count.offers !== 1 ? "s" : ""}
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/buyer/orders/${order.id}`}
                    className="text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
