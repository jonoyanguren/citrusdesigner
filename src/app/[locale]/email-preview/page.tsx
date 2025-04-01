import { emailTemplates } from "@/lib/email-templates";

export default function EmailPreviewPage() {
  // Usar datos de ejemplo para la vista previa
  const previewData = {
    userEmail: "usuario@ejemplo.com",
    temporaryPassword: "temp123456",
  };

  const { html } = emailTemplates.generateWelcomeEmail(
    previewData.userEmail,
    previewData.temporaryPassword
  );

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
