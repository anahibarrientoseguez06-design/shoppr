"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Electrónica", "Ropa", "Calzado", "Suplementos", "Hogar", "Otro"];
const CITIES = ["La Paz", "Cochabamba", "Santa Cruz", "Sucre", "Oruro", "Potosí", "Tarija", "Trinidad", "Cobija"];

export default function NewOrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value.trim(),
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value.trim(),
      productUrl: (form.elements.namedItem("productUrl") as HTMLInputElement).value.trim(),
      productPrice: Number((form.elements.namedItem("productPrice") as HTMLInputElement).value),
      reward: Number((form.elements.namedItem("reward") as HTMLInputElement).value),
      category: (form.elements.namedItem("category") as HTMLSelectElement).value || null,
      deliveryCity: (form.elements.namedItem("deliveryCity") as HTMLSelectElement).value || null,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value.trim() || null,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Error al crear el pedido");
        return;
      }

      router.push("/dashboard/buyer/my-orders");
      router.refresh();
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título del producto <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Ej: Nike Air Max 270 — Talle 42 — Negro"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción detallada <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Describí el producto con todos los detalles: color, talle, modelo exacto, tienda donde se vende..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* URL */}
      <div>
        <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 mb-1">
          URL del producto en la tienda online <span className="text-red-500">*</span>
        </label>
        <input
          id="productUrl"
          name="productUrl"
          type="url"
          required
          placeholder="https://www.amazon.com/dp/..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Precio + Recompensa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Precio del producto (BOB) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Bs.</span>
            <input
              id="productPrice"
              name="productPrice"
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-1">
            Recompensa para el viajero (BOB) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Bs.</span>
            <input
              id="reward"
              name="reward"
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Una buena recompensa atrae más viajeros
          </p>
        </div>
      </div>

      {/* Categoría + Ciudad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Seleccioná una categoría</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad de entrega en Bolivia
          </label>
          <select
            id="deliveryCity"
            name="deliveryCity"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Seleccioná una ciudad</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notas adicionales */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales para el viajero{" "}
          <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Instrucciones especiales, fechas límite, preferencias de entrega..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Publicando..." : "Publicar pedido"}
        </button>
        <a
          href="/dashboard/buyer/my-orders"
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
