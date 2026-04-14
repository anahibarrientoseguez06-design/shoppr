import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">Shoppr</span>
            </div>
            <p className="text-sm leading-relaxed">
              El marketplace boliviano que conecta compradores con viajeros
              internacionales. Comprá lo que querás del exterior con confianza.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orders" className="hover:text-green-400 transition-colors">
                  Ver pedidos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400 transition-colors">
                  Ser viajero
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="hover:text-green-400 transition-colors">
                  Cómo funciona
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-green-400 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400 transition-colors">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400 transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} Shoppr. Hecho con ❤️ en Bolivia.
        </div>
      </div>
    </footer>
  );
}
