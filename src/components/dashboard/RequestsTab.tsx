import { Request, RequestStatus } from "@prisma/client";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useParams, useRouter } from "next/navigation";
import { RiClipboardLine } from "react-icons/ri";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";

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
  isAdmin?: boolean;
  isLoading?: boolean;
}

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  WORKING: "bg-purple-100 text-purple-800",
  DONE: "bg-green-100 text-green-800",
} as const;

export function RequestsTab({ requests, isAdmin, isLoading }: Props) {
  const router = useRouter();
  const { locale } = useParams();
  const [requestsState, setRequests] = useState(requests);
  const t = useTranslations("dashboard.requests");

  useEffect(() => {
    setRequests(requests);
  }, [requests]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!requests?.length) {
    return (
      <EmptyState
        icon={<RiClipboardLine size={48} />}
        title={t("empty.title")}
        description={t("empty.description")}
        action={
          <Button
            variant="secondary"
            onClick={() => router.push(`/${locale}/dashboard/create-request`)}
          >
            {t("create.submit")}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        {!isAdmin && (
          <Button
            variant="secondary"
            onClick={() => router.push(`/${locale}/dashboard/create-request`)}
          >
            {t("create.submit")}
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{t("detail.name")}</TableHeaderCell>
            <TableHeaderCell>{t("detail.createdAt")}</TableHeaderCell>
            <TableHeaderCell>{t("detail.status")}</TableHeaderCell>
            <TableHeaderCell>{t("detail.estimatedTime")}</TableHeaderCell>
            <TableHeaderCell>{t("detail.feedback.title")}</TableHeaderCell>
            <TableHeaderCell>{t("detail.actions")}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestsState.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.name}</TableCell>
              <TableCell>
                {new Date(request.createdAt).toLocaleDateString(locale)}
              </TableCell>
              <TableCell>
                <div
                  className={`text-sm text-center rounded-full px-2 py-1 ${
                    STATUS_COLORS[request.status]
                  }`}
                >
                  {t(`status.${request.status}`)}
                </div>
              </TableCell>
              <TableCell>
                {request.timeToComplete
                  ? t("detail.estimatedDays", {
                      days: request.timeToComplete,
                    })
                  : t("detail.noEstimate")}
              </TableCell>
              <TableCell>
                {request.feedback && request.feedback.length > 0
                  ? t("detail.feedback.count", {
                      count: request.feedback.length,
                    })
                  : t("detail.feedback.empty")}
              </TableCell>
              <TableCell>
                <Link
                  href={`/${locale}/dashboard/requests/${request.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t("detail.viewDetails")}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
