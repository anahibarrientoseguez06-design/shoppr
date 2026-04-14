import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import TravelersList from "./TravelersList";

export default async function AdminTravelersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const travelers = await prisma.user.findMany({
    where: { role: "TRAVELER" },
    orderBy: { createdAt: "asc" },
    include: {
      travelerProfile: {
        select: { isApproved: true, travelHistory: true },
      },
    },
  });

  // Serializar fechas
  const serialized = travelers.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }));

  const pendingCount = travelers.filter(
    (t) => !t.travelerProfile?.isApproved
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Viajeros</h1>
        <p className="text-gray-500 mt-1">
          {travelers.length} viajero{travelers.length !== 1 ? "s" : ""}{" "}
          registrado{travelers.length !== 1 ? "s" : ""}
          {pendingCount > 0 && (
            <span className="ml-2 text-red-500 font-medium">
              · {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      <TravelersList travelers={serialized} />
    </div>
  );
}
