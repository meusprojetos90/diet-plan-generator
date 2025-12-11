import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import TrackingScripts from "@/components/TrackingScripts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Plano Alimentar Personalizado | Personalized Meal Plan",
    description: "Planos alimentares personalizados gerados por IA | AI-powered personalized meal plans",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <TrackingScripts />
                <StackProvider app={stackServerApp} lang="pt-BR">
                    <StackTheme>
                        {children}
                    </StackTheme>
                </StackProvider>
            </body>
        </html>
    );
}

