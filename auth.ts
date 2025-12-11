import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@auth/supabase-adapter"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const config: any = {
    providers: [
        Credentials({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Temporário: validação básica
                // TODO: Integrar com Supabase Auth
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Por enquanto, aceitar qualquer email/senha para desenvolvimento
                return {
                    id: "temp-id",
                    email: credentials.email as string,
                    name: credentials.email as string,
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
        signOut: "/",
        error: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
}

if (supabaseUrl && supabaseServiceKey) {
    // @ts-ignore
    config.adapter = SupabaseAdapter({
        url: supabaseUrl,
        secret: supabaseServiceKey,
    })
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)

