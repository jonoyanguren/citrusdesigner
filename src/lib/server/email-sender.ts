import * as SibApiV3Sdk from "@sendinblue/client";
import { emailTemplates } from "../email-templates";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY || ""
);

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendEmail({ to, subject, text, html }: EmailData) {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = {
      name: "Citrus Designer",
      email: process.env.SENDINBLUE_SENDER_EMAIL,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.info("Email sent:", data);
    return { success: true, messageId: data.body.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export const emailSender = {
  async sendWelcomeEmail(userEmail: string, temporaryPassword: string) {
    const { html, text } = emailTemplates.generateWelcomeEmail(
      userEmail,
      temporaryPassword
    );
    return sendEmail({
      to: userEmail,
      subject: "¡Bienvenido a Citrus Designer!",
      text,
      html,
    });
  },

  async sendSubscriptionCancelledEmail(userEmail: string, endDate: Date) {
    const { html, text } = emailTemplates.generateSubscriptionCancelledEmail(
      userEmail,
      endDate
    );
    return sendEmail({
      to: userEmail,
      subject: "Tu suscripción ha sido cancelada",
      text,
      html,
    });
  },

  async sendPasswordResetEmail(userEmail: string, resetToken: string) {
    const { html, text } = emailTemplates.generatePasswordResetEmail(
      userEmail,
      resetToken
    );
    return sendEmail({
      to: userEmail,
      subject: "Restablecer tu contraseña - Citrus Designer",
      text,
      html,
    });
  },
};
