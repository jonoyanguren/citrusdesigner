"use client";

import { useState, useRef } from "react";
import { RichText } from "./RichText";
import Button from "./Button";
import { processContentWithImages } from "@/lib/utils/imageProcessing";
import { useTranslations } from "next-intl";
import { RichTextHandle } from "./RichText";

interface FeedbackFormProps {
  requestId: string;
  revalidate: (formData: FormData) => void;
  path: string;
}

export function FeedbackForm({
  requestId,
  revalidate,
  path,
}: FeedbackFormProps) {
  const t = useTranslations("dashboard.requestDetail");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const editorRef = useRef<RichTextHandle>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const processedFeedback = await processContentWithImages(feedback);

      const response = await fetch(`/api/requests/${requestId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          feedback: processedFeedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el feedback");
      }

      setFeedback("");
      editorRef.current?.clearContent();

      const formData = new FormData();
      formData.append("path", path);
      revalidate(formData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("addFeedback")}
        </label>
        <RichText
          ref={editorRef}
          initialContent=""
          onChange={(content) => setFeedback(content)}
        />
      </div>
      <Button variant="secondary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("sending") : t("sendFeedback")}
      </Button>
    </form>
  );
}
