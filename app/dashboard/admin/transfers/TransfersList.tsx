"use client";

import { useState } from "react";

interface Transfer {
  id: string;
  title: string;
  productPrice: number;
  buyer: { name: string; email: string };
  traveler: { name: string; email: string } | null;
  travelersReward: number;
  totalAmount: number;
}

interface TransfersListProps {
  transfers: Transfer[];
}

export default function TransfersList({ transfers }: TransfersListProps) {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const active = transfers.filter((t) => !confirmed.has(t.id));

  const handleConfirm = async (id: string) => {
    setLoading(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/transfers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al confirmar la transferencia.");
        return;
      }
      setConfirmed((prev) => new Set([...prev, id]));
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {active.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">✅</p>
          <p className="font-medium text-gray-600">
            No hay transferencias pendientes.
          </p>
          <p className="text-sm mt-1">
            Todos los pedidos en curso han sido confirmados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-amber-100 p-5"
            >
              {/* Título */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{t.title}</h3>
                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  Pago pendiente
                </span>
              </div>

              {/* Partes involucradas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Comprador
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {t.buyer.name}
                  </p>
                  <a
                    href={`mailto:${t.buyer.email}`}
                    className="text-xs text-green-600 hover:underline"
                  >
                    {t.buyer.email}
                  </a>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Viajero asignado
                  </p>
                  {t.traveler ? (
                    <>
                      <p className="text-sm font-medium text-gray-900">
                        {t.traveler.name}
                      </p>
                      <a
                        href={`mailto:${t.traveler.email}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {t.traveler.email}
                      </a>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">Sin viajero asignado</p>
                  )}
                </div>
              </div>

              {/* Montos */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mb-4">
                <div className="text-sm text-gray-500">
                  <span>Precio producto: </span>
                  <strong className="text-gray-700">
                    BOB {t.productPrice}
                  </strong>
                  <span className="mx-2 text-gray-300">+</span>
                  <span>Recompensa viajero: </span>
                  <strong className="text-green-600">
                    BOB {t.travelersReward}
                  </strong>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total a cobrar</p>
                  <p className="font-bold text-gray-900 text-lg">
                    BOB {t.totalAmount}
                  </p>
                </div>
              </div>

              {/* Botón confirmar */}
              <button
                onClick={() => handleConfirm(t.id)}
                disabled={loading === t.id}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading === t.id
                  ? "Confirmando..."
                  : "✓ Confirmar transferencia recibida"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
