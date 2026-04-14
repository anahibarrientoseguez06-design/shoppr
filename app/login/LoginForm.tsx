"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const isDev = process.env.NODE_ENV === "development";

const testUsers = [
  { label: "Comprador", email: "comprador@shoppr.bo", password: "test123" },
  { label: "Viajero", email: "viajero@shoppr.bo", password: "test123" },
  { label: "Admin", email: "admin@shoppr.bo", password: "admin123" },
];

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Email o contraseña incorrectos. Verificá tus datos.");
      setLoading(false);
    }
  };

  const fillTestUser = (u: (typeof testUsers)[number]) => {
    setEmail(u.email);
    setPassword(u.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-sm mx-auto w-full space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Shoppr</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Iniciá sesión</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Bienvenido de vuelta a Shoppr
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="tu@email.com"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs text-green-600 hover:underline"
                  onClick={() =>
                    alert(
                      "Funcionalidad de recuperación de contraseña próximamente."
                    )
                  }
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            ¿No tenés cuenta?{" "}
            <Link
              href="/register"
              className="text-green-600 font-medium hover:underline"
            >
              Registrate gratis
            </Link>
          </p>
        </div>

        {/* Test users — solo en desarrollo */}
        {isDev && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 mb-3 uppercase tracking-wider">
              Usuarios de prueba (dev)
            </p>
            <div className="space-y-2">
              {testUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fillTestUser(u)}
                  className="w-full text-left flex items-center justify-between bg-white rounded-lg border border-amber-100 px-3 py-2 hover:bg-amber-50 transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-amber-800">
                      {u.label}
                    </span>
                    <p className="text-xs text-gray-500 font-mono">
                      {u.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {u.password}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-2">
              Hacé click en un usuario para autocompletar el formulario.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
