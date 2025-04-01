import { LocaleType, VALID_LOCALES } from "@/types/locale";

type TranslationKey = {
  [key: string]:
    | {
        [key in LocaleType]: string;
      }
    | {
        [key in LocaleType]: string;
      };
};

const translations: {
  welcome: TranslationKey;
  subscriptionCancelled: TranslationKey;
  passwordReset: TranslationKey;
  subscriptionConfirmation: TranslationKey;
  footer: TranslationKey;
} = {
  welcome: {
    title: {
      en: "👋 Welcome to Citrus Designer!",
      es: "👋 ¡Bienvenido a Citrus Designer!",
      de: "👋 Willkommen bei Citrus Designer!",
      jp: "👋 Citrus Designerへようこそ！",
    },
    greeting: {
      en: "Thank you for subscribing to our service. We're excited to have you with us.",
      es: "Gracias por suscribirte a nuestro servicio. Estamos emocionados de tenerte con nosotros.",
      de: "Vielen Dank für Ihr Abonnement. Wir freuen uns, Sie bei uns zu haben.",
      jp: "ご登録ありがとうございます。私たちと一緒に過ごせることを嬉しく思います。",
    },
    accountReady: {
      en: "To access for the first time, use these credentials:",
      es: "Para acceder por primera ver, utiliza estas credenciales.",
      de: "Um erstmalig zuzugreifen, verwenden Sie diese Anmeldedaten:",
      jp: "初回アクセスには、以下の認証情報を使用してください：",
    },
    credentials: {
      en: "To access your account, use these credentials:",
      es: "Para acceder a tu cuenta, utiliza estas credenciales:",
      de: "Um auf Ihr Konto zuzugreifen, verwenden Sie diese Anmeldedaten:",
      jp: "アカウントにアクセスするには、以下の認証情報を使用してください：",
    },
    email: {
      en: "Email:",
      es: "Email:",
      de: "E-Mail:",
      jp: "メールアドレス：",
    },
    tempPassword: {
      en: "Temporary password:",
      es: "Contraseña temporal:",
      de: "Temporäres Passwort:",
      jp: "一時パスワード：",
    },
    securityNote: {
      en: "For security, you will be asked to change your password the first time you log in.",
      es: "Por seguridad, te pedirá cambiar tu contraseña la primera vez que inicies sesión.",
      de: "Aus Sicherheitsgründen werden Sie beim ersten Login aufgefordert, Ihr Passwort zu ändern.",
      jp: "セキュリティのため、初回ログイン時にパスワードの変更を求められます。",
    },
    loginButton: {
      en: "Log in",
      es: "Iniciar sesión",
      de: "Anmelden",
      jp: "ログイン",
    },
  },
  subscriptionCancelled: {
    title: {
      en: "Your subscription has been cancelled",
      es: "Tu suscripción ha sido cancelada",
      de: "Ihr Abonnement wurde gekündigt",
      jp: "サブスクリプションがキャンセルされました",
    },
    message: {
      en: "We have received your subscription cancellation request.",
      es: "Hemos recibido tu solicitud de cancelación de suscripción.",
      de: "Wir haben Ihre Kündigungsanfrage erhalten.",
      jp: "サブスクリプションのキャンセルリクエストを受け付けました。",
    },
    details: {
      en: "Important details",
      es: "Detalles importantes",
      de: "Wichtige Details",
      jp: "重要な詳細",
    },
    activeUntil: {
      en: "Your subscription will remain active until",
      es: "Tu suscripción seguirá activa hasta el",
      de: "Ihr Abonnement bleibt aktiv bis zum",
      jp: "サブスクリプションは以下の日付まで有効です：",
    },
    continueAccess: {
      en: "Until that date, you can continue using all Citrus Designer services.",
      es: "Hasta esa fecha, podrás seguir utilizando todos los servicios de Citrus Designer.",
      de: "Bis zu diesem Datum können Sie alle Citrus Designer-Dienste weiterhin nutzen.",
      jp: "その日付までは、Citrus Designerのすべてのサービスを引き続きご利用いただけます。",
    },
    reactivate: {
      en: "If you change your mind, you can reactivate your subscription at any time from your dashboard.",
      es: "Si cambias de opinión, puedes reactivar tu suscripción en cualquier momento desde tu panel de control.",
      de: "Wenn Sie sich anders entscheiden, können Sie Ihr Abonnement jederzeit über Ihr Dashboard wieder aktivieren.",
      jp: "気が変わった場合は、ダッシュボードからいつでもサブスクリプションを再開できます。",
    },
    dashboardButton: {
      en: "Go to dashboard",
      es: "Ir al panel de control",
      de: "Zum Dashboard",
      jp: "ダッシュボードへ",
    },
    thanks: {
      en: "Thank you for being part of Citrus Designer!",
      es: "¡Gracias por haber sido parte de Citrus Designer!",
      de: "Vielen Dank, dass Sie Teil von Citrus Designer waren!",
      jp: "Citrus Designerをご利用いただき、ありがとうございました！",
    },
  },
  passwordReset: {
    title: {
      en: "Reset your password",
      es: "Restablecer tu contraseña",
      de: "Passwort zurücksetzen",
      jp: "パスワードのリセット",
    },
    message: {
      en: "We have received a request to reset your account password.",
      es: "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.",
      de: "Wir haben eine Anfrage zum Zurücksetzen Ihres Kontopassworts erhalten.",
      jp: "アカウントのパスワードリセットリクエストを受け付けました。",
    },
    resetText: {
      en: "If the button doesn't work, you can reset your password by clicking the following link.",
      es: "Si el botón no funciona, puedes restablecer tu contraseña pinchando en el siguiente enlace.",
      de: "Wenn der Button nicht funktioniert, können Sie Ihr Passwort über den folgenden Link zurücksetzen.",
      jp: "ボタンが機能しない場合は、以下のリンクをクリックしてパスワードをリセットできます。",
    },
    resetLink: {
      en: "Reset password",
      es: "Restablecer contraseña",
      de: "Passwort zurücksetzen",
      jp: "パスワードをリセット",
    },
    clickButton: {
      en: "Click the button below to create a new password. This link will expire in 24 hours.",
      es: "Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace expirará en 24 horas.",
      de: "Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen. Dieser Link ist 24 Stunden gültig.",
      jp: "新しいパスワードを作成するには、下のボタンをクリックしてください。このリンクは24時間で期限切れになります。",
    },
    resetButton: {
      en: "Reset password",
      es: "Restablecer contraseña",
      de: "Passwort zurücksetzen",
      jp: "パスワードをリセット",
    },
    ignoreNote: {
      en: "If you didn't request to reset your password, you can ignore this email.",
      es: "Si no solicitaste restablecer tu contraseña, puedes ignorar este email.",
      de: "Wenn Sie kein Zurücksetzen des Passworts angefordert haben, können Sie diese E-Mail ignorieren.",
      jp: "パスワードのリセットを要求していない場合は、このメールを無視してください。",
    },
    securityNote: {
      en: "For security, we recommend changing your password regularly.",
      es: "Por seguridad, te recomendamos cambiar tu contraseña regularmente.",
      de: "Aus Sicherheitsgründen empfehlen wir, Ihr Passwort regelmäßig zu ändern.",
      jp: "セキュリティのため、定期的なパスワードの変更をお勧めします。",
    },
  },
  subscriptionConfirmation: {
    title: {
      en: "Subscription Confirmation",
      es: "Confirmación de Suscripción",
      de: "Abonnement-Bestätigung",
      jp: "サブスクリプション確認",
    },
    greeting: {
      en: "Thank you for subscribing to Citrus Designer!",
      es: "¡Gracias por suscribirte a Citrus Designer!",
      de: "Vielen Dank für Ihr Abonnement bei Citrus Designer!",
      jp: "Citrus Designerへのご登録ありがとうございます！",
    },
    confirmation: {
      en: "Your subscription has been successfully activated.",
      es: "Tu suscripción ha sido activada exitosamente.",
      de: "Ihr Abonnement wurde erfolgreich aktiviert.",
      jp: "サブスクリプションが正常に有効化されました。",
    },
    access: {
      en: "You now have full access to all our features and services.",
      es: "Ahora tienes acceso completo a todas nuestras características y servicios.",
      de: "Sie haben nun vollen Zugriff auf alle unsere Funktionen und Dienste.",
      jp: "すべての機能とサービスに完全にアクセスできるようになりました。",
    },
    dashboardButton: {
      en: "Go to Dashboard",
      es: "Ir al Panel de Control",
      de: "Zum Dashboard",
      jp: "ダッシュボードへ",
    },
    support: {
      en: "If you need any assistance, our support team is here to help.",
      es: "Si necesitas ayuda, nuestro equipo de soporte está aquí para ayudarte.",
      de: "Wenn Sie Hilfe benötigen, steht Ihnen unser Support-Team zur Verfügung.",
      jp: "サポートが必要な場合は、サポートチームがお手伝いいたします。",
    },
    thanks: {
      en: "Thank you for choosing Citrus Designer!",
      es: "¡Gracias por elegir Citrus Designer!",
      de: "Vielen Dank, dass Sie sich für Citrus Designer entschieden haben!",
      jp: "Citrus Designerをお選びいただき、ありがとうございます！",
    },
  },
  footer: {
    title: {
      en: "A hug,",
      es: "Un abrazo,",
      de: "Mit freundlichen Grüßen,",
      jp: "敬具、",
    },
    text: {
      en: "The Citrus Designer team. 🍋",
      es: "🍋 el equipo de Citrus Designer.",
      de: "Das Citrus Designer Team. 🍋",
      jp: "🍋 Citrus Designerチーム",
    },
    contact: {
      en: "If you have any questions or doubts, don't hesitate to contact us. We'll be happy to help you.",
      es: "Si tienes cualquier pregunta o duda, no dudes en contactarnos. Estaremos encantados de ayudarte.",
      de: "Bei Fragen oder Unklarheiten zögern Sie nicht, uns zu kontaktieren. Wir helfen Ihnen gerne weiter.",
      jp: "ご質問やご不明な点がございましたら、お気軽にお問い合わせください。喜んでお手伝いさせていただきます。",
    },
  },
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
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            width: 100%;
        }
        .header {
            color: white;
            padding: 20px;
            text-align: center;
            width: 100%;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            text-align: left;
        }
        .footer {
            padding: 20px;
            width: 100%;
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
            background-color: #ffedd5;
            border: 2px solid #ff6600;
            margin: 20px 0;
            padding: 15px;
            border-radius: 16px;
            max-width: 90%;
            text-align: center;

        }
        .separator {
            border: 0;
            height: 1px;
            margin: 16px 0;
            background-color: #e0e0e0;
        }
        h2, h3 {
            margin: 0 auto;
        }
        p {
            margin: 10px auto;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="${process.env.NEXT_PUBLIC_URL}/logo2.png" alt="Citrus Designer" style="width: 300px;">
    </div>
    <div class="container">
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>${translations.footer.title[locale]}</p>
            <p>${translations.footer.text[locale]}</p>
            <hr class="separator"/>
            <p>${translations.footer.contact[locale]}</p>
        </div>
    </div>
</body>
</html>
`;

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
      
      <p>${t.credentials[locale]}</p>
      <div class="highlight">
        <p><strong>${t.email[locale]}</strong> ${userEmail}</p>
        <p><strong>${t.tempPassword[locale]}</strong> ${temporaryPassword}</p>
      </div>
      
      <p>${t.securityNote[locale]}</p>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/${locale}/auth/login" class="button">${t.loginButton[locale]}</a>
      </p>
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
    `;

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
        <p>${t.activeUntil[locale]} <strong>${formattedDate}</strong>.</p>
      </div>
        <p>${t.continueAccess[locale]}</p>
      
      <p>${t.reactivate[locale]}</p>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/${locale}/dashboard" class="button">${t.dashboardButton[locale]}</a>
      </p>
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
    `;

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
        <p>${t.clickButton[locale]}</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">${t.resetButton[locale]}</a>
      </p>

      <p>${t.resetText[locale]}</p>
      <a href="${resetUrl}">${t.resetLink[locale]}</a>
      
      <p>${t.ignoreNote[locale]}</p>
      <p>${t.securityNote[locale]}</p>
    `,
      locale
    );

    const text = `${t.title[locale]}

    ${t.message[locale]}

    ${t.clickButton[locale]}

    ${t.resetButton[locale]}: ${resetUrl}

    ${t.resetText[locale]}

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
        <p>${t.access[locale]}</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/${locale}/dashboard" class="button">${t.dashboardButton[locale]}</a>
      </p>
    `,
      locale
    );

    const text = `${t.title[locale]}

    ${t.greeting[locale]} ${userEmail}

    ${t.confirmation[locale]}
    ${t.access[locale]}

    ${t.dashboardButton[locale]}: ${process.env.NEXT_PUBLIC_URL}/${locale}/dashboard

    `;

    return {
      html,
      text,
      subject: t.title[locale],
    };
  },
};
