import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';

async function isAdmin(email: string): Promise<boolean> {
    const adminEmails = ['edimarbarros90@gmail.com'];
    return adminEmails.includes(email);
}

export async function GET() {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail || !await isAdmin(user.primaryEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await pool.query(`
            SELECT o.id, c.name as customer_name, c.email as customer_email,
                   o.days, o.price, o.currency, o.status, o.created_at
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
            LIMIT 100
        `);

        const statsResult = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'paid') as paid,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COALESCE(SUM(price) FILTER (WHERE status = 'paid'), 0) as total_revenue
            FROM orders
        `);

        return NextResponse.json({
            orders: result.rows,
            stats: {
                total: parseInt(statsResult.rows[0]?.total || '0'),
                paid: parseInt(statsResult.rows[0]?.paid || '0'),
                pending: parseInt(statsResult.rows[0]?.pending || '0'),
                totalRevenue: parseFloat(statsResult.rows[0]?.total_revenue || '0')
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
