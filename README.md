# Shoppr 🇧🇴

**El marketplace boliviano de compras internacionales.**

Shoppr conecta compradores bolivianos con viajeros internacionales que traen productos del exterior. Similar a Grabr.io, diseñado específicamente para el contexto boliviano.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL (Supabase) |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Auth | NextAuth.js v4 (JWT + Credentials) |
| Estilos | Tailwind CSS v4 |
| Emails | Resend |
| Deploy | Vercel |

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/shoppr.git
cd shoppr
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editá `.env.local` con tus valores:

```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROYECTO.supabase.co:5432/postgres
NEXTAUTH_SECRET=un-secreto-largo-y-aleatorio
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=    # opcional — si está vacío, los emails van a consola
```

### 4. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 5. Correr las migraciones

```bash
npx prisma migrate deploy
```

### 6. Poblar la base de datos con datos de prueba

```bash
npx prisma db seed
```

Esto crea:
- 3 usuarios (comprador, viajero, admin)
- 1 perfil de viajero aprobado
- 4 pedidos de ejemplo
- 1 oferta de ejemplo

### 7. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000)

---

## Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Connection string de PostgreSQL (Supabase) | ✅ |
| `NEXTAUTH_SECRET` | Secret para firmar JWT. Generá con `openssl rand -base64 32` | ✅ |
| `NEXTAUTH_URL` | URL pública de la app. En Vercel: `https://tu-app.vercel.app` | ✅ |
| `RESEND_API_KEY` | API key de Resend. Si está vacío, se loguea en consola | ❌ |

---

## Usuarios de prueba

Después de correr el seed:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Comprador | `comprador@shoppr.bo` | `test123` |
| Viajero (aprobado) | `viajero@shoppr.bo` | `test123` |
| Administrador | `admin@shoppr.bo` | `admin123` |

> En modo desarrollo, los usuarios de prueba aparecen en un recuadro en `/login` para facilitar el testing.

---

## Rutas de la aplicación

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page con stats reales de Supabase |
| `/orders` | Listado público de pedidos abiertos |
| `/orders/[id]` | Detalle de un pedido |
| `/how-it-works` | Cómo funciona + FAQ |
| `/login` | Iniciar sesión |
| `/register` | Crear cuenta (comprador o viajero) |

### Dashboard — Compradores
| Ruta | Descripción |
|------|-------------|
| `/dashboard/buyer/my-orders` | Mis pedidos + ofertas recibidas |
| `/dashboard/buyer/new-order` | Publicar nuevo pedido |
| `/dashboard/buyer/orders/[id]` | Detalle de pedido + aceptar ofertas |

### Dashboard — Viajeros (requiere aprobación admin)
| Ruta | Descripción |
|------|-------------|
| `/dashboard/traveler` | Panel con estadísticas y accesos rápidos |
| `/dashboard/traveler/orders` | Pedidos disponibles para ofertar |
| `/dashboard/traveler/my-offers` | Mis ofertas enviadas |
| `/dashboard/traveler/profile` | Editar perfil |

### Dashboard — Admin
| Ruta | Descripción |
|------|-------------|
| `/dashboard/admin` | Resumen con métricas reales |
| `/dashboard/admin/travelers` | Aprobar/revocar viajeros |
| `/dashboard/admin/orders` | Ver todos los pedidos |
| `/dashboard/admin/users` | Ver todos los usuarios |
| `/dashboard/admin/transfers` | Confirmar pagos recibidos |

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Registrar nuevo usuario |
| `GET` | `/api/orders` | — | Listar pedidos OPEN |
| `POST` | `/api/orders` | BUYER | Crear pedido |
| `GET` | `/api/orders/[id]` | — | Detalle de pedido |
| `PATCH` | `/api/orders/[id]` | BUYER/ADMIN | Actualizar status |
| `POST` | `/api/offers` | TRAVELER aprobado | Crear oferta |
| `PATCH` | `/api/offers/[id]` | BUYER/ADMIN | Aceptar / rechazar oferta |
| `PATCH` | `/api/traveler/profile` | TRAVELER | Actualizar perfil |
| `PATCH` | `/api/admin/travelers/[id]` | ADMIN | Aprobar / revocar viajero |
| `PATCH` | `/api/admin/transfers/[id]` | ADMIN | Confirmar pago → COMPLETED |

---

## Deploy en Vercel

### 1. Subir el código a GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Importar en Vercel

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Importar el repositorio de GitHub
3. Vercel detecta Next.js automáticamente

### 3. Configurar variables de entorno en Vercel

En **Settings → Environment Variables** agregar:

```
DATABASE_URL    = tu-connection-string-de-supabase
NEXTAUTH_SECRET = resultado de: openssl rand -base64 32
NEXTAUTH_URL    = https://tu-app.vercel.app
RESEND_API_KEY  = tu-api-key-de-resend (opcional)
```

### 4. Deploy

Vercel hace deploy automáticamente en cada push a `main`.  
Las migraciones de Prisma se pueden correr con `npx prisma migrate deploy` tras el primer deploy.

---

## Notas de arquitectura

### Prisma 7 — diferencias clave

- `schema.prisma` **no tiene `url`** en el datasource — la URL va en `prisma.config.ts`
- Se requiere `PrismaPg` adapter para instanciar el cliente: `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`
- El seed va en `prisma.config.ts` bajo `migrations.seed`, no en `package.json`

### Next.js 16 — async params

Los `params` y `searchParams` son Promises:

```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### NextAuth v4

Se usa el patrón `authOptions` con `getServerSession` en Server Components.

---

## Licencia

MIT — Libre para usar y modificar.

---

*Hecho con ❤️ en Bolivia 🇧🇴*
