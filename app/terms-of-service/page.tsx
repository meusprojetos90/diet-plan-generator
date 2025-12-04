"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <main className="policy-page">
            <div className="container">
                <Link href="/" className="back-link">
                    ← Voltar para Home
                </Link>

                <h1>Termos de Serviço</h1>

                <section>
                    <h2>1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar e usar este serviço, você aceita e concorda em estar vinculado aos
                        termos e condições deste acordo. Se você não concordar com estes termos,
                        não use este serviço.
                    </p>
                </section>

                <section>
                    <h2>2. Descrição do Serviço</h2>
                    <p>
                        Fornecemos planos alimentares personalizados gerados por inteligência artificial
                        com base nas informações que você fornece. O serviço inclui:
                    </p>
                    <ul>
                        <li>Plano de refeições personalizado</li>
                        <li>Receitas detalhadas com instruções</li>
                        <li>Lista de compras organizada</li>
                        <li>Cálculos nutricionais (macros e calorias)</li>
                        <li>Documento PDF profissional</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Responsabilidades do Usuário</h2>
                    <p>
                        Você concorda em:
                    </p>
                    <ul>
                        <li>Fornecer informações precisas e verdadeiras</li>
                        <li>Manter a confidencialidade de sua conta</li>
                        <li>Não compartilhar ou revender os planos recebidos</li>
                        <li>Consultar um profissional de saúde antes de iniciar qualquer dieta</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Isenção de Responsabilidade Médica</h2>
                    <p>
                        <strong>IMPORTANTE:</strong> Este serviço é apenas para fins educacionais e informativos.
                        Não fornecemos aconselhamento médico, diagnóstico ou tratamento. Sempre consulte
                        seu médico ou profissional de saúde qualificado antes de iniciar qualquer programa
                        de perda de peso ou mudança na dieta.
                    </p>
                </section>

                <section>
                    <h2>5. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo fornecido, incluindo planos alimentares, receitas e materiais,
                        é de nossa propriedade e protegido por leis de direitos autorais. Você recebe
                        uma licença pessoal e não transferível para usar o conteúdo.
                    </p>
                </section>

                <section>
                    <h2>6. Limitação de Responsabilidade</h2>
                    <p>
                        Não nos responsabilizamos por:
                    </p>
                    <ul>
                        <li>Resultados específicos de perda de peso</li>
                        <li>Reações alérgicas ou problemas de saúde</li>
                        <li>Erros nas informações fornecidas por você</li>
                        <li>Danos indiretos ou consequenciais</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Modificações do Serviço</h2>
                    <p>
                        Reservamo-nos o direito de modificar ou descontinuar o serviço a qualquer momento,
                        com ou sem aviso prévio.
                    </p>
                </section>

                <section>
                    <h2>8. Lei Aplicável</h2>
                    <p>
                        Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida
                        nos tribunais competentes.
                    </p>
                </section>

                <section>
                    <h2>9. Contato</h2>
                    <p>
                        Para questões sobre estes termos, entre em contato:
                        <br />
                        Email: legal@example.com
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
