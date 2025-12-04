"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this to an API
        console.log("Form submitted:", formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <main className="contact-page">
            <div className="container">
                <Link href="/" className="back-link">
                    ← Voltar para Home
                </Link>

                <h1>Contate-nos</h1>

                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>Entre em Contato</h2>
                        <p>
                            Estamos aqui para ajudar! Entre em contato conosco através de qualquer
                            um dos canais abaixo ou envie uma mensagem usando o formulário.
                        </p>

                        <div className="contact-methods">
                            <div className="contact-method">
                                <div className="method-icon">📧</div>
                                <div className="method-content">
                                    <h3>Email</h3>
                                    <a href="mailto:support@example.com">support@example.com</a>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="method-icon">📱</div>
                                <div className="method-content">
                                    <h3>Telefone</h3>
                                    <a href="tel:+5511999999999">+55 11 99999-9999</a>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="method-icon">💬</div>
                                <div className="method-content">
                                    <h3>WhatsApp</h3>
                                    <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                                        Enviar mensagem
                                    </a>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="method-icon">⏰</div>
                                <div className="method-content">
                                    <h3>Horário de Atendimento</h3>
                                    <p>24 horas por dia, 7 dias por semana</p>
                                </div>
                            </div>
                        </div>

                        <div className="faq-section">
                            <h3>Perguntas Frequentes</h3>
                            <ul>
                                <li>
                                    <strong>Quanto tempo leva para receber meu plano?</strong>
                                    <br />
                                    Até 3 horas após a confirmação do pagamento.
                                </li>
                                <li>
                                    <strong>Posso solicitar alterações no plano?</strong>
                                    <br />
                                    Sim! Entre em contato conosco e teremos prazer em ajustar.
                                </li>
                                <li>
                                    <strong>Como funciona o reembolso?</strong>
                                    <br />
                                    Você tem 7 dias para solicitar reembolso total.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        <h2>Envie uma Mensagem</h2>

                        {submitted && (
                            <div className="success-message">
                                ✅ Mensagem enviada com sucesso! Responderemos em breve.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Nome Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Assunto</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione um assunto</option>
                                    <option value="support">Suporte Técnico</option>
                                    <option value="plan">Dúvidas sobre Plano</option>
                                    <option value="payment">Pagamento/Reembolso</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Mensagem</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder="Descreva sua dúvida ou mensagem..."
                                />
                            </div>

                            <button type="submit" className="submit-button">
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .contact-page {
          min-height: 100vh;
          padding: 60px 20px;
          background: #f8f9fa;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
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

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .contact-info,
        .contact-form-wrapper {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
          margin-bottom: 15px;
        }

        p {
          color: #555;
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 30px;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }

        .contact-method {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .method-icon {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .method-content {
          flex: 1;
        }

        .method-content h3 {
          margin-bottom: 5px;
          font-size: 1.1rem;
        }

        .method-content a {
          color: #667eea;
          font-weight: 600;
          transition: opacity 0.3s;
        }

        .method-content a:hover {
          opacity: 0.7;
        }

        .method-content p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
        }

        .faq-section {
          padding: 25px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .faq-section ul {
          list-style: none;
          padding: 0;
        }

        .faq-section li {
          margin-bottom: 20px;
          color: #555;
          line-height: 1.6;
        }

        .faq-section li:last-child {
          margin-bottom: 0;
        }

        .success-message {
          background: #10b981;
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        input,
        select,
        textarea {
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.3s;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        textarea {
          resize: vertical;
        }

        .submit-button {
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-info,
          .contact-form-wrapper {
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
