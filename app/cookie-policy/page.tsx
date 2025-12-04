"use client";

import Link from "next/link";

export default function CookiePolicyPage() {
    return (
        <main className="policy-page">
            <div className="container">
                <Link href="/" className="back-link">
                    ← Voltar para Home
                </Link>

                <h1>Política de Cookies</h1>

                <section>
                    <h2>1. O que são Cookies?</h2>
                    <p>
                        Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo
                        quando você visita um site. Eles ajudam o site a lembrar informações sobre
                        sua visita, tornando sua próxima visita mais fácil e o site mais útil.
                    </p>
                </section>

                <section>
                    <h2>2. Como Usamos Cookies</h2>
                    <p>
                        Utilizamos cookies para:
                    </p>
                    <ul>
                        <li>Manter você conectado durante sua sessão</li>
                        <li>Lembrar suas preferências (idioma, moeda)</li>
                        <li>Analisar como você usa nosso site</li>
                        <li>Melhorar a experiência do usuário</li>
                        <li>Processar pagamentos de forma segura</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Tipos de Cookies que Usamos</h2>

                    <h3>Cookies Essenciais</h3>
                    <p>
                        Necessários para o funcionamento básico do site. Sem eles, o site não
                        funcionaria corretamente.
                    </p>

                    <h3>Cookies de Desempenho</h3>
                    <p>
                        Coletam informações sobre como você usa nosso site, como quais páginas
                        você visita mais frequentemente.
                    </p>

                    <h3>Cookies de Funcionalidade</h3>
                    <p>
                        Permitem que o site lembre suas escolhas (como idioma ou região) e
                        forneça recursos aprimorados.
                    </p>

                    <h3>Cookies de Marketing</h3>
                    <p>
                        Usados para rastrear visitantes em sites para exibir anúncios relevantes
                        e envolventes.
                    </p>
                </section>

                <section>
                    <h2>4. Cookies de Terceiros</h2>
                    <p>
                        Alguns cookies são colocados por serviços de terceiros que aparecem em
                        nossas páginas:
                    </p>
                    <ul>
                        <li><strong>Stripe:</strong> Para processar pagamentos com segurança</li>
                        <li><strong>Google Analytics:</strong> Para análise de tráfego do site</li>
                        <li><strong>Vercel:</strong> Para hospedagem e desempenho</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Gerenciar Cookies</h2>
                    <p>
                        Você pode controlar e/ou excluir cookies conforme desejar. Você pode excluir
                        todos os cookies que já estão no seu computador e configurar a maioria dos
                        navegadores para impedir que eles sejam colocados.
                    </p>
                    <p>
                        <strong>Atenção:</strong> Se você desabilitar os cookies, algumas funcionalidades
                        do site podem não funcionar corretamente.
                    </p>
                </section>

                <section>
                    <h2>6. Como Desabilitar Cookies</h2>
                    <p>
                        A maioria dos navegadores permite que você:
                    </p>
                    <ul>
                        <li>Veja quais cookies você tem e os exclua individualmente</li>
                        <li>Bloqueie cookies de terceiros</li>
                        <li>Bloqueie cookies de sites específicos</li>
                        <li>Bloqueie todos os cookies</li>
                        <li>Exclua todos os cookies ao fechar o navegador</li>
                    </ul>
                    <p>
                        Consulte as configurações do seu navegador para mais informações.
                    </p>
                </section>

                <section>
                    <h2>7. Atualizações desta Política</h2>
                    <p>
                        Podemos atualizar esta Política de Cookies periodicamente. Recomendamos
                        que você revise esta página regularmente para se manter informado sobre
                        como usamos cookies.
                    </p>
                </section>

                <section>
                    <h2>8. Contato</h2>
                    <p>
                        Para questões sobre cookies:
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

        h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-top: 20px;
          margin-bottom: 10px;
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
