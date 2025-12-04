"use client";

import Link from "next/link";

export default function RefundPolicyPage() {
    return (
        <main className="policy-page">
            <div className="container">
                <Link href="/" className="back-link">
                    ← Voltar para Home
                </Link>

                <h1>Política de Reembolso</h1>

                <section>
                    <h2>1. Direito de Reembolso</h2>
                    <p>
                        Você tem o direito de solicitar o reembolso total dentro de 7 dias após a compra,
                        desde que não tenha recebido ou acessado o plano alimentar completo.
                    </p>
                </section>

                <section>
                    <h2>2. Como Solicitar</h2>
                    <p>
                        Para solicitar um reembolso, entre em contato conosco através do email
                        support@example.com com o número do seu pedido e o motivo da solicitação.
                    </p>
                </section>

                <section>
                    <h2>3. Processamento</h2>
                    <p>
                        Os reembolsos são processados em até 10 dias úteis após a aprovação da solicitação.
                        O valor será creditado no mesmo método de pagamento utilizado na compra.
                    </p>
                </section>

                <section>
                    <h2>4. Exceções</h2>
                    <p>
                        Não são elegíveis para reembolso:
                    </p>
                    <ul>
                        <li>Planos já entregues e acessados completamente</li>
                        <li>Solicitações feitas após 7 dias da compra</li>
                        <li>Compras feitas através de promoções especiais (quando especificado)</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Contato</h2>
                    <p>
                        Para dúvidas sobre nossa política de reembolso, entre em contato:
                        <br />
                        Email: support@example.com
                        <br />
                        Telefone: +55 11 99999-9999
                    </p>
                </section>
            </div>

            <style jsx>{`
        .policy-page {
          min-height: 100vh;
          padding: 60px 20px;
          background: #f8f9fa;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 60px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 30px;
          transition: opacity 0.3s;
        }

        .back-link:hover {
          opacity: 0.7;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        section {
          margin-bottom: 40px;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 15px;
        }

        p {
          color: #555;
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 15px;
        }

        ul {
          margin-left: 20px;
          color: #555;
          line-height: 1.8;
        }

        li {
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 30px 20px;
          }

          h1 {
            font-size: 2rem;
          }
        }
      `}</style>
        </main>
    );
}
