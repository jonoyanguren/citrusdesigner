import prisma from "./prisma";

export async function checkActiveSubscription(
  userId: string
): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: "active",
      updatedAt: {
        gt: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });

  return !!subscription;
}
