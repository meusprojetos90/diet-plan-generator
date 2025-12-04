"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [locale, setLocale] = useState<"pt-BR" | "en">("pt-BR");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const browserLang = navigator.language;
    if (browserLang.startsWith("pt")) {
      setLocale("pt-BR");
      setCurrency("BRL");
    } else {
      setLocale("en");
      setCurrency("USD");
    }
  }, []);

  const t = translations[locale];
  const prices = pricingPlans[currency];

  if (!mounted) return null;

  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="hero-title">
              {t.hero.title}
            </h1>

            <p className="hero-subtitle">
              {t.hero.subtitle}
            </p>

            <div className="hero-cta">
              <Link href="/quiz" className="cta-button primary">
                <span>{t.hero.cta}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <button className="cta-button secondary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 10L10 12L12 10M10 6V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>{t.hero.demo}</span>
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10k+</div>
                <div className="stat-label">{t.hero.stats.plans}</div>
              </div>
              <div className="stat">
                <div className="stat-number">4.9</div>
                <div className="stat-label">{t.hero.stats.rating}</div>
              </div>
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">{t.hero.stats.satisfaction}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t.features.badge}</span>
            <h2 className="section-title">{t.features.title}</h2>
            <p className="section-subtitle">{t.features.subtitle}</p>
          </div>

          <div className="features-grid">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon-wrapper">
                  <div className="feature-icon">{feature.icon}</div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t.pricing.badge}</span>
            <h2 className="section-title">{t.pricing.title}</h2>
            <p className="section-subtitle">{t.pricing.subtitle}</p>
          </div>

          <div className="pricing-grid">
            {prices.map((plan, index) => (
              <div
                key={plan.days}
                className={`pricing-card ${index === 2 ? 'popular' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {index === 2 && (
                  <div className="popular-badge">{t.pricing.popular}</div>
                )}

                <div className="pricing-header">
                  <h3>{plan.days} {t.pricing.days}</h3>
                  <div className="price">
                    <span className="currency">{currency === "BRL" ? "R$" : "$"}</span>
                    <span className="amount">{plan.price}</span>
                  </div>
                  <div className="price-per-day">
                    {currency === "BRL" ? "R$" : "$"}
                    {(plan.price / plan.days).toFixed(2)} {t.pricing.perDay}
                  </div>
                </div>

                <ul className="pricing-features">
                  <li>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {plan.days} {t.pricing.features.days}
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.pricing.features.recipes}
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.pricing.features.shopping}
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.pricing.features.macros}
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.pricing.features.pdf}
                  </li>
                </ul>

                <Link href="/quiz" className="pricing-button">
                  {t.pricing.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>{t.cta.title}</h2>
            <p>{t.cta.subtitle}</p>
            <Link href="/quiz" className="cta-button primary large">
              {t.cta.button}
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 80px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(240, 147, 251, 0.8) 0%, transparent 70%);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(79, 172, 254, 0.8) 0%, transparent 70%);
          bottom: -10%;
          right: -10%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          text-align: center;
          color: white;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge-icon {
          font-size: 1.2rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 25px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 1.6;
          margin-bottom: 40px;
          opacity: 0.95;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 60px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
          position: relative;
          overflow: hidden;
        }

        .cta-button.primary {
          background: white;
          color: #667eea;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .cta-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
        }

        .cta-button.secondary {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
        }

        .cta-button.large {
          padding: 20px 40px;
          font-size: 1.2rem;
        }

        .hero-stats {
          display: flex;
          gap: 60px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Features Section */
        .features {
          padding: 100px 20px;
          background: #f8f9fa;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-badge {
          display: inline-block;
          padding: 6px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 15px;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeIn 0.6s ease-out;
          animation-fill-mode: both;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.2);
        }

        .feature-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .feature-icon-wrapper::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 22px;
          opacity: 0.2;
          filter: blur(10px);
        }

        .feature-icon {
          font-size: 2.5rem;
          position: relative;
          z-index: 1;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 15px;
        }

        .feature-card p {
          color: #666;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        /* Pricing Section */
        .pricing {
          padding: 100px 20px;
          background: white;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .pricing-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 24px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          animation: scaleIn 0.5s ease-out;
          animation-fill-mode: both;
        }

        .pricing-card:hover {
          border-color: #667eea;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
          transform: translateY(-10px);
        }

        .pricing-card.popular {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          transform: scale(1.05);
        }

        .pricing-card.popular:hover {
          transform: scale(1.05) translateY(-10px);
        }

        .popular-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pricing-header h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .price {
          margin: 25px 0 10px;
        }

        .currency {
          font-size: 1.8rem;
          color: #667eea;
          font-weight: 700;
          vertical-align: super;
        }

        .amount {
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .price-per-day {
          font-size: 0.9rem;
          color: #999;
          margin-bottom: 30px;
        }

        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 30px 0;
          text-align: left;
        }

        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          color: #555;
          font-size: 1rem;
        }

        .pricing-features svg {
          flex-shrink: 0;
          stroke: #10b981;
        }

        .pricing-button {
          display: block;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.3s;
          margin-top: 20px;
        }

        .pricing-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        /* Final CTA */
        .final-cta {
          padding: 100px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 20px;
        }

        .cta-content p {
          font-size: 1.3rem;
          margin-bottom: 40px;
          opacity: 0.95;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 80px 20px 60px;
          }

          .hero-stats {
            gap: 40px;
          }

          .features,
          .pricing,
          .final-cta {
            padding: 60px 20px;
          }

          .pricing-card.popular {
            transform: scale(1);
          }

          .pricing-card.popular:hover {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </main>
  );
}

const translations = {
  "pt-BR": {
    hero: {
      badge: "Gerado por IA",
      title: "Seu Plano Alimentar Personalizado",
      subtitle: "Receba um plano completo gerado por inteligência artificial em minutos. Receitas detalhadas, lista de compras e acompanhamento nutricional.",
      cta: "Começar Agora",
      demo: "Ver Demo",
      stats: {
        plans: "Planos criados",
        rating: "Avaliação",
        satisfaction: "Satisfação",
      },
    },
    features: {
      badge: "Recursos",
      title: "Tudo que você precisa",
      subtitle: "Planos completos e personalizados para atingir seus objetivos",
      items: [
        {
          icon: "🤖",
          title: "IA Avançada",
          description: "Planos gerados por inteligência artificial considerando suas necessidades específicas e objetivos",
        },
        {
          icon: "📊",
          title: "Macros Precisos",
          description: "Cálculo detalhado de calorias, proteínas, carboidratos e gorduras para cada refeição",
        },
        {
          icon: "🥗",
          title: "Receitas Detalhadas",
          description: "Modo de preparo passo a passo com dicas profissionais e opções de substituição",
        },
        {
          icon: "🛒",
          title: "Lista de Compras",
          description: "Lista organizada por categoria para facilitar suas compras semanais",
        },
      ],
    },
    pricing: {
      badge: "Planos",
      title: "Escolha seu plano",
      subtitle: "Receba seu plano completo por email em até 3 horas",
      days: "dias",
      perDay: "por dia",
      popular: "Mais Popular",
      features: {
        days: "dias de plano alimentar",
        recipes: "Receitas detalhadas",
        shopping: "Lista de compras",
        macros: "Cálculo de macros",
        pdf: "PDF profissional",
      },
      cta: "Começar Agora",
    },
    cta: {
      title: "Pronto para transformar sua alimentação?",
      subtitle: "Comece agora e receba seu plano personalizado em minutos",
      button: "Criar Meu Plano",
    },
  },
  en: {
    hero: {
      badge: "AI-Powered",
      title: "Your Personalized Meal Plan",
      subtitle: "Get a complete AI-generated plan in minutes. Detailed recipes, shopping list, and nutritional tracking.",
      cta: "Get Started",
      demo: "View Demo",
      stats: {
        plans: "Plans created",
        rating: "Rating",
        satisfaction: "Satisfaction",
      },
    },
    features: {
      badge: "Features",
      title: "Everything you need",
      subtitle: "Complete and personalized plans to achieve your goals",
      items: [
        {
          icon: "🤖",
          title: "Advanced AI",
          description: "Plans generated by artificial intelligence considering your specific needs and goals",
        },
        {
          icon: "📊",
          title: "Precise Macros",
          description: "Detailed calculation of calories, protein, carbs, and fat for each meal",
        },
        {
          icon: "🥗",
          title: "Detailed Recipes",
          description: "Step-by-step preparation with professional tips and substitution options",
        },
        {
          icon: "🛒",
          title: "Shopping List",
          description: "Organized by category to make your weekly shopping easier",
        },
      ],
    },
    pricing: {
      badge: "Plans",
      title: "Choose your plan",
      subtitle: "Receive your complete plan via email within 3 hours",
      days: "days",
      perDay: "per day",
      popular: "Most Popular",
      features: {
        days: "days meal plan",
        recipes: "Detailed recipes",
        shopping: "Shopping list",
        macros: "Macro calculations",
        pdf: "Professional PDF",
      },
      cta: "Get Started",
    },
    cta: {
      title: "Ready to transform your nutrition?",
      subtitle: "Start now and receive your personalized plan in minutes",
      button: "Create My Plan",
    },
  },
};

const pricingPlans = {
  BRL: [
    { days: 7, price: 19 },
    { days: 14, price: 29 },
    { days: 30, price: 39 },
    { days: 90, price: 59 },
  ],
  USD: [
    { days: 7, price: 9 },
    { days: 14, price: 19 },
    { days: 30, price: 29 },
    { days: 90, price: 39 },
  ],
};
