
import { stackServerApp } from "@/stack"
import pool from "@/lib/db"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. Get Authenticated User
    const user = await stackServerApp.getUser()

    // 2. Sync Profile to DB if Logged In
    if (user && user.primaryEmail) {
        try {
            const email = user.primaryEmail
            const name = user.displayName || email.split('@')[0]

            // Upsert Profile logic (check existence first)
            const res = await pool.query('SELECT id FROM profiles WHERE email = $1', [email])
            if (res.rows.length === 0) {
                console.log("Creating local profile for:", email)
                await pool.query(
                    'INSERT INTO profiles (email, name) VALUES ($1, $2)',
                    [email, name]
                )
            }
        } catch (error) {
            console.error("Dashboard profile sync error:", error)
            // Non-blocking: allow dashboard to render even if sync fails (though data might be missing)
        }
    }

    return (
        <section>
            {children}
        </section>
    )
}
