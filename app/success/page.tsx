"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Pagamento Confirmado!</h1>
        <h2>Payment Confirmed!</h2>

        <p className="message">
          Seu plano alimentar está sendo gerado e será enviado para seu email em
          até 3 horas.
        </p>
        <p className="message-en">
          Your meal plan is being generated and will be sent to your email
          within 3 hours.
        </p>

        <div className="info-box">
          <h3>📧 Próximos passos / Next steps:</h3>
          <ul>
            <li>Verifique sua caixa de entrada / Check your inbox</li>
            <li>
              O PDF será enviado como anexo / PDF will be sent as attachment
            </li>
            <li>
              Salve o arquivo para acesso offline / Save the file for offline
              access
            </li>
          </ul>
        </div>

        <Link href="/" className="home-button">
          Voltar ao Início / Back to Home
        </Link>
      </div>

      <style jsx>{`
        .success-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .success-card {
          background: white;
          padding: 60px 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 600px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .success-icon {
          font-size: 5rem;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        h2 {
          font-size: 1.8rem;
          color: #666;
          margin-bottom: 30px;
        }

        .message,
        .message-en {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .info-box {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          margin: 30px 0;
          text-align: left;
        }

        .info-box h3 {
          color: #667eea;
          margin-bottom: 15px;
        }

        .info-box ul {
          list-style: none;
          padding: 0;
        }

        .info-box li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }

        .info-box li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }

        .home-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 40px;
          border-radius: 50px;
          font-weight: 600;
          margin-top: 20px;
          transition: transform 0.2s;
        }

        .home-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
