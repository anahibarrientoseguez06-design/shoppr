import { existsSync } from "fs";
import { defineConfig } from "prisma/config";

// En desarrollo local carga .env.local si existe.
// En Vercel/CI el archivo no existe — las vars vienen del entorno directamente.
if (existsSync(".env.local")) {
  const dotenv = await import("dotenv");
  dotenv.config({ path: ".env.local" });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Fallback para que `prisma generate` no falle si DATABASE_URL no está seteada.
    // El generate solo necesita el schema, no una conexión real.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/shoppr",
  },
});
