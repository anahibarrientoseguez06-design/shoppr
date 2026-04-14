"use client";

import { useState } from "react";

interface TravelerProfileFormProps {
  initialName: string;
  email: string;
  initialTravelHistory: string;
}

export default function TravelerProfileForm({
  initialName,
  email,
  initialTravelHistory,
}: TravelerProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [travelHistory, setTravelHistory] = useState(initialTravelHistory);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!name.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/traveler/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), travelHistory }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al guardar los cambios.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials || "?"}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-400">{email}</p>
          <p className="text-xs text-gray-400 mt-1">
            La foto de perfil se mostrará como tus iniciales por ahora.
          </p>
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Email (no editable) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400 mt-1">
          El email no se puede modificar.
        </p>
      </div>

      {/* Historial de viajes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Historial de viajes
        </label>
        <textarea
          value={travelHistory}
          onChange={(e) => setTravelHistory(e.target.value)}
          rows={5}
          placeholder="Ej: Viajo regularmente a Miami, Nueva York y Madrid. Tengo viajes programados a Chile en junio y a Brasil en agosto..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Contales a los compradores a qué países y ciudades viajás habitualmente.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {saved && (
        <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
          ✓ Cambios guardados correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
