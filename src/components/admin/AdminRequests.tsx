import { RequestWithFeedback } from "@/types/requests";
import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import * as Popover from "@radix-ui/react-popover";
import { EmptyState } from "@/components/EmptyState";
import { useParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";

interface Props {
  requests: RequestWithFeedback[];
}

type RequestStatus = "PENDING" | "ACCEPTED" | "WORKING" | "DONE";

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

interface TimeToCompleteDialogProps {
  onSubmit: (time: string) => void;
  onClose: () => void;
}

function TimeToCompleteDialog({
  onSubmit,
  onClose,
}: TimeToCompleteDialogProps) {
  const [time, setTime] = useState("");

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-2">
        Tiempo estimado de completado
      </h3>
      <input
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="ej: 2-3 días"
        className="w-full px-3 py-2 border rounded-md mb-4"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
        <button
          onClick={() => onSubmit(time)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

interface FigmaUrlDialogProps {
  onSubmit: (url: string) => void;
  onClose: () => void;
}

function FigmaUrlDialog({ onSubmit, onClose }: FigmaUrlDialogProps) {
  const [url, setUrl] = useState("");

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-2">URL del diseño en Figma</h3>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.figma.com/file/..."
        className="w-full px-3 py-2 border rounded-md mb-4"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
        <button
          onClick={() => onSubmit(url)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export function AdminRequests({ requests }: Props) {
  const { locale } = useParams();
  const [requestsState, setRequestsState] =
    useState<RequestWithFeedback[]>(requests);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    action: RequestStatus;
  } | null>(null);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [showFigmaDialog, setShowFigmaDialog] = useState(false);

  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es,
    });
  };

  const updateRequestStatus = async (
    requestId: string,
    newStatus: RequestStatus,
    timeToComplete: string | null = null,
    figmaUrl: string | null = null
  ) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          timeToComplete,
          figmaUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      setRequestsState(
        requestsState.map((req) =>
          req.id === requestId
            ? { ...req, status: newStatus, timeToComplete, figmaUrl }
            : req
        )
      );
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    return STATUS_ACTIONS[status]?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: RequestStatus) => {
    return STATUS_ACTIONS[status]?.label || status;
  };

  const getAvailableStatuses = (currentStatus: RequestStatus) => {
    const availableStatuses = Object.entries(STATUS_ACTIONS).filter(
      ([status]) => status !== currentStatus
    );
    return availableStatuses;
  };

  const filteredRequests = requestsState
    .filter((request) =>
      request.name.toLowerCase().includes(nameFilter.toLowerCase())
    )
    .filter((request) =>
      statusFilter === "ALL" ? true : request.status === statusFilter
    );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Nuevas Peticiones</h2>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Filtrar por nombre..."
            className="w-full px-4 py-2 border rounded-lg"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequestStatus)}
        >
          <option value="ALL">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="ACCEPTED">Aceptado</option>
          <option value="WORKING">En proceso</option>
          <option value="DONE">Completado</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No hay solicitudes"
          description="No se encontraron solicitudes que coincidan con los filtros seleccionados"
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Usuario</TableHeaderCell>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="text-sm font-medium text-gray-900">
                    {request.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {getRelativeTime(request.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          request.status as RequestStatus
                        )}`}
                      >
                        {getStatusLabel(request.status as RequestStatus)}
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        className="bg-white rounded-lg shadow-lg p-2 min-w-[160px] z-50"
                        sideOffset={5}
                      >
                        <div className="flex flex-col gap-1">
                          {getAvailableStatuses(
                            request.status as RequestStatus
                          ).map(([status, { label, color }]) => (
                            <button
                              key={status}
                              onClick={() => {
                                if (status === "WORKING") {
                                  setSelectedRequest({
                                    id: request.id,
                                    action: status as RequestStatus,
                                  });
                                  setShowTimeDialog(true);
                                } else if (status === "DONE") {
                                  setSelectedRequest({
                                    id: request.id,
                                    action: status as RequestStatus,
                                  });
                                  setShowFigmaDialog(true);
                                } else {
                                  updateRequestStatus(
                                    request.id,
                                    status as RequestStatus
                                  );
                                }
                              }}
                              className={`text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${color}`}
                            >
                              Cambiar a {label}
                            </button>
                          ))}
                        </div>
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/${locale}/dashboard/requests/${request.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Ver detalle
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {showTimeDialog && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg">
            <TimeToCompleteDialog
              onSubmit={(time) => {
                updateRequestStatus(
                  selectedRequest.id,
                  selectedRequest.action,
                  time
                );
                setShowTimeDialog(false);
              }}
              onClose={() => setShowTimeDialog(false)}
            />
          </div>
        </div>
      )}

      {showFigmaDialog && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg">
            <FigmaUrlDialog
              onSubmit={(url) => {
                updateRequestStatus(
                  selectedRequest.id,
                  selectedRequest.action,
                  null,
                  url
                );
                setShowFigmaDialog(false);
              }}
              onClose={() => setShowFigmaDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
