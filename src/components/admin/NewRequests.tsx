import { RequestWithFeedback } from "@/types/requests";
import Link from "next/link";
import { useState } from "react";

interface Props {
  requests: RequestWithFeedback[];
}

export function NewRequests({ requests }: Props) {
  const [requestsState, setRequests] = useState(requests);

  const markAsSeen = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}/seen`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark request as seen");
      }

      setRequests(
        requestsState.map((req) =>
          req.id === requestId ? { ...req, seenByAdmin: true } : req
        )
      );
    } catch (error) {
      console.error("Error marking request as seen:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Nuevas Peticiones</h2>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Petición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requestsState
              .filter((request) => !request.seenByAdmin)
              .map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">
                      {request.request}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "APROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link
                      href={`/dashboard/requests/${request.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver detalle
                    </Link>
                    <button
                      onClick={() => markAsSeen(request.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Marcar como vista
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
