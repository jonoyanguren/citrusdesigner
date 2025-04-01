"use client";
import { emailTemplates } from "@/lib/email-templates";
import { LocaleType } from "@/types/locale";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailPreviewPage() {
  const [html, setHtml] = useState<string>("");
  const { locale } = useParams();

  const previewData = {
    userEmail: "usuario@ejemplo.com",
    temporaryPassword: "temp123456",
  };

  useEffect(() => {
    const generateEmail = async () => {
      const { html } = await emailTemplates.generateWelcomeEmail({
        userEmail: previewData.userEmail,
        temporaryPassword: previewData.temporaryPassword,
        locale: locale as LocaleType,
      });
      setHtml(html);
    };

    generateEmail();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vista previa de Email</h1>
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
