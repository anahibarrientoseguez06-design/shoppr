"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptOfferButton({ offerId }: { offerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function accept() {
    if (!confirm("¿Aceptar esta oferta? Se rechazarán las demás y el pedido pasará a 'En progreso'.")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });

      if (res.ok) {
        setDone(true);
        router.refresh();
      } else {
        const json = await res.json();
        alert(json.error ?? "Error al aceptar la oferta");
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-lg">
        ✓ Aceptada
      </span>
    );
  }

  return (
    <button
      onClick={accept}
      disabled={loading}
      className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
    >
      {loading ? "Procesando..." : "Aceptar oferta"}
    </button>
  );
}
