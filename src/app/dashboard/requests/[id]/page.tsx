import { getBaseUrl } from "@/lib/utils";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

type Feedback = {
  id: string;
  feedback: string;
  createdAt: Date;
  user: {
    name: string;
    role: "user" | "admin";
  };
};

async function getRequest(id: string | undefined) {
  if (!id) {
    notFound(); // Redirige a 404 si el id no está definido
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/requests/${id}`);

  if (!response.ok) {
    notFound();
  }

  return response.json();
}

async function revalidate(formData: FormData) {
  "use server";
  const path = formData.get("path") as string;
  revalidatePath(path);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Solicitud ${params.id}`,
  };
}

export default async function RequestDetail({
  params,
}: {
  params?: { id?: string };
}) {
  if (!params?.id) {
    notFound();
  }

  const request = await getRequest(params.id);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 mt-24">
      <h1 className="text-2xl font-bold mb-6">Detalle de la Petición</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Nombre</h2>
          <p className="text-gray-700">{request.name}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Petición</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{request.request}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Estado</h2>
          <span
            className={`px-2 py-1 text-sm font-semibold rounded-full ${
              request.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : request.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : request.status === "COMPLETED"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {request.status}
          </span>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Fecha de creación</h2>
          <p className="text-gray-700">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Feedback</h2>
          {request.feedback.length > 0 ? (
            <div className="space-y-4">
              {request.feedback.map((fb: Feedback) => (
                <div
                  key={fb.id}
                  className={`p-4 rounded-lg max-w-[80%] ${
                    fb.user.role === "admin"
                      ? "bg-blue-50 ml-auto"
                      : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex justify-between items-center mb-2 ${
                      fb.user.role === "admin" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        fb.user.role === "admin"
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {fb.user.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className="max-h-[400px] overflow-y-auto pr-4 [&>h1]:text-[1.875rem] [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-3 [&>h1]:text-gray-900
                    [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:text-gray-800
                    [&>p]:mb-4 [&>p]:leading-7 [&>p]:text-gray-600
                    [&>a]:text-blue-600 [&>a]:underline hover:[&>a]:text-blue-800 [&>a]:transition-colors
                    [&>strong]:font-semibold [&>strong]:text-gray-800
                    [&>em]:italic
                    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
                    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4
                    [&>li]:mb-2 [&>li]:text-gray-600
                    scrollbar-hide hover:scrollbar-default"
                    dangerouslySetInnerHTML={{ __html: fb.feedback }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay feedback disponible</p>
          )}

          <Suspense>
            <FeedbackForm
              requestId={params.id}
              revalidate={revalidate}
              path={`/dashboard/requests/${params.id}`}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
