import { stackServerApp } from '@/stack';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import Link from 'next/link';

// Check if user is admin
async function isAdmin(email: string): Promise<boolean> {
    const adminEmails = ['edimarbarros90@gmail.com'];

    if (adminEmails.includes(email)) {
        return true;
    }

    try {
        const result = await pool.query(
            'SELECT id FROM admins WHERE email = $1',
            [email]
        );
        return result.rows.length > 0;
    } catch {
        return false;
    }
}

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        background: '#0f0f1a',
    } as React.CSSProperties,
    sidebar: {
        width: '260px',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        padding: '25px 0',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.1)',
    } as React.CSSProperties,
    sidebarHeader: {
        padding: '0 25px 25px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    } as React.CSSProperties,
    h1: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 700,
        margin: 0,
    } as React.CSSProperties,
    nav: {
        flex: 1,
        padding: '20px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    } as React.CSSProperties,
    navItem: {
        display: 'block',
        padding: '12px 15px',
        color: 'rgba(255,255,255,0.7)',
        borderRadius: '10px',
        fontSize: '0.95rem',
        textDecoration: 'none',
    } as React.CSSProperties,
    footer: {
        padding: '20px 15px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    } as React.CSSProperties,
    backLink: {
        display: 'block',
        padding: '12px 15px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.85rem',
        textDecoration: 'none',
    } as React.CSSProperties,
    main: {
        flex: 1,
        padding: '30px',
        overflowY: 'auto',
    } as React.CSSProperties,
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect('/login');
    }

    const userEmail = user.primaryEmail || '';
    const admin = await isAdmin(userEmail);

    if (!admin) {
        redirect('/dashboard');
    }

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <h1 style={styles.h1}>🛡️ Admin</h1>
                </div>
                <nav style={styles.nav}>
                    <Link href="/admin" style={styles.navItem}>
                        📊 Dashboard
                    </Link>
                    <Link href="/admin/clients" style={styles.navItem}>
                        👥 Clientes
                    </Link>
                    <Link href="/admin/orders" style={styles.navItem}>
                        💳 Pedidos
                    </Link>
                    <Link href="/admin/refunds" style={styles.navItem}>
                        💰 Reembolsos
                    </Link>
                    <Link href="/admin/plans" style={styles.navItem}>
                        📦 Planos
                    </Link>
                    <Link href="/admin/ai-costs" style={styles.navItem}>
                        🤖 Custos IA
                    </Link>
                    <Link href="/admin/leads" style={styles.navItem}>
                        📧 Leads
                    </Link>
                    <Link href="/admin/settings" style={styles.navItem}>
                        ⚙️ Configurações
                    </Link>
                </nav>
                <div style={styles.footer}>
                    <Link href="/dashboard" style={styles.backLink}>
                        ← Voltar ao Dashboard
                    </Link>
                </div>
            </aside>
            <main style={styles.main}>
                {children}
            </main>
        </div>
    );
}
