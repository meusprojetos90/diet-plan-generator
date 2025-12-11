import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import pool from '@/lib/db';

// POST - Request refund
export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { planId, reason } = body;

        if (!planId) {
            return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
        }

        // Get user profile
        const profileResult = await pool.query(
            'SELECT id FROM profiles WHERE email = $1',
            [user.primaryEmail]
        );

        if (profileResult.rows.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const profileId = profileResult.rows[0].id;

        // Get plan and check if within 7 days
        const planResult = await pool.query(
            `SELECT id, amount_paid, currency, start_date, user_id
             FROM user_plans 
             WHERE id = $1 AND user_id = $2`,
            [planId, profileId]
        );

        if (planResult.rows.length === 0) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        const plan = planResult.rows[0];
        const startDate = new Date(plan.start_date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff > 7) {
            return NextResponse.json({
                error: 'Período de reembolso expirado. Reembolsos podem ser solicitados em até 7 dias.'
            }, { status: 400 });
        }

        // Check if already requested
        const existingRequest = await pool.query(
            'SELECT id FROM refund_requests WHERE plan_id = $1 AND status != $2',
            [planId, 'rejected']
        );

        if (existingRequest.rows.length > 0) {
            return NextResponse.json({
                error: 'Já existe uma solicitação de reembolso para este plano.'
            }, { status: 400 });
        }

        // Create refund request
        const result = await pool.query(
            `INSERT INTO refund_requests (user_id, plan_id, amount, currency, reason)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [profileId, planId, plan.amount_paid || 0, plan.currency || 'BRL', reason || '']
        );

        return NextResponse.json({
            success: true,
            message: 'Solicitação de reembolso enviada com sucesso!',
            refundId: result.rows[0].id
        });

    } catch (error) {
        console.error('Refund request error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// GET - Check refund status
export async function GET(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const planId = searchParams.get('planId');

        // Get user profile
        const profileResult = await pool.query(
            'SELECT id FROM profiles WHERE email = $1',
            [user.primaryEmail]
        );

        if (profileResult.rows.length === 0) {
            return NextResponse.json({ refunds: [] });
        }

        const profileId = profileResult.rows[0].id;

        let query = `
            SELECT r.id, r.plan_id, r.amount, r.currency, r.status, r.reason, 
                   r.requested_at, r.processed_at, r.admin_notes
            FROM refund_requests r
            WHERE r.user_id = $1
        `;
        const params: (string | undefined)[] = [profileId];

        if (planId) {
            query += ' AND r.plan_id = $2';
            params.push(planId);
        }

        query += ' ORDER BY r.requested_at DESC';

        const result = await pool.query(query, params);

        return NextResponse.json({ refunds: result.rows });

    } catch (error) {
        console.error('Get refunds error:', error);
        return NextResponse.json({ refunds: [] });
    }
}
