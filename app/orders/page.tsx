import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderCard from "@/components/OrderCard";
import OrderFilters from "./OrderFilters";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

async function OrdersList({
  category,
  q,
  isLoggedIn,
}: {
  category?: string;
  q?: string;
  isLoggedIn: boolean;
}) {
  const where: Record<string, unknown> = { status: "OPEN" };

  if (category) where.category = category;
  if (q) where.title = { contains: q, mode: "insensitive" };

  const orders = await prisma.order.findMany({
    where,
    include: {
      buyer: { select: { id: true, name: true } },
      _count: { select: { offers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No se encontraron pedidos
        </h3>
        <p className="text-gray-500 mb-6">
          {q || category
            ? "Probá con otros filtros"
            : "Sé el primero en publicar un pedido"}
        </p>
        <Link
          href="/dashboard/buyer/new-order"
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Publicar pedido
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          isLoggedIn={isLoggedIn}
          order={{
            ...order,
            createdAt: order.createdAt.toISOString(),
          }}
        />
      ))}
    </div>
  );
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const [{ category, q }, session, totalOpen] = await Promise.all([
    searchParams,
    getServerSession(authOptions),
    prisma.order.count({ where: { status: "OPEN" } }),
  ]);

  const isLoggedIn = !!session;

  return (
    <>
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Banner viajero */}
        <div className="bg-green-600 text-white text-sm py-2.5 px-4 text-center">
          <span className="text-green-100">¿Sos viajero?</span>{" "}
          <span className="font-medium">Ganá dinero trayendo productos</span>
          {" · "}
          <Link
            href="/register"
            className="underline font-semibold hover:text-green-200 transition-colors"
          >
            Aplicar aquí →
          </Link>
        </div>

        {/* Page header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pedidos disponibles
                </h1>
                <p className="text-gray-500 mt-1">
                  {totalOpen} pedido{totalOpen !== 1 ? "s" : ""} abierto
                  {totalOpen !== 1 ? "s" : ""} esperando un viajero
                </p>
              </div>
              <Link
                href={isLoggedIn ? "/dashboard/buyer/new-order" : "/register"}
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm"
              >
                + Publicar pedido
              </Link>
            </div>

            <Suspense>
              <OrderFilters />
            </Suspense>
          </div>
        </div>

        {/* Orders grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 h-52 animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <OrdersList category={category} q={q} isLoggedIn={isLoggedIn} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
