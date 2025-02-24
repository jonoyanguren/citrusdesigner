"use client";

import { useState, useRef } from "react";
import { RichText } from "./RichText";
import Button from "./Button";

interface FeedbackFormProps {
  requestId: string;
  revalidate: (formData: FormData) => void;
  path: string;
}

const getImagesFromFeedback = async (feedback: string) => {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const matches = [...feedback.matchAll(regex)];
  return matches.map((match) => match[1]);
};

const uploadImage = async (base64Data: string) => {
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = base64Data;
  });

  canvas.width = img.width;
  canvas.height = img.height;

  ctx?.drawImage(img, 0, 0);

  const jpgBase64 = canvas.toDataURL("image/jpeg", 0.8);

  const response = await fetch(jpgBase64);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  const uploadResponse = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Error uploading image");
  }

  const { url } = await uploadResponse.json();
  return url;
};

export function FeedbackForm({
  requestId,
  revalidate,
  path,
}: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const editorRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Obtener todas las imágenes base64
      const images = await getImagesFromFeedback(feedback);
      let processedFeedback = feedback;

      // Subir cada imagen y reemplazar las URLs en el contenido
      for (const base64Url of images) {
        if (base64Url.startsWith("data:image")) {
          const fileUrl = await uploadImage(base64Url);
          processedFeedback = processedFeedback.replace(base64Url, fileUrl);
        }
      }

      // Enviar el feedback con las nuevas URLs
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
          Añadir Feedback
        </label>
        <RichText
          ref={editorRef}
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
