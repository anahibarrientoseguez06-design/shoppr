"use client";

import { useState } from "react";
import MakeOfferModal from "@/components/MakeOfferModal";

interface Order {
  id: string;
  title: string;
  description: string;
  productPrice: number;
  reward: number;
  category: string | null;
  deliveryCity: string | null;
  createdAt: string;
  _count: { offers: number };
}

interface TravelerOrdersListProps {
  orders: Order[];
  offeredOrderIds: string[];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} días`;
}

export default function TravelerOrdersList({
  orders,
  offeredOrderIds,
}: TravelerOrdersListProps) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Track locally which orders the traveler has offered on (so UI updates without reload)
  const [localOffered, setLocalOffered] = useState<string[]>(offeredOrderIds);

  const cities = Array.from(
    new Set(orders.map((o) => o.deliveryCity).filter(Boolean))
  ) as string[];
  const categories = Array.from(
    new Set(orders.map((o) => o.category).filter(Boolean))
  ) as string[];

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search || o.title.toLowerCase().includes(search.toLowerCase());
    const matchCity = !cityFilter || o.deliveryCity === cityFilter;
    const matchCategory = !categoryFilter || o.category === categoryFilter;
    return matchSearch && matchCity && matchCategory;
  });

  const handleOfferSuccess = (orderId: string) => {
    setLocalOffered((prev) => [...prev, orderId]);
    setSelectedOrder(null);
  };

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">Todas las ciudades</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">
            No hay pedidos que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const alreadyOffered = localOffered.includes(order.id);
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {order.title}
                      </h3>
                      {order.category && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {order.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {order.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                      {order.deliveryCity && (
                        <span>📍 {order.deliveryCity}</span>
                      )}
                      <span>🕑 {timeAgo(order.createdAt)}</span>
                      <span>
                        💬 {order._count.offers} oferta
                        {order._count.offers !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400 mb-0.5">Producto</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      BOB {order.productPrice}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-0.5">
                      Recompensa
                    </p>
                    <p className="font-bold text-green-600">
                      BOB {order.reward}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  {alreadyOffered ? (
                    <span className="text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1.5 rounded-lg">
                      ✓ Ya ofertaste
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm font-semibold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Hacer oferta
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <MakeOfferModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={handleOfferSuccess}
        />
      )}
    </>
  );
}
