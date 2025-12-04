"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <main className="policy-page">
            <div className="container">
                <Link href="/" className="back-link">
                    ← Voltar para Home
                </Link>

                <h1>Política de Privacidade</h1>

                <section>
                    <h2>1. Informações que Coletamos</h2>
                    <p>
                        Coletamos informações que você nos fornece diretamente, incluindo:
                    </p>
                    <ul>
                        <li>Nome, email e informações de contato</li>
                        <li>Informações de saúde e objetivos nutricionais</li>
                        <li>Preferências alimentares e restrições dietéticas</li>
                        <li>Informações de pagamento (processadas por terceiros seguros)</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Como Usamos suas Informações</h2>
                    <p>
                        Utilizamos suas informações para:
                    </p>
                    <ul>
                        <li>Criar e personalizar seu plano alimentar</li>
                        <li>Processar pagamentos e enviar confirmações</li>
                        <li>Enviar seu plano por email</li>
                        <li>Melhorar nossos serviços e experiência do usuário</li>
                        <li>Comunicar atualizações e ofertas (com seu consentimento)</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Compartilhamento de Dados</h2>
                    <p>
                        Não vendemos suas informações pessoais. Compartilhamos dados apenas com:
                    </p>
                    <ul>
                        <li>Processadores de pagamento (Stripe, etc.)</li>
                        <li>Serviços de email (para entrega do plano)</li>
                        <li>Provedores de hospedagem e infraestrutura</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Segurança dos Dados</h2>
                    <p>
                        Implementamos medidas de segurança técnicas e organizacionais para proteger
                        suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
                    </p>
                </section>

                <section>
                    <h2>5. Seus Direitos</h2>
                    <p>
                        Você tem o direito de:
                    </p>
                    <ul>
                        <li>Acessar suas informações pessoais</li>
                        <li>Corrigir dados incorretos</li>
                        <li>Solicitar a exclusão de seus dados</li>
                        <li>Retirar consentimento para comunicações de marketing</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Cookies</h2>
                    <p>
                        Utilizamos cookies para melhorar sua experiência. Consulte nossa
                        Política de Cookies para mais informações.
                    </p>
                </section>

                <section>
                    <h2>7. Contato</h2>
                    <p>
                        Para questões sobre privacidade, entre em contato:
                        <br />
                        Email: privacy@example.com
                        <br />
                        Telefone: +55 11 99999-9999
                    </p>
                </section>

                <p className="last-updated">
                    <em>Última atualização: Dezembro de 2024</em>
                </p>
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

        .last-updated {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #999;
          font-size: 0.9rem;
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
