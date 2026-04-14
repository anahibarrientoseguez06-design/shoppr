import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      buyer: { select: { name: true, email: true } },
      _count: { select: { offers: true } },
    },
  });

  const serialized = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-500 mt-1">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total
        </p>
      </div>
      <AdminOrdersClient orders={serialized} />
    </div>
  );
}
