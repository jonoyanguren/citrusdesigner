import prisma from "./prisma";

export async function addNotification({
  userId,
  title,
  message,
  action,
}: {
  userId: string;
  title: string;
  message: string;
  action?: string | null;
}) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      action,
    },
  });
}
