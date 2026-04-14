import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Rutas de admin: requieren rol ADMIN
    if (
      pathname.startsWith("/dashboard/admin") &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Si no hay token, redirige al signIn (configurado como /login)
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/admin", "/dashboard/admin/:path*"],
};
