"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminUsersClientProps {
  users: User[];
}

const ROLE_CONFIG: Record<string, { label: string; class: string }> = {
  ADMIN: { label: "Admin", class: "bg-red-100 text-red-700" },
  TRAVELER: { label: "Viajero", class: "bg-blue-100 text-blue-700" },
  BUYER: { label: "Comprador", class: "bg-green-100 text-green-700" },
};

export default function AdminUsersClient({ users }: AdminUsersClientProps) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <p className="text-xs text-gray-400">
        {filtered.length} usuario{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-2xl mb-2">👤</p>
          <p className="text-sm">No se encontraron usuarios.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Registro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => {
                const roleCfg = ROLE_CONFIG[user.role] ?? {
                  label: user.role,
                  class: "bg-gray-100 text-gray-600",
                };
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400 sm:hidden">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleCfg.class}`}
                      >
                        {roleCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString("es-BO")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
