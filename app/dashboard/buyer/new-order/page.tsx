import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import NewOrderForm from "./NewOrderForm";

export default async function NewOrderPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "BUYER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Publicar nuevo pedido</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Completá los datos del producto que querés que un viajero te traiga.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <NewOrderForm />
      </div>
    </div>
  );
}
