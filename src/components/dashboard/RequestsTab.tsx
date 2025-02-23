import { Request } from "@prisma/client";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { RiClipboardLine } from "react-icons/ri";
import { useEffect, useState } from "react";

interface RequestWithFeedback extends Request {
  feedback: {
    id: string;
    feedback: string;
    createdAt: Date;
    user: {
      name: string;
    };
  }[];
}

interface Props {
  requests: RequestWithFeedback[];
  isAdmin: boolean;
}

export function RequestsTab({ requests, isAdmin }: Props) {
  const [requestsState, setRequests] = useState(requests);
  useEffect(() => {
    setRequests(requests);
  }, [requests]);
  if (!requests?.length) {
    return (
      <EmptyState
        icon={<RiClipboardLine size={48} />}
        title="No hay peticiones"
        description="Este usuario aún no ha realizado ninguna petición."
      />
    );
  }

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

      // Actualizar la UI localmente
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mis Peticiones</h2>
        <Link
          href="/dashboard/create-request"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Crear petición
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Petición
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Feedback
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requestsState.map((request) => (
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
                        : request.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {request.feedback && request.feedback.length > 0 ? (
                    <div className="text-sm text-gray-900">
                      {request.feedback.length} feedbacks
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">Sin feedback</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/dashboard/requests/${request.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver detalle
                  </Link>
                  {isAdmin && !request.seenByAdmin && (
                    <button
                      onClick={() => markAsSeen(request.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                    >
                      Mark as Seen
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
