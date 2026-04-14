import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const [
    totalUsers,
    buyerCount,
    travelerCount,
    pendingTravelersCount,
    totalOffers,
    orderStatusGroups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.user.count({ where: { role: "TRAVELER" } }),
    prisma.travelerProfile.count({ where: { isApproved: false } }),
    prisma.offer.count(),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const ordersByStatus = Object.fromEntries(
    orderStatusGroups.map(({ status, _count }) => [status, _count._all])
  ) as Record<string, number>;

  const totalOrders = Object.values(ordersByStatus).reduce(
    (sum, n) => sum + n,
    0
  );

  const statuses = [
    { key: "OPEN", label: "Abiertos", color: "text-green-600" },
    { key: "IN_PROGRESS", label: "En curso", color: "text-amber-600" },
    { key: "COMPLETED", label: "Completados", color: "text-blue-600" },
    { key: "CANCELLED", label: "Cancelados", color: "text-red-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
        <p className="text-gray-500 mt-1">
          Hola, {session.user.name} — datos en tiempo real desde Supabase
        </p>
      </div>

      {/* Alertas */}
      {pendingTravelersCount > 0 && (
        <Link
          href="/dashboard/admin/travelers"
          className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 hover:bg-red-100 transition-colors"
        >
          <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            {pendingTravelersCount}
          </span>
          <span className="text-sm text-red-700 font-medium">
            {pendingTravelersCount === 1
              ? "1 viajero pendiente de aprobación"
              : `${pendingTravelersCount} viajeros pendientes de aprobación`}
          </span>
          <span className="ml-auto text-red-400 text-sm">Revisar →</span>
        </Link>
      )}

      {/* Grid de métricas — Usuarios */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Usuarios
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Total registrados</p>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Compradores</p>
            <p className="text-3xl font-bold text-green-600">{buyerCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Viajeros</p>
            <p className="text-3xl font-bold text-blue-600">{travelerCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Viajeros pendientes</p>
            <p
              className={`text-3xl font-bold ${
                pendingTravelersCount > 0 ? "text-red-500" : "text-gray-400"
              }`}
            >
              {pendingTravelersCount}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de métricas — Pedidos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Pedidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Total pedidos</p>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
          </div>
          {statuses.map(({ key, label, color }) => (
            <div key={key} className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>
                {ordersByStatus[key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ofertas */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Ofertas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Total ofertas enviadas</p>
            <p className="text-3xl font-bold text-green-600">{totalOffers}</p>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/admin/travelers", label: "Gestionar viajeros", icon: "✈️" },
            { href: "/dashboard/admin/orders", label: "Ver pedidos", icon: "📦" },
            { href: "/dashboard/admin/users", label: "Ver usuarios", icon: "👥" },
            { href: "/dashboard/admin/transfers", label: "Transferencias", icon: "💳" },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:border-green-200 hover:bg-green-50 transition-colors"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
