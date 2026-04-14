"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"BUYER" | "TRAVELER">("BUYER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear la cuenta.");
        return;
      }

      // Redirigir al login tras registrarse
      router.push("/login?registered=1");
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gratis · Sin tarjeta de crédito
          </p>
        </div>

        {/* Selector de rol */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("BUYER")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              role === "BUYER"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-2xl mb-1">🛍️</span>
            <span className="text-sm font-semibold text-gray-900">Comprador</span>
            <span className="text-xs text-gray-400 mt-0.5">Pedir productos</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("TRAVELER")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              role === "TRAVELER"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-2xl mb-1">✈️</span>
            <span className="text-sm font-semibold text-gray-900">Viajero</span>
            <span className="text-xs text-gray-400 mt-0.5">Ganar dinero</span>
          </button>
        </div>

        {role === "TRAVELER" && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Las cuentas de viajero requieren aprobación del equipo de Shoppr.
            Te notificaremos por email cuando sea activada.
          </p>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
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
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/login"
              className="text-green-600 font-medium hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
