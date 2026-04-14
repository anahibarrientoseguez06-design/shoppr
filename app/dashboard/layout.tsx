import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  // Para viajeros: verificar si está aprobado para mostrar el nav correcto
  let travelerApproved = false;
  if (role === "TRAVELER") {
    const profile = await prisma.travelerProfile.findUnique({
      where: { userId: session.user.id },
      select: { isApproved: true },
    });
    travelerApproved = profile?.isApproved ?? false;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Dashboard nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Shoppr</span>
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/orders"
                className="text-gray-600 hover:text-green-600 transition-colors hidden sm:block"
              >
                Ver pedidos
              </Link>
              <span className="text-gray-400 text-xs">{session.user.name}</span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Salir
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar — oculto para ADMIN (tiene su propio layout con sidebar) */}
        {role !== "ADMIN" && (
        <aside className="w-48 shrink-0 hidden md:block">
          <nav className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              Mi cuenta
            </p>

            {/* Nav de BUYER */}
            {role === "BUYER" && (
              <>
                <Link
                  href="/dashboard/buyer/my-orders"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  📦 Mis pedidos
                </Link>
                <Link
                  href="/dashboard/buyer/new-order"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  ➕ Nuevo pedido
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  🌐 Explorar
                </Link>
              </>
            )}

            {/* Nav de TRAVELER aprobado */}
            {role === "TRAVELER" && travelerApproved && (
              <>
                <Link
                  href="/dashboard/traveler"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  🏠 Mi panel
                </Link>
                <Link
                  href="/dashboard/traveler/orders"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  🌎 Pedidos disponibles
                </Link>
                <Link
                  href="/dashboard/traveler/my-offers"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  📋 Mis ofertas
                </Link>
                <Link
                  href="/dashboard/traveler/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  👤 Mi perfil
                </Link>
              </>
            )}

            {/* Nav de TRAVELER no aprobado */}
            {role === "TRAVELER" && !travelerApproved && (
              <p className="px-3 py-2 text-xs text-gray-400">
                Cuenta pendiente de aprobación
              </p>
            )}

            {/* Nav de ADMIN */}
            {role === "ADMIN" && (
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                ⚙️ Administración
              </Link>
            )}

            {/* Cerrar sesión (todos los roles) */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                🚪 Cerrar sesión
              </Link>
            </div>
          </nav>
        </aside>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
