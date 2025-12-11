"use client";

import { SignIn, useUser } from "@stackframe/stack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function LoginContent() {
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    if (user) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "white", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>Redirecionando...</div>;
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="brand-header">
                    <h1>🥗 Meu Plano</h1>
                    <p>Acesse sua conta para ver seu plano alimentar</p>
                </div>

                <div className="stack-auth-wrapper">
                    <SignIn fullPage={false} />
                </div>

                <div className="footer-links">
                    <Link href="/" className="back-link">← Voltar ao início</Link>
                </div>
            </div>

            <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          width: 100%;
          max-width: 480px;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .brand-header {
           text-align: center;
           margin-bottom: 30px;
        }

        .brand-header h1 {
           font-size: 2rem;
           margin: 0 0 10px 0;
           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
        }

        .brand-header p {
           color: #666;
           font-size: 0.95rem;
           margin: 0;
        }

        .stack-auth-wrapper {
           /* Customize internal Stack styles if needed via CSS override or props */
           min-height: 300px;
        }

        .footer-links {
           margin-top: 20px;
           text-align: center;
           border-top: 1px solid #eee;
           padding-top: 20px;
        }

        .back-link {
           color: #666;
           text-decoration: none;
           font-size: 0.9rem;
           transition: color 0.2s;
        }

        .back-link:hover {
           color: #667eea;
        }
      `}</style>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            color: "white",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}>
            Carregando...
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LoginContent />
        </Suspense>
    );
}
