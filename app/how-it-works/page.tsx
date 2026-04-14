import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const buyerSteps = [
  {
    icon: "📝",
    title: "Publicá tu pedido",
    description:
      "Describí el producto que querés, pegá el link de la tienda online, indicá el precio y definí la recompensa que ofrecés al viajero que lo traiga.",
  },
  {
    icon: "📬",
    title: "Recibí ofertas",
    description:
      "Viajeros con vuelos programados al país de origen ven tu pedido y te envían una oferta con su propuesta de recompensa y fecha de entrega estimada.",
  },
  {
    icon: "✅",
    title: "Aceptá un viajero",
    description:
      "Revisá las ofertas recibidas, elegí al viajero que mejor se adapte y aceptá su propuesta. El viajero te contactará para coordinar los detalles.",
  },
  {
    icon: "📦",
    title: "Recibí tu producto",
    description:
      "El viajero compra y te entrega el producto en mano en tu ciudad boliviana. Confirmás la entrega y se libera el pago al viajero.",
  },
];

const travelerSteps = [
  {
    icon: "🔍",
    title: "Explorá los pedidos",
    description:
      "Revisá todos los pedidos publicados por compradores bolivianos. Filtrá por ciudad de entrega, categoría o recompensa para encontrar los que te convengan.",
  },
  {
    icon: "💬",
    title: "Hacé tu oferta",
    description:
      "Cuando encontrés un pedido que coincida con tu próximo viaje, enviá una oferta. Indicá tu recompensa propuesta y contales cuándo vas a viajar.",
  },
  {
    icon: "🛍️",
    title: "Comprá el producto",
    description:
      "Una vez aceptada tu oferta, comprá el producto en el destino. Guardá el recibo. El comprador realizará el pago total a la cuenta de Shoppr.",
  },
  {
    icon: "💰",
    title: "Entregá y cobrá",
    description:
      "Entregá el producto al comprador en Bolivia, él confirma la entrega y Shoppr libera tu recompensa. ¡Así de simple es ganar dinero viajando!",
  },
];

const faqs = [
  {
    q: "¿Es seguro comprar con Shoppr?",
    a: "Sí. Todos los viajeros pasan por un proceso de verificación de identidad antes de poder hacer ofertas. Además, los pagos están protegidos: el dinero se mantiene en custodia hasta que el comprador confirma haber recibido el producto.",
  },
  {
    q: "¿Cómo funciona el pago?",
    a: "El comprador transfiere el monto total (precio del producto + recompensa del viajero) a la cuenta bancaria de Shoppr antes de que el viajero compre el producto. Una vez que el comprador confirma la entrega, liberamos el pago al viajero. Nunca transferís dinero directamente al viajero.",
  },
  {
    q: "¿Qué pasa si el viajero no entrega el producto?",
    a: "En caso de que un viajero no cumpla con la entrega, Shoppr gestiona el reclamo. Si la situación no se resuelve, reembolsamos el 100% del dinero al comprador. Es por eso que los pagos se mantienen en custodia hasta confirmar la entrega.",
  },
  {
    q: "¿Cuánto puedo ganar como viajero?",
    a: "Las recompensas varían según el tipo de producto, el país de origen y el comprador. En promedio, los viajeros ganan entre USD 20 y USD 150 por producto. Si traés varios productos en un mismo viaje, los ingresos pueden ser significativos.",
  },
  {
    q: "¿Qué productos puedo pedir?",
    a: "Podés pedir casi cualquier producto disponible en tiendas o e-commerce del exterior: electrónicos, ropa, cosméticos, suplementos, libros, accesorios, etc. Quedan excluidos: artículos ilegales, sustancias controladas, productos perecederos y artículos que excedan los límites aduaneros de Bolivia.",
  },
  {
    q: "¿En qué ciudades de Bolivia operan?",
    a: "Actualmente operamos en las principales ciudades de Bolivia: La Paz, Cochabamba, Santa Cruz, Oruro, Potosí, Sucre y Tarija. Estamos expandiendo la cobertura progresivamente. Al publicar tu pedido podés especificar la ciudad de entrega.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-50 to-white py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-5">
              Guía completa
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5">
              ¿Cómo funciona Shoppr?
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Shoppr conecta compradores bolivianos con viajeros internacionales.
              Así funciona para cada parte.
            </p>
          </div>
        </section>

        {/* Para compradores */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="text-3xl">🛍️</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Para compradores</h2>
                <p className="text-gray-500 mt-1">
                  Traé el producto que querés del exterior en 4 pasos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {buyerSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl mb-4">
                    {step.icon}
                  </div>
                  <div className="text-xs font-black text-green-400 mb-1 tracking-widest">
                    PASO {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/register"
                className="inline-block bg-green-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                Publicar mi primer pedido →
              </Link>
            </div>
          </div>
        </section>

        {/* Separador */}
        <div className="bg-gray-100 h-px max-w-5xl mx-auto" />

        {/* Para viajeros */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="text-3xl">✈️</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Para viajeros</h2>
                <p className="text-gray-500 mt-1">
                  Convertí tus viajes en ingresos con 4 pasos simples
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {travelerSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl mb-4">
                    {step.icon}
                  </div>
                  <div className="text-xs font-black text-blue-400 mb-1 tracking-widest">
                    PASO {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/register"
                className="inline-block bg-blue-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Registrarme como viajero →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 px-4 bg-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Todo claro? ¡Empezá ahora!
            </h2>
            <p className="text-gray-500 mb-8">
              Creá tu cuenta gratis en menos de 2 minutos.
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
