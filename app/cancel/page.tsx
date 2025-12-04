"use client";

import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="cancel-container">
      <div className="cancel-card">
        <div className="cancel-icon">❌</div>
        <h1>Pagamento Cancelado</h1>
        <h2>Payment Cancelled</h2>

        <p className="message">
          Seu pagamento foi cancelado. Nenhuma cobrança foi realizada.
        </p>
        <p className="message-en">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="info-box">
          <h3>💡 O que fazer agora? / What to do now?</h3>
          <ul>
            <li>
              Você pode tentar novamente quando quiser / You can try again
              anytime
            </li>
            <li>
              Seus dados foram salvos / Your data has been saved
            </li>
            <li>
              Entre em contato se tiver dúvidas / Contact us if you have
              questions
            </li>
          </ul>
        </div>

        <div className="button-group">
          <Link href="/preview" className="retry-button">
            Tentar Novamente / Try Again
          </Link>
          <Link href="/" className="home-link">
            Voltar ao Início / Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .cancel-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          padding: 20px;
        }

        .cancel-card {
          background: white;
          padding: 60px 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 600px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .cancel-icon {
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
          background: #fff3cd;
          padding: 25px;
          border-radius: 10px;
          margin: 30px 0;
          text-align: left;
          border-left: 4px solid #ffc107;
        }

        .info-box h3 {
          color: #856404;
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
          color: #856404;
        }

        .info-box li:before {
          content: "•";
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 30px;
        }

        .retry-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 40px;
          border-radius: 50px;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .retry-button:hover {
          transform: translateY(-2px);
        }

        .home-link {
          color: #667eea;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
