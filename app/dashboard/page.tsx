import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "BUYER") {
    redirect("/dashboard/buyer/my-orders");
  }

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (role === "TRAVELER") {
    // Verificar si el viajero está aprobado
    const profile = await prisma.travelerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (profile?.isApproved) {
      redirect("/dashboard/traveler");
    }

    // Viajero no aprobado — mostrar mensaje
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Cuenta pendiente de aprobación
        </h1>
        <p className="text-gray-500 max-w-md">
          Tu solicitud para ser viajero está siendo revisada por nuestro equipo.
          Te notificaremos por email cuando sea aprobada.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Hola, <strong>{session.user.name}</strong> ({session.user.email})
        </p>
      </div>
    );
  }

  redirect("/");
}
