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
            SELECT 
                p.id, p.email, p.name, p.created_at,
                COUNT(up.id) as plans_count,
                MAX(up.created_at) as last_plan_date
            FROM profiles p
            LEFT JOIN user_plans up ON p.id = up.user_id
            GROUP BY p.id, p.email, p.name, p.created_at
            ORDER BY p.created_at DESC
            LIMIT 100
        `);

        return NextResponse.json({ clients: result.rows });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
