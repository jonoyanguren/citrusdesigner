import { getBaseUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaFigma } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaGoogleDrive } from "react-icons/fa";
import { StatusBadgeServer } from "@/components/StatusBadgeServer";
import { FeedbackList } from "@/components/FeedbackList";
import { isAdmin, verifyToken } from "@/lib/users";
import BackButton from "@/components/BackButton";

async function getRequest(id: string | undefined) {
  if (!id) {
    notFound();
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

export default async function RequestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isAdminUser = await isAdmin();
  const backUrl = isAdminUser ? "/admin" : "/dashboard?tab=requests";

  const t = await getTranslations("dashboard.requestDetail");

  if (!id) {
    notFound();
  }

  const request = await getRequest(id);
  const decodedUser = await verifyToken();

  if (!decodedUser) {
    return notFound();
  }

  const loggedUser = {
    name: decodedUser.email,
    role: decodedUser.role as "user" | "admin",
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 mt-2">
      <BackButton text={t("back")} url={backUrl} />
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <AiOutlineCloudUpload className="text-2xl text-gray-900" />
          <h1 className="text-xl font-medium">{t("title")}</h1>
        </div>

        {/* Name */}
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("name")}</h2>
          <p className="text-gray-700">{request.name}</p>
        </div>

        {/* Date */}
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("date")}</h2>
          <p className="text-gray-700">
            {new Date(request.createdAt).toLocaleString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Status */}
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("status")}</h2>
          <StatusBadgeServer
            status={request.status}
            showEstimatedTime={true}
            estimatedTime={request.timeToComplete}
          />
        </div>

        {/* Deliverable Type */}
        {request.deliverable && (
          <div>
            <h2 className="text-lg font-semibold mb-2">{t("deliverable")}</h2>
            <p className="text-gray-700 flex items-center gap-2">
              {request.deliverable.toLowerCase().includes("email") && (
                <MdOutlineEmail className="w-6 h-6 text-blue-500" />
              )}
              {request.deliverable.toLowerCase().includes("drive") && (
                <FaGoogleDrive className="w-6 h-6 text-green-600" />
              )}
              {request.deliverable.toLowerCase().includes("figma") && (
                <FaFigma className="w-6 h-6 text-purple-600" />
              )}
              {request.deliverable}
            </p>
          </div>
        )}

        {/* Figma Design */}
        {request.figmaUrl && (
          <div>
            <h2 className="text-lg font-semibold mb-2">{t("figmaDesign")}</h2>
            <a
              href={request.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
            >
              <FaFigma className="text-purple-600" />
              {t("viewFigma")}
            </a>
          </div>
        )}

        {/* Request */}
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("request")}</h2>
          <div
            className="text-gray-700 max-h-[600px] overflow-y-auto pr-4 [&>h1]:text-[1.875rem] [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-3 [&>h1]:text-gray-900
              [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:text-gray-800
              [&>p]:mb-4 [&>p]:leading-7 [&>p]:text-gray-600
              [&>a]:text-blue-600 [&>a]:underline hover:[&>a]:text-blue-800 [&>a]:transition-colors
              [&>strong]:font-semibold [&>strong]:text-gray-800
              [&>em]:italic
              [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
              [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4
              [&>li]:mb-2 [&>li]:text-gray-600
              [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-4
              scrollbar-hide hover:scrollbar-default"
            dangerouslySetInnerHTML={{ __html: request.request }}
          />
        </div>

        <hr className="border-t border-gray-200" />

        {/* Feedback */}
        <FeedbackList
          feedback={request.feedback}
          requestId={id}
          revalidate={revalidate}
          translations={{
            title: t("feedback.title"),
            noFeedback: t("feedback.noFeedback"),
            you: t("feedback.you"),
          }}
          loggedUser={loggedUser}
        />
      </div>
    </div>
  );
}
