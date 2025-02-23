"use client";

import { useState } from "react";
import { RichText } from "./RichText";
import Button from "./Button";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/requests/${requestId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el feedback");
      }

      setFeedback("");

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
          Añadir Feedback
        </label>
        <RichText
          initialContent=""
          onChange={(content) => setFeedback(content)}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar Feedback"}
      </Button>
    </form>
  );
}
