import { sendEmail } from "./email";

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Citrus Designer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #FF6B00;
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
        <h1>Citrus Designer</h1>
    </div>
    <div class="container">
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Citrus Designer. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
`;

export const emailTemplates = {
  // Email de bienvenida con contraseña temporal
  async sendWelcomeEmail(userEmail: string, temporaryPassword: string) {
    const html = baseTemplate(`
      <h2>¡Bienvenido a Citrus Designer!</h2>
      <p>Gracias por suscribirte a nuestro servicio. Estamos emocionados de tenerte con nosotros.</p>
      
      <div class="highlight">
        <h3>Tu cuenta está lista</h3>
        <p>Para acceder a tu cuenta, utiliza estas credenciales:</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Contraseña temporal:</strong> ${temporaryPassword}</p>
      </div>
      
      <p>Por seguridad, te recomendamos cambiar tu contraseña la primera vez que inicies sesión.</p>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/auth/login" class="button">Iniciar sesión</a>
      </p>
      
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <p>¡Bienvenido a bordo!</p>
    `);

    const text = `¡Bienvenido a Citrus Designer!

Gracias por suscribirte a nuestro servicio. Estamos emocionados de tenerte con nosotros.

Tu cuenta está lista
Para acceder a tu cuenta, utiliza estas credenciales:
Email: ${userEmail}
Contraseña temporal: ${temporaryPassword}

Por seguridad, te recomendamos cambiar tu contraseña la primera vez que inicies sesión.

Inicia sesión aquí: ${process.env.NEXT_PUBLIC_URL}/auth/login

Si tienes alguna pregunta, no dudes en contactarnos.
¡Bienvenido a bordo!`;

    return sendEmail({
      to: userEmail,
      subject: "¡Bienvenido a Citrus Designer!",
      text,
      html,
    });
  },

  // Email de cancelación de suscripción
  async sendSubscriptionCancelledEmail(userEmail: string, endDate: Date) {
    const formattedDate = endDate.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = baseTemplate(`
      <h2>Tu suscripción ha sido cancelada</h2>
      <p>Hemos recibido tu solicitud de cancelación de suscripción.</p>
      
      <div class="highlight">
        <h3>Detalles importantes</h3>
        <p>Tu suscripción seguirá activa hasta el <strong>${formattedDate}</strong>.</p>
        <p>Hasta esa fecha, podrás seguir utilizando todos los servicios de Citrus Designer.</p>
      </div>
      
      <p>Si cambias de opinión, puedes reactivar tu suscripción en cualquier momento desde tu panel de control.</p>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" class="button">Ir al panel de control</a>
      </p>
      
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <p>¡Gracias por haber sido parte de Citrus Designer!</p>
    `);

    const text = `Tu suscripción ha sido cancelada

Hemos recibido tu solicitud de cancelación de suscripción.

Detalles importantes:
Tu suscripción seguirá activa hasta el ${formattedDate}.
Hasta esa fecha, podrás seguir utilizando todos los servicios de Citrus Designer.

Si cambias de opinión, puedes reactivar tu suscripción en cualquier momento desde tu panel de control.

Accede a tu panel de control aquí: ${process.env.NEXT_PUBLIC_URL}/dashboard

Si tienes alguna pregunta, no dudes en contactarnos.
¡Gracias por haber sido parte de Citrus Designer!`;

    return sendEmail({
      to: userEmail,
      subject: "Tu suscripción ha sido cancelada",
      text,
      html,
    });
  },

  // Email de reset de contraseña
  async sendPasswordResetEmail(userEmail: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${resetToken}`;

    const html = baseTemplate(`
      <h2>Restablecer tu contraseña</h2>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
      
      <div class="highlight">
        <h3>Instrucciones</h3>
        <p>Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace expirará en 24 horas.</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">Restablecer contraseña</a>
      </p>
      
      <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este email.</p>
      <p>Por seguridad, te recomendamos cambiar tu contraseña regularmente.</p>
    `);

    const text = `Restablecer tu contraseña

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.

Instrucciones:
Haz clic en el enlace de abajo para crear una nueva contraseña. Este enlace expirará en 24 horas.

Restablecer contraseña: ${resetUrl}

Si no solicitaste restablecer tu contraseña, puedes ignorar este email.
Por seguridad, te recomendamos cambiar tu contraseña regularmente.`;

    return sendEmail({
      to: userEmail,
      subject: "Restablecer tu contraseña - Citrus Designer",
      text,
      html,
    });
  },
};
