import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import TravelerProfileForm from "./TravelerProfileForm";

export default async function TravelerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TRAVELER") {
    redirect("/login");
  }

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    }),
    prisma.travelerProfile.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  if (!profile?.isApproved) {
    redirect("/dashboard");
  }

  // travelHistory es Json? — puede ser string, objeto, o null
  let travelHistoryStr = "";
  if (profile?.travelHistory) {
    if (typeof profile.travelHistory === "string") {
      travelHistoryStr = profile.travelHistory;
    } else if (
      typeof profile.travelHistory === "object" &&
      profile.travelHistory !== null &&
      "text" in (profile.travelHistory as Record<string, unknown>)
    ) {
      travelHistoryStr = String(
        (profile.travelHistory as Record<string, unknown>).text ?? ""
      );
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-gray-500 mt-1">
          Editá tu información de viajero.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <TravelerProfileForm
          initialName={user?.name ?? ""}
          email={user?.email ?? ""}
          initialTravelHistory={travelHistoryStr}
        />
      </div>
    </div>
  );
}
