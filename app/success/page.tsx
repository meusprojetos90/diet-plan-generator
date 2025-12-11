"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@stackframe/stack";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Could be used to fetch details if needed
  const user = useUser();

  // Default to PT-BR as per user preference, but could detect from browser
  // For now, hardcoding PT-BR as primary view
  const [lang, setLang] = useState<"pt" | "en">("pt");

  // Verify session and activate plan if needed (client-side fallback for webhooks)
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => console.log("Verification result:", data))
        .catch(err => console.error("Verification failed:", err));
    }
  }, [sessionId]);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>

        {lang === "pt" ? (
          <>
            <h1>Pagamento Confirmado!</h1>
            <p className="message">
              Seu plano alimentar está sendo gerado e o acesso foi enviado para seu email.
            </p>
            <div className="info-box">
              <h3>📧 Próximos passos:</h3>
              <ul>
                <li>Verifique sua caixa de entrada</li>
                <li>Clique no link de acesso no email</li>
                <li>Ou acesse o Dashboard diretamente abaixo</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <h1>Payment Confirmed!</h1>
            <p className="message">
              Your meal plan is being generated and access has been sent to your email.
            </p>
            <div className="info-box">
              <h3>📧 Next steps:</h3>
              <ul>
                <li>Check your inbox</li>
                <li>Click the access link in the email</li>
                <li>Or access the Dashboard directly below</li>
              </ul>
            </div>
          </>
        )}

        <div className="actions">
          {user ? (
            <Link href="/dashboard" className="primary-button">
              {lang === "pt" ? "Acessar Meu Plano" : "Access My Plan"}
            </Link>
          ) : (
            <Link href="/register" className="primary-button">
              {lang === "pt" ? "Criar Conta para Acessar" : "Create Account to Access"}
            </Link>
          )}
          <Link href="/" className="secondary-button">
            {lang === "pt" ? "Voltar ao Início" : "Back to Home"}
          </Link>
        </div>

        <button
          onClick={() => setLang(l => l === "pt" ? "en" : "pt")}
          className="lang-toggle"
        >
          {lang === "pt" ? "Switch to English" : "Mudar para Português"}
        </button>
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
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .success-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                }

                h1 {
                    font-size: 2.2rem;
                    color: #333;
                    margin-bottom: 15px;
                }

                .message {
                    font-size: 1.1rem;
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 25px;
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
                    font-size: 1.1rem;
                }

                .info-box ul {
                    list-style: none;
                    padding: 0;
                }

                .info-box li {
                    padding: 8px 0;
                    padding-left: 25px;
                    position: relative;
                    color: #444;
                }

                .info-box li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #667eea;
                    font-weight: bold;
                }

                .actions {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-top: 30px;
                }

                .primary-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 40px;
                    border-radius: 50px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .primary-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                }

                .secondary-button {
                    display: inline-block;
                    background: transparent;
                    color: #666;
                    padding: 10px;
                    font-size: 0.9rem;
                    text-decoration: none;
                }
                
                .secondary-button:hover {
                    color: #333;
                    text-decoration: underline;
                }

                .lang-toggle {
                    background: none;
                    border: none;
                    margin-top: 30px;
                    color: #aaa;
                    font-size: 0.8rem;
                    cursor: pointer;
                    text-decoration: underline;
                }
            `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
