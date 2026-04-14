"use client";

import { useState } from "react";

interface Order {
  id: string;
  title: string;
  productPrice: number;
  reward: number;
  status: string;
  createdAt: string;
  buyer: { name: string; email: string };
  _count: { offers: number };
}

interface AdminOrdersClientProps {
  orders: Order[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; class: string }
> = {
  OPEN: { label: "Abierto", class: "bg-green-100 text-green-700" },
  IN_PROGRESS: { label: "En curso", class: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Completado", class: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "Cancelado", class: "bg-red-100 text-red-600" },
};

export default function AdminOrdersClient({ orders }: AdminOrdersClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por título o comprador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="OPEN">Abierto</option>
          <option value="IN_PROGRESS">En curso</option>
          <option value="COMPLETED">Completado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      <p className="text-xs text-gray-400">
        {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-sm">No hay pedidos que coincidan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              class: "bg-gray-100 text-gray-600",
            };
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900">
                        {order.title}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.class}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Comprador:{" "}
                      <span className="font-medium">{order.buyer.name}</span>
                      <span className="text-gray-400 ml-1">
                        ({order.buyer.email})
                      </span>
                    </p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("es-BO")}
                      </span>
                      <span>
                        💬 {order._count.offers} oferta
                        {order._count.offers !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">Producto</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      BOB {order.productPrice}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Recompensa</p>
                    <p className="font-bold text-green-600 text-sm">
                      BOB {order.reward}
                    </p>
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
