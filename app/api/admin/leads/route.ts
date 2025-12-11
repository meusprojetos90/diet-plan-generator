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
            SELECT id, email, name, phone, source, status, created_at, converted_at
            FROM leads
            ORDER BY created_at DESC
            LIMIT 100
        `);

        const statsResult = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'new') as new,
                COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
                COUNT(*) FILTER (WHERE status = 'converted') as converted
            FROM leads
        `);

        return NextResponse.json({
            leads: result.rows,
            stats: {
                total: parseInt(statsResult.rows[0]?.total || '0'),
                new: parseInt(statsResult.rows[0]?.new || '0'),
                contacted: parseInt(statsResult.rows[0]?.contacted || '0'),
                converted: parseInt(statsResult.rows[0]?.converted || '0')
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ leads: [], stats: { total: 0, new: 0, contacted: 0, converted: 0 } });
    }
}
