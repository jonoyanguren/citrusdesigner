import prisma from "./prisma";

export async function addNotification(
  userId: string,
  title: string,
  message: string
) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
}
