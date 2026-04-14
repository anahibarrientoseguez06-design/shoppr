import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de Shoppr...\n");

  // Limpiar datos existentes en orden correcto
  await prisma.offer.deleteMany();
  await prisma.order.deleteMany();
  await prisma.travelerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Datos previos eliminados.\n");

  // ── Usuarios ──────────────────────────────────────────────

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("test123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Shoppr",
      email: "admin@shoppr.bo",
      password: adminPassword,
      role: "ADMIN",
      verified: true,
    },
  });
  console.log(`✅ Admin creado: ${admin.email}`);

  const comprador = await prisma.user.create({
    data: {
      name: "Carlos Mamani",
      email: "comprador@shoppr.bo",
      password: userPassword,
      role: "BUYER",
      verified: true,
    },
  });
  console.log(`✅ Comprador creado: ${comprador.email}`);

  const viajero = await prisma.user.create({
    data: {
      name: "Ana Quispe",
      email: "viajero@shoppr.bo",
      password: userPassword,
      role: "TRAVELER",
      verified: true,
    },
  });
  console.log(`✅ Viajero creado: ${viajero.email}`);

  // ── Perfil de viajero ─────────────────────────────────────

  await prisma.travelerProfile.create({
    data: {
      userId: viajero.id,
      isApproved: true,
      travelHistory: {
        viajes: [
          { destino: "Miami, USA", fecha: "2025-11", pedidos_completados: 3 },
          { destino: "Buenos Aires, ARG", fecha: "2026-01", pedidos_completados: 5 },
          { destino: "São Paulo, BRA", fecha: "2026-03", pedidos_completados: 2 },
        ],
      },
    },
  });
  console.log(`✅ TravelerProfile creado para ${viajero.email}\n`);

  // ── Pedidos de ejemplo ────────────────────────────────────

  const pedido1 = await prisma.order.create({
    data: {
      title: "Nike Air Max 270 — Talle 42 — Negro/Blanco",
      description:
        "Necesito las Nike Air Max 270 React en color negro con suela blanca, talle 42 (US 9). Las vi en la web oficial de Nike USA por $140. Por favor traerlas en caja original con todos los accesorios.",
      productUrl: "https://www.nike.com/t/air-max-270",
      productPrice: 966.0,
      reward: 180.0,
      status: "OPEN",
      buyerId: comprador.id,
    },
  });
  console.log(`✅ Pedido creado: ${pedido1.title}`);

  const pedido2 = await prisma.order.create({
    data: {
      title: "iPhone 16 Pro — 256GB — Titanio Natural",
      description:
        "Busco el iPhone 16 Pro de 256GB en color Titanio Natural. Debe ser versión americana (desbloqueado, sin contrato). Incluir caja, cable y todos los accesorios originales. Disponible en Apple Store USA.",
      productUrl: "https://www.apple.com/shop/buy-iphone/iphone-16-pro",
      productPrice: 6900.0,
      reward: 600.0,
      status: "OPEN",
      buyerId: comprador.id,
    },
  });
  console.log(`✅ Pedido creado: ${pedido2.title}`);

  const pedido3 = await prisma.order.create({
    data: {
      title: "Creatina ON Gold Standard 5lb — Unflavored",
      description:
        "Optimum Nutrition Micronized Creatine Powder de 5 libras, sabor Unflavored. Disponible en Amazon US o GNC. Asegurarse de que el sello esté intacto y la fecha de vencimiento sea mayor a 2027.",
      productUrl: "https://www.amazon.com/dp/B002DYIZEO",
      productPrice: 221.0,
      reward: 90.0,
      status: "IN_PROGRESS",
      buyerId: comprador.id,
    },
  });
  console.log(`✅ Pedido creado: ${pedido3.title}`);

  const pedido4 = await prisma.order.create({
    data: {
      title: "Polo Ralph Lauren — Talle L — Varios colores",
      description:
        "Polos originales Ralph Lauren, talle Large, preferiblemente en colores azul marino, blanco o verde. Pueden ser 2 o 3 unidades si el viajero tiene espacio. Disponibles en Macy's o la tienda oficial de RL.",
      productUrl: "https://www.ralphlauren.com/men-clothing-shirts-polo-shirts",
      productPrice: 345.0,
      reward: 120.0,
      status: "OPEN",
      buyerId: comprador.id,
    },
  });
  console.log(`✅ Pedido creado: ${pedido4.title}`);

  // ── Oferta de ejemplo ─────────────────────────────────────

  await prisma.offer.create({
    data: {
      orderId: pedido3.id,
      travelerId: viajero.id,
      proposedReward: 85.0,
      message:
        "Hola, viajo a Miami la próxima semana y puedo traerte la creatina. Encontré exactamente el producto en Amazon, lo pido antes de viajar y lo recojo en el hotel. Te la entrego en La Paz.",
      status: "ACCEPTED",
    },
  });
  console.log(`✅ Oferta aceptada creada para pedido: ${pedido3.title}\n`);

  console.log("🎉 Seed completado exitosamente.");
  console.log("\n📋 Resumen:");
  console.log("   Usuarios: 3 (admin, comprador, viajero)");
  console.log("   Pedidos:  4 (3 OPEN, 1 IN_PROGRESS)");
  console.log("   Ofertas:  1 (ACCEPTED)");
  console.log("   TravelerProfiles: 1 (aprobado)\n");
  console.log("🔑 Credenciales de prueba:");
  console.log("   admin@shoppr.bo     / admin123  (ADMIN)");
  console.log("   comprador@shoppr.bo / test123   (BUYER)");
  console.log("   viajero@shoppr.bo   / test123   (TRAVELER)");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
