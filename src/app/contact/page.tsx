"use client";
import Button from "@/components/Button";
import { useEffect, useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch("/api/contact");
      const data = await response.json();
      console.log("Contacts:", data);
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      console.log("Form submission started");
      console.log("Form data:", formData);

      // Verificar que la ruta es correcta
      const apiUrl = "/api/contact";
      console.log("Sending request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Agregar un header personalizado para debug
          "X-Debug": "true",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      // Intentar leer el cuerpo de la respuesta
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("Invalid JSON response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <main className="max-w-2xl w-full mt-16">
        <h1 className="text-3xl font-bold mb-8">Contacto</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded border border-foreground/20 bg-background"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded border border-foreground/20 bg-background"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded border border-foreground/20 bg-background"
              required
            ></textarea>
          </div>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" ? "Enviando..." : "Enviar mensaje"}
          </Button>

          {status === "success" && (
            <p className="text-green-500 text-center">
              ¡Mensaje enviado con éxito!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-500 text-center">
              Error al enviar el mensaje. Por favor, intenta nuevamente.
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
