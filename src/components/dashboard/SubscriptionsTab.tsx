import { Subscription } from "@prisma/client";
import { SubscriptionCard } from "@/components/SubscriptionCard";

interface Props {
  subscriptions: (Subscription & {
    stripeSubscription?: {
      status: string;
      current_period_end: string;
      current_period_start: string;
    };
  })[];
}

export function SubscriptionsTab({ subscriptions }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
