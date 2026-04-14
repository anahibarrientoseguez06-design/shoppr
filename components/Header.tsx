import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Shoppr</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link
              href="/orders"
              className="hover:text-green-600 transition-colors"
            >
              Pedidos
            </Link>
            <Link
              href="/#como-funciona"
              className="hover:text-green-600 transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-green-600 transition-colors"
            >
              Guía completa
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors hidden sm:block"
                >
                  {session.user.name}
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mi panel
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
