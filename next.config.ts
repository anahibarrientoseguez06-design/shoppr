import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite importar SVGs y otros assets desde node_modules si es necesario
  // Configuración mínima — Vercel detecta Next.js automáticamente
  experimental: {
    // Habilitar si se necesitan Server Actions en el futuro
  },
};

export default nextConfig;
