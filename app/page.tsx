import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/app/lib/prisma";

const steps = [
  {
    number: "01",
    icon: "📝",
    title: "Publicá tu pedido",
    description:
      "Decinos qué producto querés, de dónde es, y cuánto estás dispuesto a pagar de recompensa al viajero.",
  },
  {
    number: "02",
    icon: "✈️",
    title: "Recibí ofertas de viajeros",
    description:
      "Viajeros que van al país de origen del producto ven tu pedido y te hacen una oferta para traerlo.",
  },
  {
    number: "03",
    icon: "🤝",
    title: "Elegí tu viajero",
    description:
      "Revisá los perfiles, elegí al viajero de confianza y coordiná la entrega directamente.",
  },
  {
    number: "04",
    icon: "📦",
    title: "Recibí tu producto",
    description:
      "El viajero te entrega el producto en mano. Pagás el precio acordado y liberás la recompensa.",
  },
];

const features = [
  {
    icon: "🔒",
    title: "Pagos protegidos",
    description:
      "Tu dinero está seguro hasta confirmar la entrega. Sin riesgos.",
  },
  {
    icon: "✈️",
    title: "Viajeros verificados",
    description:
      "Todos los viajeros pasan por un proceso de verificación antes de poder ofertar.",
  },
  {
    icon: "💰",
    title: "Ahorrás en importación",
    description:
      "Evitás envíos internacionales costosos y altos aranceles de aduana.",
  },
  {
    icon: "🇧🇴",
    title: "Hecho para Bolivia",
    description:
      "Diseñado para el contexto boliviano. Entregas en las principales ciudades del país.",
  },
  {
    icon: "⚡",
    title: "Rápido y simple",
    description:
      "Publicá tu pedido en minutos. Recibí respuestas rápidas de viajeros con planes concretos.",
  },
  {
    icon: "📱",
    title: "Comunicación directa",
    description:
      "Una vez aceptada la oferta, comprador y viajero se comunican directamente para coordinar.",
  },
];

export default async function Home() {
  // Stats reales desde Supabase
  const [openOrders, activeTravelers, completedOrders] = await Promise.all([
    prisma.order.count({ where: { status: "OPEN" } }),
    prisma.travelerProfile.count({ where: { isApproved: true } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
  ]);

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
              🇧🇴 El marketplace boliviano de compras internacionales
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Comprá del exterior{" "}
              <span className="text-green-600">desde Bolivia</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Conectamos compradores con viajeros internacionales que traen tus
              productos del exterior. Ropa, electrónicos, cosméticos — lo que
              querás, directo a tus manos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-green-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-700 transition-colors text-base shadow-sm"
              >
                Compra con Shoppr
              </Link>
              <Link
                href="/orders"
                className="border border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:border-green-600 hover:text-green-600 transition-colors text-base"
              >
                Ver pedidos disponibles
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              ¿Sos viajero? —{" "}
              <Link href="/register" className="text-green-600 hover:underline">
                Ganá dinero trayendo productos
              </Link>
            </p>
          </div>
        </section>

        {/* Stats reales de Supabase */}
        <section className="bg-green-600 py-12 px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-black mb-1">{openOrders}</div>
              <div className="text-green-100 text-sm">
                Pedidos publicados
              </div>
            </div>
            <div>
              <div className="text-4xl font-black mb-1">{activeTravelers}</div>
              <div className="text-green-100 text-sm">Viajeros activos</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-1">{completedOrders}</div>
              <div className="text-green-100 text-sm">
                Entregas completadas
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cómo funciona
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                En 4 simples pasos tenés tu producto del exterior en Bolivia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <div className="text-xs font-black text-green-300 mb-1 tracking-widest">
                    PASO {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/how-it-works"
                className="text-green-600 text-sm font-medium hover:underline"
              >
                Ver guía completa →
              </Link>
            </div>
          </div>
        </section>

        {/* Por qué Shoppr */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Por qué Shoppr
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                La forma más confiable de traer productos del exterior a Bolivia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Para viajeros */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-10 text-white text-center">
              <div className="text-4xl mb-4">✈️</div>
              <h2 className="text-3xl font-bold mb-4">
                ¿Viajás al exterior?
              </h2>
              <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">
                Convertí tus viajes en ingresos. Traé productos para compradores
                bolivianos y cobrá una recompensa por cada entrega.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-white text-green-700 font-semibold px-7 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  Registrarme como viajero
                </Link>
                <Link
                  href="/how-it-works"
                  className="border border-green-300 text-white font-semibold px-7 py-3 rounded-xl hover:bg-green-700 transition-colors"
                >
                  Cómo funciona →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              Creá tu cuenta gratis y hacé tu primer pedido en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-green-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-700 transition-colors"
              >
                Crear cuenta gratis
              </Link>
              <Link
                href="/orders"
                className="border border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:border-green-600 hover:text-green-600 transition-colors"
              >
                Ver pedidos activos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
