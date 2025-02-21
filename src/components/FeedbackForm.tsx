"use client";

import { useState } from "react";
import Textarea from "./Textarea";

interface FeedbackFormProps {
  requestId: string;
  revalidate: (formData: FormData) => Promise<void>;
  path: string;
}

export function FeedbackForm({
  requestId,
  revalidate,
  path,
}: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/requests/${requestId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) throw new Error("Error al enviar el feedback");

      setFeedback("");

      const formData = new FormData();
      formData.set("path", path);
      await revalidate(formData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Textarea
        label="Añadir feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Escribe tu feedback aquí..."
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting || !feedback.trim()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enviando..." : "Enviar feedback"}
      </button>
    </form>
  );
}
