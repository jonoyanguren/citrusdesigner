"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type WaitlistEntry = {
  id: string;
  email: string;
  createdAt: string;
};

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await fetch("/api/admin/waitlist");
        if (!response.ok) {
          throw new Error("Error fetching waitlist");
        }
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Error al cargar la lista de espera");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  return (
    <div className="p-6 mt-24">
      <h1 className="text-2xl font-bold mb-6">Lista de Espera</h1>

      {isLoading ? (
        <div className="text-center">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : entries.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay entradas en la lista de espera
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(entry.createdAt), "PPpp", {
                      locale: es,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        // Copiar al portapapeles
                        navigator.clipboard.writeText(entry.email);
                        alert("Email copiado al portapapeles");
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Copiar email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
