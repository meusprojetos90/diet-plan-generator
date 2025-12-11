"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  days: number;
  price_brl: number;
  price_usd: number;
  original_price_brl: number | null;
  original_price_usd: number | null;
  is_popular: boolean;
  features: string[];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    setMounted(true);
    // Fetch plans from database
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data.plans || []))
      .catch(() => setPlans([]));
  }, []);

  if (!mounted) return null;

  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="floating-icons">
            <span className="float-icon">🥗</span>
            <span className="float-icon">🏋️</span>
            <span className="float-icon">💪</span>
            <span className="float-icon">🥑</span>
            <span className="float-icon">🎯</span>
          </div>
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">✨ Transforme seu corpo e mente</div>
            <h1 className="hero-title">
              Seu Plano de <span className="gradient-text">Dieta + Treino</span> Personalizado com IA
            </h1>

            <p className="hero-subtitle">
              Em apenas 2 minutos, receba um plano completo de alimentação e exercícios criado especialmente para você.
              <strong> Resultados garantidos ou seu dinheiro de volta!</strong>
            </p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">12.500+</span>
                <span className="stat-label">Clientes Satisfeitos</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Avaliação Média</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">-5kg</span>
                <span className="stat-label">Média em 30 dias</span>
              </div>
            </div>

            <div className="gender-selection">
              <p className="gender-label">👇 Selecione seu gênero para começar</p>
              <div className="gender-cards">
                <Link href="/quiz?gender=male" className="gender-card">
                  <div className="gender-icon">👨</div>
                  <span>Masculino</span>
                  <div className="card-arrow">→</div>
                </Link>
                <Link href="/quiz?gender=female" className="gender-card">
                  <div className="gender-icon">👩</div>
                  <span>Feminino</span>
                  <div className="card-arrow">→</div>
                </Link>
              </div>
            </div>

            <p className="hero-trust">🔒 Seus dados estão seguros • 💳 Pagamento seguro • ✅ Garantia de 7 dias</p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="what-you-get">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">📦 INCLUSO NO SEU PLANO</span>
            <h2 className="section-title">O Que Você Vai Receber</h2>
            <p className="section-subtitle">Um pacote completo para transformar seu corpo e sua saúde</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card highlight">
              <div className="benefit-icon">📋</div>
              <h3>Plano Alimentar Completo</h3>
              <ul className="benefit-list">
                <li>✓ 7 a 90 dias de refeições planejadas</li>
                <li>✓ Café, almoço, jantar e lanches</li>
                <li>✓ Receitas detalhadas passo a passo</li>
                <li>✓ Cálculo de calorias e macros</li>
                <li>✓ Adaptado às suas preferências</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🏋️</div>
              <h3>Treinos Personalizados</h3>
              <ul className="benefit-list">
                <li>✓ Exercícios para seu nível</li>
                <li>✓ Treinos em casa ou academia</li>
                <li>✓ Vídeos explicativos</li>
                <li>✓ Timer interativo guiado</li>
                <li>✓ Música ambiente motivacional</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🛒</div>
              <h3>Lista de Compras</h3>
              <ul className="benefit-list">
                <li>✓ Organizada por categoria</li>
                <li>✓ Quantidades exatas</li>
                <li>✓ Economize no mercado</li>
                <li>✓ Atualizada semanalmente</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Área do Cliente</h3>
              <ul className="benefit-list">
                <li>✓ Acesso via celular ou PC</li>
                <li>✓ Calendário interativo</li>
                <li>✓ Acompanhamento de peso</li>
                <li>✓ Marcar refeições feitas</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon"></div>
              <h3>Suporte 24/7</h3>
              <ul className="benefit-list">
                <li>✓ Atendimento via email</li>
                <li>✓ Tire suas dúvidas</li>
                <li>✓ Ajustes no plano</li>
                <li>✓ Resposta rápida</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🚀 SIMPLES E RÁPIDO</span>
            <h2 className="section-title">Como Funciona</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3>Responda o Quiz</h3>
              <p>Conte-nos sobre seus objetivos, preferências alimentares e rotina. Leva apenas 2 minutos!</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🤖</div>
              <h3>IA Cria Seu Plano</h3>
              <p>Nossa inteligência artificial analisa suas informações e cria um plano 100% personalizado.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">🎉</div>
              <h3>Comece a Transformação</h3>
              <p>Acesse seu dashboard, siga o plano e veja os resultados aparecerem rapidamente!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results">
        <div className="container">
          <div className="section-header light">
            <span className="section-badge light">💎 RESULTADOS REAIS</span>
            <h2 className="section-title light">Transformações Inspiradoras</h2>
          </div>

          <div className="results-stats">
            <div className="result-stat">
              <div className="result-number">94%</div>
              <p>dos clientes atingem sua meta de peso</p>
            </div>
            <div className="result-stat">
              <div className="result-number">3-5kg</div>
              <p>de perda média nas primeiras 2 semanas</p>
            </div>
            <div className="result-stat">
              <div className="result-number">87%</div>
              <p>mantêm o peso após 6 meses</p>
            </div>
          </div>

          <blockquote className="results-quote">
            "Em 3 meses eu perdi 12kg e mudei completamente minha relação com a comida.
            O plano é fácil de seguir e as receitas são deliciosas!"
            <cite>— Maria S., 32 anos</cite>
          </blockquote>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">⭐ AVALIAÇÕES</span>
            <h2 className="section-title">O Que Dizem Nossos Clientes</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">K</div>
                <div className="testimonial-info">
                  <h4>Katie Barr</h4>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="testimonial-text">"Excelente! Perdi 8kg em 2 meses seguindo o plano. As receitas são fáceis e saborosas. Muito recomendado!"</p>
              <div className="testimonial-result">-8kg em 60 dias</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">M</div>
                <div className="testimonial-info">
                  <h4>Marcus Hart</h4>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="testimonial-text">"O treino guiado é incrível! A música e o timer me mantêm motivado. Já perdi 6kg e ganhei massa muscular."</p>
              <div className="testimonial-result">-6kg + músculo</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">D</div>
                <div className="testimonial-info">
                  <h4>Diane Castillo</h4>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="testimonial-text">"Mudou completamente minha relação com a comida. Aprendi a comer de forma saudável e sustentável. Recomendo!"</p>
              <div className="testimonial-result">-10kg em 90 dias</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">P</div>
                <div className="testimonial-info">
                  <h4>Pedro Silva</h4>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="testimonial-text">"Finalmente algo que funciona! O suporte é excelente e o plano é super personalizado. Valeu cada centavo!"</p>
              <div className="testimonial-result">-15kg em 4 meses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="guarantee">
        <div className="container">
          <div className="guarantee-card">
            <div className="guarantee-icon">🛡️</div>
            <h2>Garantia de 7 Dias</h2>
            <p>
              Se você não estiver 100% satisfeito com o seu plano, devolvemos seu dinheiro.
              Sem perguntas, sem burocracia. Seu investimento está protegido!
            </p>
            <div className="guarantee-badges">
              <span>✓ Reembolso Total</span>
              <span>✓ Sem Perguntas</span>
              <span>✓ Processo Rápido</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">💰 INVESTIMENTO</span>
            <h2 className="section-title">Escolha Seu Plano</h2>
            <p className="section-subtitle">Quanto mais dias, maior o desconto! Acesso imediato após pagamento.</p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => {
              const pricePerDay = (plan.price_brl / plan.days).toFixed(2).replace('.', ',');
              const discount = plan.original_price_brl
                ? Math.round((1 - plan.price_brl / plan.original_price_brl) * 100)
                : 0;

              return (
                <div key={plan.id} className={`pricing-card ${plan.is_popular ? 'popular' : ''}`}>
                  {plan.is_popular && <div className="popular-badge">🔥 MAIS POPULAR</div>}
                  <div className="pricing-header">
                    <h3>{plan.days} dias</h3>
                    <div className="price">
                      <span className="currency">R$</span>
                      <span className="amount">{Math.floor(plan.price_brl)}</span>
                    </div>
                    <div className="price-per-day">R${pricePerDay} por dia</div>
                    {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
                  </div>

                  <ul className="pricing-features">
                    <li>✓ {plan.days} dias de plano alimentar</li>
                    {(plan.features || []).slice(0, 5).map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>

                  <Link href="/quiz" className={`pricing-button ${plan.is_popular ? 'primary' : ''}`}>
                    Começar Agora →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">❓ DÚVIDAS</span>
            <h2 className="section-title">Perguntas Frequentes</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h4>Como recebo meu plano?</h4>
              <p>Após o pagamento, você recebe acesso imediato ao seu dashboard pessoal com todo o plano. Também enviamos um PDF por email.</p>
            </div>

            <div className="faq-item">
              <h4>O plano é realmente personalizado?</h4>
              <p>Sim! Nossa IA analisa suas respostas do quiz (peso, altura, objetivos, restrições alimentares) e cria um plano único para você.</p>
            </div>

            <div className="faq-item">
              <h4>Posso acessar pelo celular?</h4>
              <p>Sim, nosso dashboard é 100% responsivo. Acesse de qualquer dispositivo, a qualquer hora.</p>
            </div>

            <div className="faq-item">
              <h4>E se eu não gostar?</h4>
              <p>Temos garantia de 7 dias. Se não estiver satisfeito, devolvemos 100% do seu dinheiro, sem perguntas.</p>
            </div>

            <div className="faq-item">
              <h4>Preciso de equipamentos para os treinos?</h4>
              <p>Não! Temos opção de treinos em casa sem equipamentos e também para academia. Você escolhe!</p>
            </div>

            <div className="faq-item">
              <h4>O pagamento é seguro?</h4>
              <p>Sim! Utilizamos processadores de pagamento certificados e criptografia de ponta. Seus dados estão 100% protegidos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>🎯 Comece Sua Transformação Agora!</h2>
            <p>Milhares de pessoas já mudaram suas vidas. Chegou a sua vez!</p>

            <div className="gender-selection">
              <div className="gender-cards">
                <Link href="/quiz?gender=male" className="gender-card">
                  <div className="gender-icon">👨</div>
                  <span>Masculino</span>
                  <div className="card-arrow">→</div>
                </Link>
                <Link href="/quiz?gender=female" className="gender-card">
                  <div className="gender-icon">👩</div>
                  <span>Feminino</span>
                  <div className="card-arrow">→</div>
                </Link>
              </div>
            </div>

            <p className="cta-guarantee">🛡️ Garantia de 7 dias ou seu dinheiro de volta!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h4>Produto</h4>
              <ul>
                <li><Link href="/quiz">Criar Meu Plano</Link></li>
                <li><Link href="/login">Gerenciar Assinatura</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/refund-policy">Política de Reembolso</Link></li>
                <li><Link href="/privacy-policy">Política de Privacidade</Link></li>
                <li><Link href="/terms-of-service">Termos de Serviço</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Contato</h4>
              <ul>
                <li><a href="mailto:support@example.com">support@example.com</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="disclaimer">
              Este site não faz parte do website do Facebook ou do Facebook Inc.
              Além disso, este site NÃO é endossado pelo Facebook de nenhuma forma.
            </p>
            <p>© 2024 Dieta Personalizada. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 80px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          animation: float 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #667eea 0%, transparent 70%);
          top: -15%;
          left: -10%;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #f093fb 0%, transparent 70%);
          bottom: -15%;
          right: -10%;
          animation-delay: 3s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #00d9ff 0%, transparent 70%);
          top: 50%;
          left: 60%;
          animation-delay: 5s;
        }

        .floating-icons {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .float-icon {
          position: absolute;
          font-size: 2.5rem;
          opacity: 0.15;
          animation: floatIcon 10s ease-in-out infinite;
        }

        .float-icon:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
        .float-icon:nth-child(2) { top: 25%; right: 15%; animation-delay: 2s; }
        .float-icon:nth-child(3) { bottom: 30%; left: 8%; animation-delay: 4s; }
        .float-icon:nth-child(4) { bottom: 20%; right: 10%; animation-delay: 6s; }
        .float-icon:nth-child(5) { top: 60%; left: 50%; animation-delay: 8s; }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          padding: 0 20px;
        }

        .hero-content {
          text-align: center;
          color: white;
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          font-size: 0.9rem;
          margin-bottom: 25px;
        }

        .hero-title {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 25px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #00d9ff 0%, #f093fb 50%, #ff6b6b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.2rem);
          line-height: 1.7;
          margin-bottom: 40px;
          opacity: 0.9;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #00d9ff 0%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.3);
        }

        .gender-selection {
          margin: 40px 0;
        }

        .gender-label {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .gender-cards {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .gender-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 30px 50px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          min-width: 180px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .gender-card:hover {
          transform: translateY(-5px) scale(1.02);
          background: rgba(255, 255, 255, 0.15);
          border-color: #00d9ff;
          box-shadow: 0 20px 40px rgba(0, 217, 255, 0.2);
        }

        .gender-icon {
          font-size: 3rem;
        }

        .gender-card span {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .card-arrow {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          opacity: 0;
          transition: all 0.3s;
        }

        .gender-card:hover .card-arrow {
          opacity: 1;
          right: 15px;
        }

        .hero-trust {
          margin-top: 40px;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        /* Section Styles */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header.light {
          color: white;
        }

        .section-badge {
          display: inline-block;
          padding: 6px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .section-badge.light {
          background: rgba(255,255,255,0.2);
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 15px;
        }

        .section-title.light {
          color: white;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        /* What You Get Section */
        .what-you-get {
          padding: 100px 20px;
          background: #f8f9fa;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .benefit-card {
          background: white;
          padding: 35px 30px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: all 0.3s;
          border: 2px solid transparent;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .benefit-card.highlight {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          grid-row: span 2;
        }

        .benefit-card.highlight h3 {
          color: white;
        }

        .benefit-card.highlight .benefit-list li {
          color: rgba(255,255,255,0.9);
        }

        .benefit-icon {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .benefit-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .benefit-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefit-list li {
          padding: 8px 0;
          color: #555;
          font-size: 0.95rem;
        }

        /* How It Works */
        .how-it-works {
          padding: 100px 20px;
          background: white;
        }

        .steps-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .step-card {
          background: #f8f9fa;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          max-width: 280px;
          position: relative;
        }

        .step-number {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
        }

        .step-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .step-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 15px;
        }

        .step-card p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .step-arrow {
          font-size: 2rem;
          color: #667eea;
          font-weight: 700;
        }

        /* Results Section */
        .results {
          padding: 100px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          text-align: center;
        }

        .results-stats {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-bottom: 60px;
          flex-wrap: wrap;
        }

        .result-stat {
          color: white;
        }

        .result-number {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .result-stat p {
          font-size: 0.95rem;
          opacity: 0.9;
          max-width: 150px;
        }

        .results-quote {
          color: white;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-style: italic;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .results-quote cite {
          display: block;
          margin-top: 20px;
          font-size: 1rem;
          font-style: normal;
          opacity: 0.8;
        }

        /* Testimonials */
        .testimonials {
          padding: 100px 20px;
          background: #f8f9fa;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .testimonial-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: all 0.3s;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .testimonial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .testimonial-info h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 5px;
        }

        .stars {
          font-size: 0.8rem;
          letter-spacing: 2px;
        }

        .testimonial-text {
          color: #555;
          line-height: 1.6;
          font-size: 0.95rem;
          margin-bottom: 15px;
        }

        .testimonial-result {
          display: inline-block;
          padding: 5px 15px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          color: #667eea;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Guarantee */
        .guarantee {
          padding: 80px 20px;
          background: white;
        }

        .guarantee-card {
          background: linear-gradient(135deg, #f0fff4 0%, #e6ffec 100%);
          border: 2px solid #10b981;
          border-radius: 25px;
          padding: 50px;
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .guarantee-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .guarantee-card h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 15px;
        }

        .guarantee-card p {
          color: #555;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .guarantee-badges {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .guarantee-badges span {
          background: #10b981;
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* Pricing */
        .pricing {
          padding: 100px 20px;
          background: #f8f9fa;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .pricing-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          padding: 35px 25px;
          text-align: center;
          transition: all 0.3s;
          position: relative;
        }

        .pricing-card:hover {
          border-color: #667eea;
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.15);
          transform: translateY(-5px);
        }

        .pricing-card.popular {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
          transform: scale(1.05);
        }

        .pricing-card.popular:hover {
          transform: scale(1.05) translateY(-5px);
        }

        .popular-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .pricing-header h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .price {
          margin: 20px 0 10px;
        }

        .currency {
          font-size: 1.5rem;
          color: #667eea;
          font-weight: 700;
          vertical-align: super;
        }

        .amount {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .price-per-day {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 10px;
        }

        .discount-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #ff6b6b;
          color: white;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 25px 0;
          text-align: left;
        }

        .pricing-features li {
          padding: 10px 0;
          color: #555;
          font-size: 0.95rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .pricing-features li:last-child {
          border-bottom: none;
        }

        .pricing-button {
          display: block;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s;
          margin-top: 15px;
        }

        .pricing-button:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .pricing-button.primary {
          font-size: 1.1rem;
          padding: 18px;
        }

        /* FAQ */
        .faq {
          padding: 100px 20px;
          background: white;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .faq-item {
          background: #f8f9fa;
          padding: 25px 30px;
          border-radius: 15px;
          transition: all 0.3s;
        }

        .faq-item:hover {
          background: #f0f4ff;
        }

        .faq-item h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .faq-item p {
          color: #555;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Final CTA */
        .final-cta {
          padding: 100px 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          text-align: center;
        }

        .cta-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 800;
          color: white;
          margin-bottom: 20px;
        }

        .cta-content > p {
          color: rgba(255,255,255,0.8);
          font-size: 1.2rem;
          margin-bottom: 40px;
        }

        .cta-guarantee {
          margin-top: 40px;
          color: #10b981;
          font-weight: 600;
          font-size: 1rem;
        }

        /* Footer */
        .footer {
          padding: 60px 20px 30px;
          background: #0f0f1a;
          color: white;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-column h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: white;
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
        }

        .footer-column li {
          margin-bottom: 10px;
        }

        .footer-column a {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          transition: color 0.3s;
        }

        .footer-column a:hover {
          color: #00d9ff;
        }

        .footer-bottom {
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .disclaimer {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer-bottom > p:last-child {
          color: rgba(255,255,255,0.6);
          font-size: 0.85rem;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero {
            padding: 80px 20px 60px;
          }

          .hero-stats {
            gap: 15px;
          }

          .stat-divider {
            display: none;
          }

          .gender-cards {
            flex-direction: column;
            align-items: center;
          }

          .gender-card {
            width: 100%;
            max-width: 300px;
          }

          .step-arrow {
            display: none;
          }

          .steps-grid {
            flex-direction: column;
          }

          .results-stats {
            gap: 30px;
          }

          .pricing-card.popular {
            transform: scale(1);
          }

          .pricing-card.popular:hover {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </main>
  );
}
