"use client";
import Button from "@/components/Button";
import { useEffect, useState } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) {
          throw new Error("Error al cargar los contactos");
        }
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleSendEmail = async (contact: Contact) => {
    try {
      setSendingEmail(contact.id);
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: contact.email,
          subject: `RE: Tu mensaje en Citrus Designer`,
          text: `Hola ${contact.name},\n\nGracias por tu mensaje. En respuesta a:\n\n"${contact.message}"\n\nNos pondremos en contacto contigo pronto.\n\nSaludos,\nEquipo de Citrus Designer`,
          html: `
            <h2>Hola ${contact.name}</h2>
            <p>Gracias por tu mensaje. En respuesta a:</p>
            <blockquote style="border-left: 2px solid #ccc; padding-left: 1rem; margin: 1rem 0;">
              ${contact.message}
            </blockquote>
            <p>Nos pondremos en contacto contigo pronto.</p>
            <p>Saludos,<br>Equipo de Citrus Designer</p>
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el email");
      }

      console.info("Email enviado correctamente");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSendingEmail(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando contactos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <main className="max-w-4xl w-full mt-16">
        <h1 className="text-3xl font-bold mb-8">Lista de Contactos</h1>
        <div className="grid gap-4">
          {contacts.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay contactos registrados
            </p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="border border-foreground/20 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{contact.name}</h2>
                  <span className="text-sm text-foreground/60">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-foreground/80 mb-2">{contact.email}</p>
                <p className="text-foreground/80 whitespace-pre-wrap mb-4">
                  {contact.message}
                </p>
                <Button
                  onClick={() => handleSendEmail(contact)}
                  disabled={sendingEmail === contact.id}
                >
                  {sendingEmail === contact.id
                    ? "Enviando..."
                    : "Responder email"}
                </Button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
