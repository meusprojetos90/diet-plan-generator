/**
 * Email Service using Resend
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  locale: "pt-BR" | "en";
  customerName: string;
  pdfUrl: string;
  pdfBuffer: Buffer;
}

/**
 * Send meal plan PDF via email
 */
export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, locale, customerName, pdfUrl, pdfBuffer } = options;

  const htmlContent = getEmailTemplate(locale, customerName, pdfUrl);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Meal Plan <noreply@yourdomain.com>",
      to: [to],
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: `meal-plan-${Date.now()}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

/**
 * Get email template based on locale
 */
function getEmailTemplate(
  locale: "pt-BR" | "en",
  customerName: string,
  pdfUrl: string
): string {
  if (locale === "pt-BR") {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .content {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Seu Plano Alimentar está Pronto!</h1>
  </div>
  
  <div class="content">
    <p>Olá, <strong>${customerName}</strong>!</p>
    
    <p>Seu plano alimentar personalizado foi gerado com sucesso! 🥗</p>
    
    <p>Preparamos um plano completo e detalhado, especialmente para você, com:</p>
    <ul>
      <li>✅ Receitas detalhadas para cada refeição</li>
      <li>✅ Lista de compras organizada por categoria</li>
      <li>✅ Cálculo preciso de macros e calorias</li>
      <li>✅ Dicas de preparo e substituições</li>
    </ul>
    
    <p>O PDF está anexado neste email. Basta baixar o anexo para acessar seu plano completo!</p>
    
    <p><strong>Dicas importantes:</strong></p>
    <ul>
      <li>Beba pelo menos 2 litros de água por dia</li>
      <li>Ajuste as porções conforme sua fome e saciedade</li>
      <li>Consulte um nutricionista para acompanhamento personalizado</li>
    </ul>
  </div>
  
  <div class="footer">
    <p>Bom apetite e boa sorte na sua jornada! 💪</p>
    <p style="font-size: 12px; color: #999;">
      Este é um email automático. Por favor, não responda.
    </p>
  </div>
</body>
</html>
    `;
  }

  // English template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .content {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Your Meal Plan is Ready!</h1>
  </div>
  
  <div class="content">
    <p>Hello, <strong>${customerName}</strong>!</p>
    
    <p>Your personalized meal plan has been successfully generated! 🥗</p>
    
    <p>We've prepared a complete and detailed plan, especially for you, with:</p>
    <ul>
      <li>✅ Detailed recipes for each meal</li>
      <li>✅ Shopping list organized by category</li>
      <li>✅ Precise macro and calorie calculations</li>
      <li>✅ Preparation tips and substitutions</li>
    </ul>
    
    <p>The PDF is attached to this email. Just download the attachment to access your complete plan!</p>
    
    <p><strong>Important tips:</strong></p>
    <ul>
      <li>Drink at least 2 liters of water per day</li>
      <li>Adjust portions according to your hunger and satiety</li>
      <li>Consult a nutritionist for personalized follow-up</li>
    </ul>
  </div>
  
  <div class="footer">
    <p>Enjoy your meals and good luck on your journey! 💪</p>
    <p style="font-size: 12px; color: #999;">
      This is an automated email. Please do not reply.
    </p>
  </div>
</body>
</html>
  `;
}
