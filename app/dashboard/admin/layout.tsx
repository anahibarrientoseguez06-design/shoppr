import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const navLinks = [
    { href: "/dashboard/admin", label: "📊 Resumen" },
    { href: "/dashboard/admin/travelers", label: "✈️ Viajeros" },
    { href: "/dashboard/admin/orders", label: "📦 Pedidos" },
    { href: "/dashboard/admin/users", label: "👥 Usuarios" },
    { href: "/dashboard/admin/transfers", label: "💳 Transferencias" },
  ];

  return (
    <div className="flex gap-6 w-full">
      {/* Sidebar admin */}
      <aside className="w-44 shrink-0 hidden md:block">
        <nav className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Administración
          </p>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              {label}
            </Link>
          ))}
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

      {/* Contenido admin */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
