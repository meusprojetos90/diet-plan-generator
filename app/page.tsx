"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [locale, setLocale] = useState<"pt-BR" | "en">("pt-BR");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [mounted, setMounted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

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

  // Auto-rotate features every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
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
            <h1 className="hero-title">{t.hero.title}</h1>

            <p className="hero-subtitle">{t.hero.subtitle}</p>

            <div className="gender-selection">
              <p className="gender-label">{t.hero.genderLabel}</p>
              <div className="gender-cards">
                <Link href="/quiz?gender=male" className="gender-card">
                  <div className="gender-icon">👨</div>
                  <span>{t.hero.male}</span>
                </Link>
                <Link href="/quiz?gender=female" className="gender-card">
                  <div className="gender-icon">👩</div>
                  <span>{t.hero.female}</span>
                </Link>
              </div>
            </div>

            <div className="hero-support">
              <p>{t.hero.question}</p>
              <a href="mailto:support@example.com" className="support-link">
                {t.hero.contactSupport}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="what-you-get">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.whatYouGet.title}</h2>
          </div>

          <div className="features-carousel">
            <div className="carousel-track" style={{ transform: `translateX(-${currentFeature * 100}%)` }}>
              {t.whatYouGet.items.map((feature, index) => (
                <div key={index} className="carousel-slide">
                  <div className="feature-showcase">
                    <div className="feature-icon-large">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-dots">
              {t.whatYouGet.items.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${currentFeature === index ? "active" : ""}`}
                  onClick={() => setCurrentFeature(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.testimonials.title}</h2>
          </div>

          <div className="testimonials-grid">
            {t.testimonials.items.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="star">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results">
        <div className="container">
          <div className="results-content">
            <div className="results-badge">{t.results.badge}</div>
            <blockquote className="results-quote">
              "{t.results.quote}"
            </blockquote>

            <div className="gender-selection">
              <p className="gender-label">{t.results.genderLabel}</p>
              <div className="gender-cards">
                <Link href="/quiz?gender=male" className="gender-card">
                  <div className="gender-icon">👨</div>
                  <span>{t.results.male}</span>
                </Link>
                <Link href="/quiz?gender=female" className="gender-card">
                  <div className="gender-icon">👩</div>
                  <span>{t.results.female}</span>
                </Link>
              </div>
            </div>

            <p className="results-cta-text">{t.results.ctaText}</p>
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

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>{t.cta.title}</h2>
            <p>{t.cta.subtitle}</p>

            <div className="gender-selection">
              <p className="gender-label">{t.cta.genderLabel}</p>
              <div className="gender-cards">
                <Link href="/quiz?gender=male" className="gender-card">
                  <div className="gender-icon">👨</div>
                  <span>{t.cta.male}</span>
                </Link>
                <Link href="/quiz?gender=female" className="gender-card">
                  <div className="gender-icon">👩</div>
                  <span>{t.cta.female}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h4>{t.footer.product.title}</h4>
              <ul>
                <li><Link href="/subscription">{t.footer.product.subscription}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>{t.footer.terms.title}</h4>
              <ul>
                <li><Link href="/refund-policy">{t.footer.terms.refund}</Link></li>
                <li><Link href="/privacy-policy">{t.footer.terms.privacy}</Link></li>
                <li><Link href="/terms-of-service">{t.footer.terms.terms}</Link></li>
                <li><Link href="/subscription-terms">{t.footer.terms.subscriptionTerms}</Link></li>
                <li><Link href="/cookie-policy">{t.footer.terms.cookies}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>{t.footer.company.title}</h4>
              <ul>
                <li><Link href="/about">{t.footer.company.about}</Link></li>
                <li><Link href="/contact">{t.footer.company.contact}</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="disclaimer">{t.footer.disclaimer}</p>
            <div className="footer-contact">
              <p>{t.footer.companyName}</p>
              <a href="mailto:support@example.com">support@example.com</a>
              <a href="tel:+5511999999999">+55 11 99999-9999</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 90vh;
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

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 25px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          line-height: 1.6;
          margin-bottom: 50px;
          opacity: 0.95;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .gender-selection {
          margin: 40px 0;
        }

        .gender-label {
          font-size: 1.2rem;
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
          background: rgba(255, 255, 255, 0.95);
          color: #667eea;
          padding: 30px 50px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          min-width: 180px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 3px solid transparent;
        }

        .gender-card:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          border-color: #667eea;
        }

        .gender-icon {
          font-size: 3rem;
        }

        .gender-card span {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .hero-support {
          margin-top: 50px;
          font-size: 1rem;
          opacity: 0.9;
        }

        .support-link {
          color: white;
          text-decoration: underline;
          font-weight: 600;
          margin-left: 5px;
          transition: opacity 0.3s;
        }

        .support-link:hover {
          opacity: 0.8;
        }

        /* What You Get Section */
        .what-you-get {
          padding: 100px 20px;
          background: #f8f9fa;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
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

        .features-carousel {
          position: relative;
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
        }

        .carousel-track {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }

        .carousel-slide {
          min-width: 100%;
          padding: 20px;
        }

        .feature-showcase {
          background: white;
          padding: 60px 40px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .feature-icon-large {
          font-size: 4rem;
          margin-bottom: 30px;
        }

        .feature-showcase h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .feature-showcase p {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.7;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 30px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ddd;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dot.active {
          background: #667eea;
          width: 32px;
          border-radius: 6px;
        }

        /* Testimonials Section */
        .testimonials {
          padding: 100px 20px;
          background: white;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .testimonial-card {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
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
          font-size: 1.5rem;
          font-weight: 700;
        }

        .testimonial-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 5px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          font-size: 0.9rem;
        }

        .testimonial-text {
          color: #555;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* Results Section */
        .results {
          padding: 100px 20px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          text-align: center;
        }

        .results-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .results-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .results-quote {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 50px;
          font-style: italic;
        }

        .results-cta-text {
          font-size: 1.2rem;
          margin-top: 30px;
          opacity: 0.95;
        }

        /* Pricing Section */
        .pricing {
          padding: 100px 20px;
          background: #f8f9fa;
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

        /* Footer */
        .footer {
          background: #1a1a1a;
          color: #fff;
          padding: 60px 20px 30px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-column h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #fff;
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
        }

        .footer-column li {
          margin-bottom: 12px;
        }

        .footer-column a {
          color: #aaa;
          transition: color 0.3s;
          font-size: 0.95rem;
        }

        .footer-column a:hover {
          color: #667eea;
        }

        .footer-bottom {
          border-top: 1px solid #333;
          padding-top: 30px;
          text-align: center;
        }

        .disclaimer {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 20px;
          line-height: 1.6;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.9rem;
          color: #aaa;
        }

        .footer-contact a {
          color: #667eea;
          transition: color 0.3s;
        }

        .footer-contact a:hover {
          color: #764ba2;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 80px 20px 60px;
          }

          .gender-cards {
            flex-direction: column;
            align-items: center;
          }

          .gender-card {
            width: 100%;
            max-width: 300px;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.popular {
            transform: scale(1);
          }

          .pricing-card.popular:hover {
            transform: translateY(-10px);
          }

          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}

const translations = {
  "pt-BR": {
    hero: {
      title: "Torne-se na melhor versão de si mesmo",
      subtitle: "Responda ao nosso Questionário para obter um plano de refeições pessoal e atingir as suas metas de peso!",
      genderLabel: "Selecione o seu gênero",
      male: "Masculino",
      female: "Feminino",
      question: "Tem alguma pergunta?",
      contactSupport: "Contactar o nosso apoio",
    },
    whatYouGet: {
      title: "O que se obtém com o App",
      items: [
        {
          icon: "📋",
          title: "Plano de refeições personalizado",
          description: "Contém ingredientes, preparação passo a passo, receitas extras para trocar e valor nutricional.",
        },
        {
          icon: "🏃",
          title: "Exercícios para queimar gordura",
          description: "Fale-nos de si para que possamos criar um plano de refeições personalizado adaptado às suas necessidades, preferências e objetivos.",
        },
        {
          icon: "💬",
          title: "Apoio profissional",
          description: "Não hesite em fazer a sua pergunta. Estamos aqui para o ajudar a resolver qualquer tipo de dificuldade 24 horas por dia, 7 dias por semana.",
        },
        {
          icon: "📚",
          title: "Noções básicas de um estilo de vida saudável",
          description: "Informe-se sobre como desenvolver um estilo de vida mais saudável. Saiba mais sobre alimentação, sono, stress, etc.",
        },
      ],
    },
    testimonials: {
      title: "Comentários",
      items: [
        {
          name: "Katie Barr",
          review: "Excelente aplicativo! Perdi 8kg em 2 meses seguindo o plano. Muito recomendado!",
        },
        {
          name: "Prettypink Elois",
          review: "As receitas são deliciosas e fáceis de fazer. Finalmente encontrei algo que funciona!",
        },
        {
          name: "Marcus Hart",
          review: "O suporte é incrível, sempre prontos para ajudar. Estou muito satisfeito com os resultados.",
        },
        {
          name: "Diane Castillo",
          review: "Mudou completamente minha relação com a comida. Aprendi a comer de forma saudável e sustentável.",
        },
      ],
    },
    results: {
      badge: "Resultado da perda de peso",
      quote: "O App ensinou-me a perder peso corretamente, então perdi 12kg em 3 meses! Altamente recomendado!",
      genderLabel: "Selecione o seu gênero",
      male: "Masculino",
      female: "Feminino",
      ctaText: "Comece o Quiz e alcance o seu objectivo de saúde!",
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
      title: "Inspire-se com diversão & resultados!",
      subtitle: "Obtenha o seu plano de refeições pessoal, motivação diária e programa de estudos",
      genderLabel: "Selecione o seu gênero",
      male: "Masculino",
      female: "Feminino",
    },
    footer: {
      product: {
        title: "Produto",
        subscription: "A minha assinatura",
      },
      terms: {
        title: "Termos & Políticas",
        refund: "Política de Reembolso",
        privacy: "Política de Privacidade",
        terms: "Termos de Serviço",
        subscriptionTerms: "Termos da Assinatura",
        cookies: "Política de Cookies",
      },
      company: {
        title: "Empresa",
        about: "Sobre nós",
        contact: "Contate-nos",
      },
      disclaimer: "Aviso Legal: Este site destina-se apenas a fins educacionais e de bem-estar geral. As informações fornecidas não substituem aconselhamento ou tratamento médico. Consulte sempre seu médico ou profissional de saúde antes de iniciar qualquer programa de perda de peso.",
      companyName: "Sua Empresa LTDA",
    },
  },
  en: {
    hero: {
      title: "Become the best version of yourself",
      subtitle: "Answer our Quiz to get a personal meal plan and achieve your weight goals!",
      genderLabel: "Select your gender",
      male: "Male",
      female: "Female",
      question: "Have a question?",
      contactSupport: "Contact our support",
    },
    whatYouGet: {
      title: "What you get with the App",
      items: [
        {
          icon: "📋",
          title: "Personalized meal plan",
          description: "Contains ingredients, step-by-step preparation, extra recipes to swap, and nutritional value.",
        },
        {
          icon: "🏃",
          title: "Fat-burning exercises",
          description: "Tell us about yourself so we can create a personalized meal plan tailored to your needs, preferences, and goals.",
        },
        {
          icon: "💬",
          title: "Professional support",
          description: "Don't hesitate to ask your question. We're here to help you solve any kind of difficulty 24/7.",
        },
        {
          icon: "📚",
          title: "Healthy lifestyle basics",
          description: "Learn how to develop a healthier lifestyle. Learn more about nutrition, sleep, stress, etc.",
        },
      ],
    },
    testimonials: {
      title: "Reviews",
      items: [
        {
          name: "Katie Barr",
          review: "Excellent app! Lost 18lbs in 2 months following the plan. Highly recommended!",
        },
        {
          name: "Prettypink Elois",
          review: "The recipes are delicious and easy to make. Finally found something that works!",
        },
        {
          name: "Marcus Hart",
          review: "The support is amazing, always ready to help. Very satisfied with the results.",
        },
        {
          name: "Diane Castillo",
          review: "Completely changed my relationship with food. Learned to eat healthy and sustainably.",
        },
      ],
    },
    results: {
      badge: "Weight loss result",
      quote: "The App taught me how to lose weight properly, so I lost 26lbs in 3 months! Highly recommended!",
      genderLabel: "Select your gender",
      male: "Male",
      female: "Female",
      ctaText: "Start the Quiz and achieve your health goal!",
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
      title: "Get inspired with fun & results!",
      subtitle: "Get your personal meal plan, daily motivation, and study program",
      genderLabel: "Select your gender",
      male: "Male",
      female: "Female",
    },
    footer: {
      product: {
        title: "Product",
        subscription: "My subscription",
      },
      terms: {
        title: "Terms & Policies",
        refund: "Refund Policy",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        subscriptionTerms: "Subscription Terms",
        cookies: "Cookie Policy",
      },
      company: {
        title: "Company",
        about: "About us",
        contact: "Contact us",
      },
      disclaimer: "Disclaimer: This site is intended for educational and general wellness purposes only. The information provided does not replace medical advice or treatment. Always consult your doctor or healthcare professional before starting any weight loss program.",
      companyName: "Your Company LLC",
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
    { days: 90, price: 49 },
  ],
};
