"use client";

import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="about-page">
            <div className="container">
                <Link href="/" className="back-link">
                    ← Voltar para Home
                </Link>

                <h1>Sobre Nós</h1>

                <section className="intro">
                    <p className="lead">
                        Somos uma plataforma inovadora que utiliza inteligência artificial para criar
                        planos alimentares personalizados, ajudando milhares de pessoas a alcançarem
                        seus objetivos de saúde e bem-estar.
                    </p>
                </section>

                <section>
                    <h2>Nossa Missão</h2>
                    <p>
                        Democratizar o acesso a planos nutricionais de qualidade, tornando a alimentação
                        saudável acessível, personalizada e fácil de seguir para todos.
                    </p>
                </section>

                <section>
                    <h2>Como Funciona</h2>
                    <div className="features-list">
                        <div className="feature-item">
                            <div className="feature-number">1</div>
                            <div className="feature-content">
                                <h3>Questionário Personalizado</h3>
                                <p>
                                    Você responde perguntas sobre seus objetivos, preferências alimentares,
                                    restrições e estilo de vida.
                                </p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">2</div>
                            <div className="feature-content">
                                <h3>IA Avançada</h3>
                                <p>
                                    Nossa inteligência artificial analisa suas respostas e cria um plano
                                    alimentar único, adaptado às suas necessidades.
                                </p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">3</div>
                            <div className="feature-content">
                                <h3>Plano Completo</h3>
                                <p>
                                    Você recebe receitas detalhadas, lista de compras, cálculos nutricionais
                                    e tudo em um PDF profissional.
                                </p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">4</div>
                            <div className="feature-content">
                                <h3>Suporte Contínuo</h3>
                                <p>
                                    Nossa equipe está disponível 24/7 para tirar dúvidas e ajudar você
                                    a ter sucesso em sua jornada.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Por Que Nos Escolher?</h2>
                    <ul className="benefits-list">
                        <li>✅ Planos 100% personalizados para você</li>
                        <li>✅ Tecnologia de IA de ponta</li>
                        <li>✅ Receitas práticas e deliciosas</li>
                        <li>✅ Cálculos nutricionais precisos</li>
                        <li>✅ Entrega rápida (até 3 horas)</li>
                        <li>✅ Suporte profissional 24/7</li>
                        <li>✅ Preços acessíveis</li>
                        <li>✅ Garantia de reembolso</li>
                    </ul>
                </section>

                <section>
                    <h2>Nossos Valores</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">🎯</div>
                            <h3>Personalização</h3>
                            <p>Cada pessoa é única, e seu plano também deve ser.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">🔬</div>
                            <h3>Ciência</h3>
                            <p>Baseamos tudo em evidências científicas e nutrição comprovada.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">💚</div>
                            <h3>Saúde</h3>
                            <p>Seu bem-estar é nossa prioridade número um.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">🚀</div>
                            <h3>Inovação</h3>
                            <p>Usamos tecnologia de ponta para melhores resultados.</p>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <h2>Pronto para Começar?</h2>
                    <p>
                        Junte-se a milhares de pessoas que já transformaram sua alimentação e saúde.
                    </p>
                    <Link href="/quiz" className="cta-button">
                        Criar Meu Plano Agora
                    </Link>
                </section>
            </div>

            <style jsx>{`
        .about-page {
          min-height: 100vh;
          padding: 60px 20px;
          background: #f8f9fa;
        }

        .container {
          max-width: 900px;
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

        .intro {
          margin-bottom: 50px;
        }

        .lead {
          font-size: 1.3rem;
          color: #333;
          line-height: 1.8;
          font-weight: 500;
        }

        section {
          margin-bottom: 50px;
        }

        h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        p {
          color: #555;
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 15px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .feature-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .feature-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .feature-content {
          flex: 1;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .benefits-list li {
          color: #555;
          font-size: 1.05rem;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 25px;
        }

        .value-card {
          text-align: center;
          padding: 30px 20px;
          background: #f8f9fa;
          border-radius: 16px;
          transition: transform 0.3s;
        }

        .value-card:hover {
          transform: translateY(-5px);
        }

        .value-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .value-card h3 {
          margin-bottom: 10px;
        }

        .value-card p {
          font-size: 0.95rem;
          margin: 0;
        }

        .cta-section {
          text-align: center;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          color: white;
        }

        .cta-section h2 {
          color: white;
          margin-bottom: 15px;
        }

        .cta-section p {
          color: white;
          opacity: 0.95;
          margin-bottom: 25px;
        }

        .cta-button {
          display: inline-block;
          padding: 16px 40px;
          background: white;
          color: #667eea;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .container {
            padding: 30px 20px;
          }

          h1 {
            font-size: 2rem;
          }

          .feature-item {
            flex-direction: column;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </main>
    );
}
