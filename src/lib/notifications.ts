import prisma from "./prisma";

type NotificationTypes =
  | "REQUEST_CREATED_BY_USER"
  | "REQUEST_CREATED_BY_ADMIN"
  | "REQUEST_STATUS_UPDATED"
  | "REQUEST_FEEDBACK_PROVIDED";

export async function addNotification({
  userId,
  action,
  metadata,
  type,
}: {
  userId: string;
  type: NotificationTypes;
  action?: string | null;
  metadata?: string | null;
}) {
  return await prisma.notification.create({
    data: {
      userId,
      action,
      metadata: metadata || "",
      type,
    },
  });
}
