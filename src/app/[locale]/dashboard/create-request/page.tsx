"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import { RichText } from "@/components/RichText";
import Button from "@/components/Button";
import { processContentWithImages } from "@/lib/utils/imageProcessing";

export default function NuevaPeticionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    request: "",
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
          <Button type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit">Crear Petición</Button>
        </div>
      </form>
    </div>
  );
}
