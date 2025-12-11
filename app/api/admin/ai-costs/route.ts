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
            SELECT id, tokens_input, tokens_output, model, cost_usd, operation, created_at
            FROM ai_usage_logs
            ORDER BY created_at DESC
            LIMIT 100
        `);

        const statsResult = await pool.query(`
            SELECT 
                COUNT(*) as total_requests,
                COALESCE(SUM(tokens_input + tokens_output), 0) as total_tokens,
                COALESCE(SUM(cost_usd), 0) as total_cost,
                COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_requests,
                COALESCE(SUM(cost_usd) FILTER (WHERE created_at >= CURRENT_DATE), 0) as today_cost
            FROM ai_usage_logs
        `);

        return NextResponse.json({
            usage: result.rows,
            stats: {
                totalRequests: parseInt(statsResult.rows[0]?.total_requests || '0'),
                totalTokens: parseInt(statsResult.rows[0]?.total_tokens || '0'),
                totalCost: parseFloat(statsResult.rows[0]?.total_cost || '0'),
                todayRequests: parseInt(statsResult.rows[0]?.today_requests || '0'),
                todayCost: parseFloat(statsResult.rows[0]?.today_cost || '0')
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ usage: [], stats: { totalRequests: 0, totalTokens: 0, totalCost: 0, todayRequests: 0, todayCost: 0 } });
    }
}
