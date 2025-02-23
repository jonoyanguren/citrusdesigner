"use client";
import { User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RequestsTab } from "@/components/dashboard/RequestsTab";
import { RequestWithFeedback } from "@/types/requests";

// Actualizamos la interfaz para usar el tipo correcto
interface UserWithRequests extends User {
  requests: RequestWithFeedback[];
}

export default function CustomerDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<UserWithRequests | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/admin/users/${id}`);
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, [id]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8 pt-20">
        <h1 className="text-3xl font-bold">Detalles del cliente</h1>
      </div>
      <div className="max-w-7xl mx-auto space-y-8 pt-8">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Información del cliente</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Nombre</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Rol</p>
                <p className="font-medium">{user?.role}</p>
              </div>
              <div>
                <p className="text-gray-500">Fecha de registro</p>
                <p className="font-medium">
                  {user?.createdAt &&
                    new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Últimas peticiones</h2>
            {user?.requests && <RequestsTab requests={user.requests} />}
          </div>
        </div>
      </div>
    </div>
  );
}
