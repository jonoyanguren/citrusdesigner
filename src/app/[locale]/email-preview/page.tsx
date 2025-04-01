"use client";
import { emailTemplates } from "@/lib/email-templates";
import { LocaleType } from "@/types/locale";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type EmailTemplateType =
  | "welcome"
  | "subscriptionCancelled"
  | "passwordReset"
  | "subscriptionConfirmation";

export default function EmailPreviewPage() {
  const [html, setHtml] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplateType>("welcome");
  const { locale } = useParams();

  const previewData = {
    userEmail: "usuario@ejemplo.com",
    temporaryPassword: "temp123456",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    resetToken: "example-reset-token",
  };

  useEffect(() => {
    const generateEmail = async () => {
      let emailContent;
      switch (selectedTemplate) {
        case "welcome":
          emailContent = await emailTemplates.generateWelcomeEmail({
            userEmail: previewData.userEmail,
            temporaryPassword: previewData.temporaryPassword,
            locale: locale as LocaleType,
          });
          break;
        case "subscriptionCancelled":
          emailContent =
            await emailTemplates.generateSubscriptionCancelledEmail({
              endDate: previewData.endDate,
              locale: locale as LocaleType,
            });
          break;
        case "passwordReset":
          emailContent = await emailTemplates.generatePasswordResetEmail({
            resetToken: previewData.resetToken,
            locale: locale as LocaleType,
          });
          break;
        case "subscriptionConfirmation":
          emailContent =
            await emailTemplates.generateSubscriptionConfirmationEmail({
              userEmail: previewData.userEmail,
              locale: locale as LocaleType,
            });
          break;
      }
      setHtml(emailContent.html);
    };

    generateEmail();
  }, [
    selectedTemplate,
    locale,
    previewData.userEmail,
    previewData.temporaryPassword,
    previewData.endDate,
    previewData.resetToken,
  ]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Vista previa de Email</h1>
        <select
          value={selectedTemplate}
          onChange={(e) =>
            setSelectedTemplate(e.target.value as EmailTemplateType)
          }
          className="px-4 py-2 border rounded-md"
        >
          <option value="welcome">Email de Bienvenida</option>
          <option value="subscriptionCancelled">
            Cancelación de Suscripción
          </option>
          <option value="passwordReset">Restablecer Contraseña</option>
          <option value="subscriptionConfirmation">
            Confirmación de Suscripción
          </option>
        </select>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <iframe
          srcDoc={html}
          className="w-full h-[800px] border-0"
          title="Email Preview"
        />
      </div>
    </div>
  );
}
