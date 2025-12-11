import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';

async function isAdmin(email: string): Promise<boolean> {
    const adminEmails = ['edimarbarros90@gmail.com'];
    return adminEmails.includes(email);
}

// GET - List all refund requests
export async function GET() {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail || !await isAdmin(user.primaryEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await pool.query(`
            SELECT r.id, r.amount, r.currency, r.reason, r.status, r.requested_at, 
                   r.processed_at, r.admin_notes, r.processed_by,
                   p.email as user_email, p.name as user_name,
                   up.days as plan_days, up.start_date as plan_start
            FROM refund_requests r
            JOIN profiles p ON r.user_id = p.id
            JOIN user_plans up ON r.plan_id = up.id
            ORDER BY r.requested_at DESC
            LIMIT 100
        `);

        const statsResult = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'approved') as approved,
                COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
                COALESCE(SUM(amount) FILTER (WHERE status = 'approved'), 0) as total_refunded
            FROM refund_requests
        `);

        return NextResponse.json({
            refunds: result.rows,
            stats: {
                total: parseInt(statsResult.rows[0]?.total || '0'),
                pending: parseInt(statsResult.rows[0]?.pending || '0'),
                approved: parseInt(statsResult.rows[0]?.approved || '0'),
                rejected: parseInt(statsResult.rows[0]?.rejected || '0'),
                totalRefunded: parseFloat(statsResult.rows[0]?.total_refunded || '0')
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ refunds: [], stats: { total: 0, pending: 0, approved: 0, rejected: 0, totalRefunded: 0 } });
    }
}

// POST - Approve or reject refund
export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail || !await isAdmin(user.primaryEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { refundId, action, notes } = body;

        if (!refundId || !action) {
            return NextResponse.json({ error: 'Missing refundId or action' }, { status: 400 });
        }

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        await pool.query(
            `UPDATE refund_requests 
             SET status = $1, admin_notes = $2, processed_at = NOW(), processed_by = $3
             WHERE id = $4`,
            [newStatus, notes || '', user.primaryEmail, refundId]
        );

        // If approved, cancel the plan
        if (action === 'approve') {
            await pool.query(
                `UPDATE user_plans 
                 SET subscription_status = 'cancelled'
                 WHERE id = (SELECT plan_id FROM refund_requests WHERE id = $1)`,
                [refundId]
            );
        }

        return NextResponse.json({
            success: true,
            message: action === 'approve' ? 'Reembolso aprovado!' : 'Reembolso rejeitado'
        });

    } catch (error) {
        console.error('Error processing refund:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
