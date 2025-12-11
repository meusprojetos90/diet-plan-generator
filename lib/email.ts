import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'Cool Plan <noreply@replay.velare.app>';

export async function sendWelcomeEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Skipping email.");
    return;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Seu Plano Alimentar está pronto! 🥗',
      html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Olá, ${name}! 👋</h1>
                    <p>Obrigado por renovar seu plano alimentar!</p>
                    <p>Seu novo plano já está disponível na sua área do cliente.</p>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                            Acessar Minha Área
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                    
                    <p style="color: #666; font-size: 0.9em;">
                        Se o botão não funcionar, copie e cole este link no seu navegador:<br/>
                        ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
                    </p>
                </div>
            `
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendAccountCreatedEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Skipping email.");
    return;
  }

  try {
    // Link to password reset page with email pre-filled
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/handler/forgot-password?email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: '🎉 Sua conta foi criada! Configure sua senha',
      html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Olá, ${name}! 👋</h1>
                    <p>Obrigado por adquirir seu plano alimentar personalizado!</p>
                    <p><strong>Sua conta foi criada automaticamente.</strong> Para acessar sua área do cliente, você precisa criar uma senha:</p>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                            🔐 Criar Minha Senha
                        </a>
                    </div>

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Seu email de acesso:</strong></p>
                        <p style="margin: 5px 0 0 0; font-size: 1.1em; color: #667eea;">${email}</p>
                    </div>

                    <p>Após criar sua senha, você terá acesso a:</p>
                    <ul>
                        <li>✅ Seu plano alimentar completo</li>
                        <li>✅ Treinos personalizados</li>
                        <li>✅ Calendário interativo</li>
                        <li>✅ Lista de compras</li>
                    </ul>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                    
                    <p style="color: #666; font-size: 0.9em;">
                        Se o botão não funcionar, copie e cole este link no seu navegador:<br/>
                        ${resetLink}
                    </p>
                </div>
            `
    });
    console.log(`Account created email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send account created email:", error);
  }
}

