import { LocaleType, VALID_LOCALES } from "@/types/locale";

type TranslationKey = {
  [key: string]: {
    [key in LocaleType]: string;
  };
};

const baseTemplate = (content: string, locale: LocaleType = "es") => `
<!DOCTYPE html>
<html lang="${locale}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Citrus Designer</title>
    <style>
        body {
            max-width: 800px;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0 auto;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FF6B00;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .highlight {
            background-color: #FFF5E6;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="${
          process.env.NEXT_PUBLIC_URL
        }/logo2.png" alt="Citrus Designer" style="width: 300px;">
    </div>
    <div class="container">
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Citrus Designer. ${
  locale === "en" ? "All rights reserved." : "Todos los derechos reservados."
}</p>
        </div>
    </div>
</body>
</html>
`;

const translations: {
  welcome: TranslationKey;
  subscriptionCancelled: TranslationKey;
  passwordReset: TranslationKey;
  subscriptionConfirmation: TranslationKey;
} = {
  welcome: {
    title: {
      en: "Welcome to Citrus Designer NEW NEW!",
      es: "¡Bienvenido a Citrus Designer NEW NEW!",
    },
    greeting: {
      en: "Thank you for subscribing to our service. We're excited to have you with us.",
      es: "Gracias por suscribirte a nuestro servicio. Estamos emocionados de tenerte con nosotros.",
    },
    accountReady: {
      en: "Your account is ready",
      es: "Tu cuenta está lista",
    },
    credentials: {
      en: "To access your account, use these credentials:",
      es: "Para acceder a tu cuenta, utiliza estas credenciales:",
    },
    email: {
      en: "Email:",
      es: "Email:",
    },
    tempPassword: {
      en: "Temporary password:",
      es: "Contraseña temporal:",
    },
    securityNote: {
      en: "For security, we recommend changing your password the first time you log in.",
      es: "Por seguridad, te recomendamos cambiar tu contraseña la primera vez que inicies sesión.",
    },
    loginButton: {
      en: "Log in",
      es: "Iniciar sesión",
    },
    questions: {
      en: "If you have any questions, don't hesitate to contact us.",
      es: "Si tienes alguna pregunta, no dudes en contactarnos.",
    },
    welcomeMessage: {
      en: "Welcome aboard!",
      es: "¡Bienvenido a bordo!",
    },
  },
  subscriptionCancelled: {
    title: {
      en: "Your subscription has been cancelled",
      es: "Tu suscripción ha sido cancelada",
    },
    message: {
      en: "We have received your subscription cancellation request.",
      es: "Hemos recibido tu solicitud de cancelación de suscripción.",
    },
    details: {
      en: "Important details",
      es: "Detalles importantes",
    },
    activeUntil: {
      en: "Your subscription will remain active until",
      es: "Tu suscripción seguirá activa hasta el",
    },
    continueAccess: {
      en: "Until that date, you can continue using all Citrus Designer services.",
      es: "Hasta esa fecha, podrás seguir utilizando todos los servicios de Citrus Designer.",
    },
    reactivate: {
      en: "If you change your mind, you can reactivate your subscription at any time from your dashboard.",
      es: "Si cambias de opinión, puedes reactivar tu suscripción en cualquier momento desde tu panel de control.",
    },
    dashboardButton: {
      en: "Go to dashboard",
      es: "Ir al panel de control",
    },
    thanks: {
      en: "Thank you for being part of Citrus Designer!",
      es: "¡Gracias por haber sido parte de Citrus Designer!",
    },
  },
  passwordReset: {
    title: {
      en: "Reset your password",
      es: "Restablecer tu contraseña",
    },
    message: {
      en: "We have received a request to reset your account password.",
      es: "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.",
    },
    instructions: {
      en: "Instructions",
      es: "Instrucciones",
    },
    clickButton: {
      en: "Click the button below to create a new password. This link will expire in 24 hours.",
      es: "Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace expirará en 24 horas.",
    },
    resetButton: {
      en: "Reset password",
      es: "Restablecer contraseña",
    },
    ignoreNote: {
      en: "If you didn't request to reset your password, you can ignore this email.",
      es: "Si no solicitaste restablecer tu contraseña, puedes ignorar este email.",
    },
    securityNote: {
      en: "For security, we recommend changing your password regularly.",
      es: "Por seguridad, te recomendamos cambiar tu contraseña regularmente.",
    },
  },
  subscriptionConfirmation: {
    title: {
      en: "Subscription Confirmation",
      es: "Confirmación de Suscripción",
    },
    greeting: {
      en: "Thank you for subscribing to Citrus Designer!",
      es: "¡Gracias por suscribirte a Citrus Designer!",
    },
    confirmation: {
      en: "Your subscription has been successfully activated.",
      es: "Tu suscripción ha sido activada exitosamente.",
    },
    access: {
      en: "You now have full access to all our features and services.",
      es: "Ahora tienes acceso completo a todas nuestras características y servicios.",
    },
    dashboardButton: {
      en: "Go to Dashboard",
      es: "Ir al Panel de Control",
    },
    support: {
      en: "If you need any assistance, our support team is here to help.",
      es: "Si necesitas ayuda, nuestro equipo de soporte está aquí para ayudarte.",
    },
    thanks: {
      en: "Thank you for choosing Citrus Designer!",
      es: "¡Gracias por elegir Citrus Designer!",
    },
  },
};

// Funciones para generar los templates HTML y texto
export const emailTemplates = {
  async generateWelcomeEmail({
    userEmail,
    temporaryPassword,
    locale = "es",
  }: {
    userEmail: string;
    temporaryPassword: string;
    locale?: LocaleType;
  }) {
    const t = translations.welcome;
    //Check valid locale
    if (!VALID_LOCALES.includes(locale)) {
      locale = "es";
    }

    const html = baseTemplate(
      `
      <h2>${t.title[locale]}</h2>
      <p>${t.greeting[locale]}</p>
      
      <div class="highlight">
        <h3>${t.accountReady[locale]}</h3>
        <p>${t.credentials[locale]}</p>
        <p><strong>${t.email[locale]}</strong> ${userEmail}</p>
        <p><strong>${t.tempPassword[locale]}</strong> ${temporaryPassword}</p>
      </div>
      
      <p>${t.securityNote[locale]}</p>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/${locale}/auth/login" class="button">${t.loginButton[locale]}</a>
      </p>
      
      <p>${t.questions[locale]}</p>
      <p>${t.welcomeMessage[locale]}</p>
    `,
      locale
    );

    const text = `${t.title[locale]}

    ${t.greeting[locale]}

    ${t.accountReady[locale]}
    ${t.credentials[locale]}
    ${t.email[locale]} ${userEmail}
    ${t.tempPassword[locale]} ${temporaryPassword}

    ${t.securityNote[locale]}

    ${t.loginButton[locale]}: ${process.env.NEXT_PUBLIC_URL}/auth/login

    ${t.questions[locale]}
    ${t.welcomeMessage[locale]}`;

    return { html, text, subject: t.title[locale] };
  },

  async generateSubscriptionCancelledEmail({
    endDate,
    locale = "es",
  }: {
    endDate: Date;
    locale?: LocaleType;
  }) {
    //Check valid locale
    if (!VALID_LOCALES.includes(locale)) {
      locale = "es";
    }

    const t = translations.subscriptionCancelled;
    const formattedDate = endDate.toLocaleDateString(
      locale === "en" ? "en-US" : "es-ES",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const html = baseTemplate(
      `
      <h2>${t.title[locale]}</h2>
      <p>${t.message[locale]}</p>
      
      <div class="highlight">
        <h3>${t.details[locale]}</h3>
        <p>${t.activeUntil[locale]} <strong>${formattedDate}</strong>.</p>
        <p>${t.continueAccess[locale]}</p>
      </div>
      
      <p>${t.reactivate[locale]}</p>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" class="button">${t.dashboardButton[locale]}</a>
      </p>
      
      <p>${t.thanks[locale]}</p>
    `,
      locale
    );

    const text = `${t.title[locale]}

    ${t.message[locale]}

    ${t.details[locale]}:
    ${t.activeUntil[locale]} ${formattedDate}.
    ${t.continueAccess[locale]}

    ${t.reactivate[locale]}

    ${t.dashboardButton[locale]}: ${process.env.NEXT_PUBLIC_URL}/dashboard

    ${t.thanks[locale]}`;

    return { html, text, subject: t.title[locale] };
  },

  async generatePasswordResetEmail({
    resetToken,
    locale = "es",
  }: {
    resetToken: string;
    locale?: LocaleType;
  }) {
    //Check valid locale
    if (!VALID_LOCALES.includes(locale)) {
      locale = "es";
    }

    const t = translations.passwordReset;
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/${locale}/auth/reset-password?token=${resetToken}`;

    const html = baseTemplate(
      `
      <h2>${t.title[locale]}</h2>
      <p>${t.message[locale]}</p>
      
      <div class="highlight">
        <h3>${t.instructions[locale]}</h3>
        <p>${t.clickButton[locale]}</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">${t.resetButton[locale]}</a>
      </p>
      
      <p>${t.ignoreNote[locale]}</p>
      <p>${t.securityNote[locale]}</p>
    `,
      locale
    );

    const text = `${t.title[locale]}

    ${t.message[locale]}

    ${t.instructions[locale]}:
    ${t.clickButton[locale]}

    ${t.resetButton[locale]}: ${resetUrl}

    ${t.ignoreNote[locale]}
    ${t.securityNote[locale]}`;

    return { html, text, subject: t.title[locale] };
  },

  async generateSubscriptionConfirmationEmail({
    userEmail,
    locale = "es",
  }: {
    userEmail: string;
    locale?: LocaleType;
  }) {
    const t = translations.subscriptionConfirmation;
    if (!VALID_LOCALES.includes(locale)) {
      locale = "es";
    }

    const html = baseTemplate(
      `
      <h2>${t.title[locale]}</h2>
      <p>${t.greeting[locale]} ${userEmail}</p>
      
      <div class="highlight">
        <p>${t.confirmation[locale]}</p>
        <p>${t.access[locale]}</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/${locale}/dashboard" class="button">${t.dashboardButton[locale]}</a>
      </p>
      
      <p>${t.support[locale]}</p>
      <p>${t.thanks[locale]}</p>
    `,
      locale
    );

    const text = `${t.title[locale]}

${t.greeting[locale]} ${userEmail}

${t.confirmation[locale]}
${t.access[locale]}

${t.dashboardButton[locale]}: ${process.env.NEXT_PUBLIC_URL}/${locale}/dashboard

${t.support[locale]}
${t.thanks[locale]}`;

    return {
      html,
      text,
      subject: t.title[locale],
    };
  },
};
