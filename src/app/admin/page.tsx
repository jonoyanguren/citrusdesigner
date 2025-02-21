"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import { User } from "@prisma/client";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Si está cargando el auth, no hacemos nada
    if (loading) return;

    // Si no hay usuario o no es admin, redirigimos
    if (!user || user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    // Cargamos los usuarios solo si es admin
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          router.replace("/dashboard");
          return;
        }
        const data = await response.json();
        setUsers(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user, loading, router]);

  // Mientras carga, mostramos el spinner
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  // Si no hay usuario o no es admin, no renderizamos nada
  if (!user || user.role !== "admin") {
    return null;
  }

  // Renderizado principal
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8 pt-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-foreground/60">Gestión de usuarios</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="text-left py-4 px-6">Nombre</th>
                <th className="text-left py-4 px-6">Email</th>
                <th className="text-left py-4 px-6">Rol</th>
                <th className="text-left py-4 px-6">Fecha de registro</th>
                <th className="text-left py-4 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-foreground/10 hover:bg-foreground/5"
                >
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-foreground/10"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="text-sm"
                    >
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
