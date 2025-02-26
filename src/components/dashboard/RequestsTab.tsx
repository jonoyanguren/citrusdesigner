import { Request, RequestStatus } from "@prisma/client";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { RiClipboardLine } from "react-icons/ri";
interface RequestWithFeedback extends Omit<Request, "status"> {
  status: RequestStatus;
  timeToComplete: string | null;
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
}

const STATUS_ACTIONS = {
  PENDING: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800",
  },
  ACCEPTED: {
    label: "Aceptado",
    color: "bg-blue-100 text-blue-800",
  },
  WORKING: {
    label: "En proceso",
    color: "bg-purple-100 text-purple-800",
  },
  DONE: {
    label: "Completado",
    color: "bg-green-100 text-green-800",
  },
} as const;

export function RequestsTab({ requests }: Props) {
  const router = useRouter();
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
        action={
          <Button
            variant="secondary"
            onClick={() => router.push("/dashboard/create-request")}
          >
            Crear Petición
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mis Peticiones</h2>
        <Button
          variant="secondary"
          onClick={() => router.push("/dashboard/create-request")}
        >
          Crear Petición
        </Button>
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
                Tiempo estimado
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm text-gray-900 text-center rounded-full px-2 py-1 ${
                      STATUS_ACTIONS[request.status].color
                    }`}
                  >
                    {STATUS_ACTIONS[request.status].label}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {request.timeToComplete
                      ? `${request.timeToComplete} días`
                      : "Sin estimación"}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
