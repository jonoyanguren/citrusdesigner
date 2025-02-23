import { Request } from "@prisma/client";

export interface RequestWithFeedback extends Request {
  feedback: {
    id: string;
    feedback: string;
    createdAt: Date;
    user: {
      name: string;
    };
  }[];
  seenByAdmin: boolean;
}
