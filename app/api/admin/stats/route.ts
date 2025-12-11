import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';

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

export async function GET() {
    try {
        const user = await stackServerApp.getUser();

        if (!user || !user.primaryEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = await isAdmin(user.primaryEmail);
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Total profiles/clients
        const clientsResult = await pool.query('SELECT COUNT(*) as total FROM profiles');
        const totalClients = parseInt(clientsResult.rows[0]?.total || '0');

        // Active clients
        const activeResult = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as total 
            FROM user_plans 
            WHERE subscription_status = 'active' 
            AND end_date >= CURRENT_DATE
        `);
        const activeClients = parseInt(activeResult.rows[0]?.total || '0');

        // Total orders
        const ordersResult = await pool.query(`
            SELECT COUNT(*) as total, COALESCE(SUM(price), 0) as revenue 
            FROM orders 
            WHERE status = 'paid'
        `);
        const totalOrders = parseInt(ordersResult.rows[0]?.total || '0');
        const totalRevenue = parseFloat(ordersResult.rows[0]?.revenue || '0');

        // Today's orders
        const todayResult = await pool.query(`
            SELECT COUNT(*) as total, COALESCE(SUM(price), 0) as revenue 
            FROM orders 
            WHERE status = 'paid' 
            AND created_at >= CURRENT_DATE
        `);
        const todayOrders = parseInt(todayResult.rows[0]?.total || '0');
        const todayRevenue = parseFloat(todayResult.rows[0]?.revenue || '0');

        // Recent orders
        const recentResult = await pool.query(`
            SELECT o.id, c.name as customer_name, c.email as customer_email, 
                   o.price, o.status, o.created_at
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
            LIMIT 10
        `);
        const recentOrders = recentResult.rows;

        return NextResponse.json({
            totalClients,
            activeClients,
            totalOrders,
            totalRevenue,
            todayOrders,
            todayRevenue,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
