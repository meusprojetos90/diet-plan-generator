"use client";

import Link from "next/link";

export default function SubscriptionTermsPage() {
    return (
        <main className="policy-page">
            <div className="container">
                <Link href="/" className="back-link">
                    ← Voltar para Home
                </Link>

                <h1>Termos da Assinatura</h1>

                <section>
                    <h2>1. Planos Disponíveis</h2>
                    <p>
                        Oferecemos planos alimentares com diferentes durações:
                    </p>
                    <ul>
                        <li>Plano de 7 dias</li>
                        <li>Plano de 14 dias</li>
                        <li>Plano de 30 dias</li>
                        <li>Plano de 90 dias</li>
                    </ul>
                    <p>
                        Cada plano é uma compra única, não uma assinatura recorrente.
                    </p>
                </section>

                <section>
                    <h2>2. Pagamento</h2>
                    <p>
                        O pagamento é processado no momento da compra através de nossos processadores
                        de pagamento seguros (Stripe). Aceitamos:
                    </p>
                    <ul>
                        <li>Cartões de crédito (Visa, Mastercard, American Express)</li>
                        <li>Cartões de débito</li>
                        <li>PIX (para pagamentos em BRL)</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Entrega do Plano</h2>
                    <p>
                        Após a confirmação do pagamento:
                    </p>
                    <ul>
                        <li>Você receberá um email de confirmação imediatamente</li>
                        <li>Seu plano personalizado será gerado por IA</li>
                        <li>O plano completo em PDF será enviado para seu email em até 3 horas</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Renovação</h2>
                    <p>
                        Nossos planos <strong>NÃO são renovados automaticamente</strong>. Cada compra
                        é única e você precisará fazer uma nova compra se desejar continuar com um
                        novo plano após o término do período.
                    </p>
                </section>

                <section>
                    <h2>5. Cancelamento e Reembolso</h2>
                    <p>
                        Como nossos planos são compras únicas e não assinaturas recorrentes:
                    </p>
                    <ul>
                        <li>Você pode solicitar reembolso dentro de 7 dias da compra</li>
                        <li>O reembolso só é válido se você não tiver recebido/acessado o plano completo</li>
                        <li>Consulte nossa Política de Reembolso para mais detalhes</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Modificações de Preço</h2>
                    <p>
                        Reservamo-nos o direito de modificar os preços a qualquer momento. Mudanças
                        de preço não afetam compras já realizadas.
                    </p>
                </section>

                <section>
                    <h2>7. Acesso ao Conteúdo</h2>
                    <p>
                        Uma vez que você recebe seu plano em PDF:
                    </p>
                    <ul>
                        <li>Você tem acesso vitalício ao arquivo</li>
                        <li>Pode salvar e imprimir para uso pessoal</li>
                        <li>Não pode compartilhar, revender ou distribuir</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Contato</h2>
                    <p>
                        Para questões sobre assinaturas ou pagamentos:
                        <br />
                        Email: billing@example.com
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
