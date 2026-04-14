"use client";

import { useState } from "react";

interface Traveler {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  travelerProfile: {
    isApproved: boolean;
    travelHistory: unknown;
  } | null;
}

interface TravelersListProps {
  travelers: Traveler[];
}

function getTravelHistoryText(th: unknown): string {
  if (!th) return "";
  if (typeof th === "string") return th;
  if (typeof th === "object" && th !== null && "text" in th) {
    return String((th as Record<string, unknown>).text ?? "");
  }
  return "";
}

type FilterTab = "all" | "pending" | "approved";

export default function TravelersList({ travelers }: TravelersListProps) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [statuses, setStatuses] = useState<Record<string, boolean>>(
    Object.fromEntries(
      travelers.map((t) => [t.id, t.travelerProfile?.isApproved ?? false])
    )
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = travelers.filter((t) => {
    const approved = statuses[t.id];
    if (filter === "pending") return !approved;
    if (filter === "approved") return approved;
    return true;
  });

  // Pendientes primero
  const sorted = [...filtered].sort((a, b) => {
    const aApp = statuses[a.id] ? 1 : 0;
    const bApp = statuses[b.id] ? 1 : 0;
    return aApp - bApp;
  });

  const pendingCount = travelers.filter((t) => !statuses[t.id]).length;
  const approvedCount = travelers.filter((t) => statuses[t.id]).length;

  const handleAction = async (
    userId: string,
    action: "approve" | "revoke"
  ) => {
    setLoading(userId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/travelers/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al actualizar el viajero.");
        return;
      }
      setStatuses((prev) => ({
        ...prev,
        [userId]: action === "approve",
      }));
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs de filtro */}
      <div className="flex gap-2">
        {[
          { key: "all", label: `Todos (${travelers.length})` },
          { key: "pending", label: `Pendientes (${pendingCount})` },
          { key: "approved", label: `Aprobados (${approvedCount})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as FilterTab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">✈️</p>
          <p className="text-sm">No hay viajeros en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((traveler) => {
            const approved = statuses[traveler.id];
            const history = getTravelHistoryText(
              traveler.travelerProfile?.travelHistory
            );
            const isLoading = loading === traveler.id;

            return (
              <div
                key={traveler.id}
                className="bg-white rounded-xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Nombre + badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">
                        {traveler.name}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          approved
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {approved ? "Aprobado ✓" : "Pendiente ⏳"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {traveler.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Registrado el{" "}
                      {new Date(traveler.createdAt).toLocaleDateString("es-BO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {history && (
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="font-medium text-gray-600">
                          Historial de viajes:{" "}
                        </span>
                        {history}
                      </p>
                    )}
                  </div>

                  {/* Acción */}
                  <div className="shrink-0">
                    {approved ? (
                      <button
                        onClick={() => handleAction(traveler.id, "revoke")}
                        disabled={isLoading}
                        className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? "..." : "Revocar acceso"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(traveler.id, "approve")}
                        disabled={isLoading}
                        className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {isLoading ? "..." : "Aprobar"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
