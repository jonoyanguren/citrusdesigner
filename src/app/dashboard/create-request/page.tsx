"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";

export default function NuevaPeticionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    request: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          fechaCreacion: new Date(),
        }),
      });

      if (response.ok) {
        router.push("/dashboard?tab=requests");
      }
    } catch (error) {
      console.error("Error al crear la petición:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Petición</h1>

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
          <Textarea
            label="Descripción de la petición"
            placeholder="Descripción de la petición"
            value={formData.request}
            onChange={(e) =>
              setFormData({ ...formData, request: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Crear Petición
          </button>
        </div>
      </form>
    </div>
  );
}
