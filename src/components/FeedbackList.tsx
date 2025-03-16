import { Suspense } from "react";
import { FeedbackForm } from "./FeedbackForm";
import { AiFillAccountBook } from "react-icons/ai";
import { IoChatbubblesOutline } from "react-icons/io5";

type Feedback = {
  id: string;
  feedback: string;
  createdAt: Date;
  user: {
    name: string;
    role: "user" | "admin";
    email: string;
  };
};

interface FeedbackListProps {
  feedback: Feedback[];
  requestId: string;
  revalidate: (formData: FormData) => void;
  translations: {
    title: string;
    noFeedback: string;
    you: string;
  };
  loggedUser: {
    name: string;
    role: "user" | "admin";
  };
}

export function FeedbackList({
  feedback,
  requestId,
  revalidate,
  translations,
  loggedUser,
}: FeedbackListProps) {
  return (
    <div>
      <div className="flex flex-row gap-2 items-center mb-4">
        <IoChatbubblesOutline size={20} />
        <h2 className="text-lg font-medium">{translations.title}</h2>
      </div>

      {feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map((fb: Feedback) => {
            const isOwnMessage = fb.user.email === loggedUser.name;
            const initials = isOwnMessage
              ? translations.you
              : fb.user.name.slice(0, 2).toUpperCase();

            return (
              <div
                key={fb.id}
                className={`flex flex-col gap-2 min-w-[300px] ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                <div className="w-[60%]">
                  <div
                    className={`flex flex-row gap-2 items-center ${
                      isOwnMessage ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                        isOwnMessage ? "bg-blue-600" : "bg-gray-800"
                      }`}
                    >
                      {initials}
                    </div>

                    {/* Feedback */}
                    <div
                      className={`p-4 rounded-lg ${
                        isOwnMessage ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className="max-h-[400px] overflow-y-auto pr-4 [&>h1]:text-[1.875rem] [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-3 [&>h1]:text-gray-900
                    [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:text-gray-800
                    [&>p]:leading-7 [&>p]:text-gray-600
                    [&>a]:text-blue-600 [&>a]:underline hover:[&>a]:text-blue-800 [&>a]:transition-colors
                    [&>strong]:font-semibold [&>strong]:text-gray-800
                    [&>em]:italic
                    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
                    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4
                    [&>li]:mb-2 [&>li]:text-gray-600
                    scrollbar-hide hover:scrollbar-default"
                        dangerouslySetInnerHTML={{ __html: fb.feedback }}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <span
                    className={`text-xs text-gray-500 block mt-1 ${
                      isOwnMessage ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date(fb.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">{translations.noFeedback}</p>
      )}

      <Suspense>
        <FeedbackForm
          requestId={requestId}
          revalidate={revalidate}
          path={`/dashboard/requests/${requestId}`}
        />
      </Suspense>
    </div>
  );
}
