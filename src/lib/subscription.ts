import prisma from "./prisma";

export async function checkActiveSubscription(
  userId: string
): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: {
        in: ["active", "ENDING_AT_PERIOD_END"],
      },
      updatedAt: {
        gt: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });

  const manualSubscription = await prisma.manualSubscription.findFirst({
    where: {
      userId: userId,
      status: "active",
    },
  });

  console.log("subscription IN FUNCTION", subscription);
  console.log("manualSubscription IN FUNCTION", manualSubscription);

  return !!subscription || !!manualSubscription;
}
