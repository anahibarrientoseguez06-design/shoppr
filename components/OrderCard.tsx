import Link from "next/link";

export interface Order {
  id: string;
  title: string;
  description: string;
  productPrice: number;
  reward: number;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  category?: string | null;
  deliveryCity?: string | null;
  createdAt: string | Date;
  _count?: { offers: number };
}

const statusLabel: Record<Order["status"], string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const statusColor: Record<Order["status"], string> = {
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

interface OrderCardProps {
  order: Order;
  isLoggedIn?: boolean;
}

export default function OrderCard({ order, isLoggedIn = true }: OrderCardProps) {
  const detailHref = isLoggedIn ? `/orders/${order.id}` : `/login`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
          {order.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${statusColor[order.status]}`}
        >
          {statusLabel[order.status]}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2">{order.description}</p>

      {/* Category & City */}
      {(order.category || order.deliveryCity) && (
        <div className="flex flex-wrap gap-2">
          {order.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {order.category}
            </span>
          )}
          {order.deliveryCity && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              📍 {order.deliveryCity}
            </span>
          )}
        </div>
      )}

      {/* Prices */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-gray-400 text-xs">Precio producto</span>
          <p className="font-semibold text-gray-900">
            Bs. {Number(order.productPrice).toLocaleString("es-BO")}
          </p>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <span className="text-gray-400 text-xs">Recompensa</span>
          <p className="font-semibold text-green-600">
            Bs. {Number(order.reward).toLocaleString("es-BO")}
          </p>
        </div>
        {order._count !== undefined && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-gray-400 text-xs">Ofertas</span>
              <p className="font-semibold text-gray-900">
                {order._count.offers}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleDateString("es-BO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <Link
          href={detailHref}
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          {isLoggedIn ? "Ver detalles →" : "Iniciá sesión →"}
        </Link>
      </div>
    </div>
  );
}
