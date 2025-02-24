"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { RichText } from "@/components/RichText";
import { processContentWithImages } from "@/lib/utils/imageProcessing";
import { User } from "@prisma/client";

export default function NuevaPeticionPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    request: "",
    userId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const processedRequest = await processContentWithImages(formData.request);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          request: processedRequest,
          userId: formData.userId,
        }),
      });

      if (response.ok) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error al crear la petición:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetch("/api/users");
      const data = await users.json();
      setUsers([{ id: "1", name: "Admin" }, ...data]);
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-6">
        Crear Nueva Petición{" "}
        <span className="text-sm text-white bg-yellow-800 px-2 py-1 rounded-md">
          admin
        </span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nombre de la petición"
            placeholder="Nombre de la petición"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Usuario
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Descripción de la petición
          </label>
          <RichText
            initialContent=""
            onChange={(content) =>
              setFormData({ ...formData, request: content })
            }
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit">Crear Petición</Button>
        </div>
      </form>
    </div>
  );
}
