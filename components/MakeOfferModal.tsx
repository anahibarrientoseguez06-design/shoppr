"use client";

import { useState } from "react";

interface Order {
  id: string;
  title: string;
  productPrice: number;
  reward: number;
  deliveryCity?: string | null;
}

interface MakeOfferModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export default function MakeOfferModal({
  order,
  onClose,
  onSuccess,
}: MakeOfferModalProps) {
  const [proposedReward, setProposedReward] = useState<string>(
    order.reward.toString()
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const rewardNum = parseFloat(proposedReward);

    if (isNaN(rewardNum) || rewardNum <= 0) {
      setError("La recompensa debe ser un número positivo.");
      return;
    }
    if (message.trim().length < 20) {
      setError("El mensaje debe tener al menos 20 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          proposedReward: rewardNum,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al enviar la oferta.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess(order.id);
        onClose();
      }, 1800);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Hacer oferta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Resumen del pedido */}
        <div className="px-5 pt-4 pb-3 bg-gray-50 mx-5 mt-4 rounded-xl">
          <p className="font-medium text-gray-900 text-sm">{order.title}</p>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span>
              Precio:{" "}
              <strong className="text-gray-700">
                BOB {order.productPrice}
              </strong>
            </span>
            <span>
              Recompensa sugerida:{" "}
              <strong className="text-green-600">BOB {order.reward}</strong>
            </span>
          </div>
          {order.deliveryCity && (
            <p className="text-xs text-gray-400 mt-1">
              📍 Entrega en {order.deliveryCity}
            </p>
          )}
        </div>

        {success ? (
          <div className="px-5 py-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-gray-900">¡Oferta enviada!</p>
            <p className="text-sm text-gray-500 mt-1">
              El comprador revisará tu propuesta.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Recompensa propuesta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recompensa propuesta (BOB)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={proposedReward}
                onChange={(e) => setProposedReward(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Podés proponer un monto diferente a la recompensa sugerida.
              </p>
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje para el comprador
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Ej: Viajo a La Paz el 15 de mayo, puedo comprar tu producto en Miami..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                required
              />
              <p
                className={`text-xs mt-1 ${
                  message.trim().length >= 20
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >
                {message.trim().length}/20 caracteres mínimo
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Enviando..." : "Enviar oferta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
