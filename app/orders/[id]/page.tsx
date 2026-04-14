import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true } },
      _count: { select: { offers: true } },
    },
  });

  if (!order || order.status === "CANCELLED") notFound();

  // Si es el comprador dueño del pedido, redirigir al detalle del buyer
  if (session?.user.id === order.buyerId) {
    redirect(`/dashboard/buyer/orders/${id}`);
  }

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return `hace ${Math.floor(diff / 86400)} días`;
  };

  const isOpen = order.status === "OPEN";

  return (
    <>
      <Header />

      <main className="flex-1 bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400">
            <Link href="/orders" className="hover:text-green-600 transition-colors">
              Pedidos
            </Link>
            {" / "}
            <span className="text-gray-700 font-medium">{order.title}</span>
          </div>

          {/* Card principal */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            {/* Status + título */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {order.title}
              </h1>
              <span
                className={`shrink-0 text-sm font-medium px-3 py-1 rounded-full ${
                  isOpen
                    ? "bg-green-100 text-green-700"
                    : order.status === "IN_PROGRESS"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {isOpen
                  ? "Abierto"
                  : order.status === "IN_PROGRESS"
                  ? "En curso"
                  : "Completado"}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mb-6">
              {order.category && (
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {order.category}
                </span>
              )}
              {order.deliveryCity && (
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  📍 {order.deliveryCity}
                </span>
              )}
              <span className="text-xs bg-gray-50 text-gray-400 px-3 py-1 rounded-full">
                🕑 {timeAgo(order.createdAt)}
              </span>
              <span className="text-xs bg-gray-50 text-gray-400 px-3 py-1 rounded-full">
                💬 {order._count.offers} oferta{order._count.offers !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Descripción
              </h2>
              <p className="text-gray-700 leading-relaxed">{order.description}</p>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Precio del producto</p>
                <p className="text-2xl font-bold text-gray-900">
                  BOB {order.productPrice.toLocaleString("es-BO")}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-500 mb-1">Tu recompensa</p>
                <p className="text-2xl font-bold text-green-600">
                  BOB {order.reward.toLocaleString("es-BO")}
                </p>
              </div>
            </div>

            {/* URL del producto */}
            {order.productUrl && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Referencia del producto
                </h2>
                <a
                  href={order.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 text-sm hover:underline break-all"
                >
                  {order.productUrl}
                </a>
              </div>
            )}

            {/* Notas */}
            {order.notes && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Notas del comprador
                </h2>
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800">
                  {order.notes}
                </div>
              </div>
            )}

            {/* Publicado por */}
            <div className="border-t border-gray-100 pt-4 text-sm text-gray-400">
              Publicado por{" "}
              <span className="text-gray-600 font-medium">
                {order.buyer.name}
              </span>
            </div>
          </div>

          {/* CTA según estado de sesión */}
          {isOpen && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {!session ? (
                <div className="text-center py-4">
                  <p className="text-gray-700 font-medium mb-2">
                    ¿Podés traer este producto?
                  </p>
                  <p className="text-gray-500 text-sm mb-5">
                    Iniciá sesión como viajero para hacer tu oferta y ganar{" "}
                    <strong className="text-green-600">
                      BOB {order.reward}
                    </strong>
                    .
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/login"
                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/register"
                      className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      Crear cuenta
                    </Link>
                  </div>
                </div>
              ) : session.user.role === "TRAVELER" ? (
                <div className="text-center py-4">
                  <p className="text-gray-700 font-medium mb-4">
                    ¿Podés traer este producto?
                  </p>
                  <Link
                    href="/dashboard/traveler/orders"
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    Ir a mi panel de viajero
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <p>¿También querés hacer un pedido?</p>
                  <Link
                    href="/dashboard/buyer/new-order"
                    className="mt-3 inline-block text-green-600 font-medium hover:underline"
                  >
                    Publicar mi pedido →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
