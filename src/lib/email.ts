import * as SibApiV3Sdk from "@sendinblue/client";

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

interface SendinblueError {
  response?: {
    body: unknown;
  };
}

export async function sendEmail({ to, subject, text, html }: EmailData) {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = {
      name: "Citrus Designer NEW NEW",
      email: process.env.SENDINBLUE_SENDER_EMAIL,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: data.body.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    const sendinblueError = error as SendinblueError;
    if (sendinblueError.response) {
      console.error(
        "❌ Sendinblue error response:",
        JSON.stringify(sendinblueError.response.body, null, 2)
      );
    }
    throw error;
  }
}
