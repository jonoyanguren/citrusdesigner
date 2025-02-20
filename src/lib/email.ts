import * as SibApiV3Sdk from "@sendinblue/client";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY
);

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailData) {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html || text;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = {
      name: "Citrus Designer",
      email: process.env.SENDINBLUE_SENDER_EMAIL,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent:", data);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
