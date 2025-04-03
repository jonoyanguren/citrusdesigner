import { Request, RequestStatus } from "@prisma/client";

export interface RequestWithFeedback extends Omit<Request, "status"> {
  status: RequestStatus;
  timeToComplete: string | null;
  user: {
    id: string;
    name: string;
  };
  feedback: {
    id: string;
    feedback: string;
    createdAt: Date;
    user: {
      name: string;
    };
  }[];
}
