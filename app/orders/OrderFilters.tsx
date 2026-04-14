"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const CATEGORIES = ["Electrónica", "Ropa", "Calzado", "Suplementos", "Hogar", "Otro"];

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/orders?${params.toString()}`);
    });
  }

  const currentCategory = searchParams.get("category") ?? "";
  const currentQ = searchParams.get("q") ?? "";

  return (
    <div className={`mt-6 flex flex-col sm:flex-row gap-3 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <input
        type="text"
        placeholder="Buscar pedidos..."
        defaultValue={currentQ}
        onChange={(e) => update("q", e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <select
        value={currentCategory}
        onChange={(e) => update("category", e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
      >
        <option value="">Todas las categorías</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
