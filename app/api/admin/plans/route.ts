import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';

async function isAdmin(email: string): Promise<boolean> {
    const adminEmails = ['edimarbarros90@gmail.com'];
    return adminEmails.includes(email);
}

// GET - List all plans
export async function GET() {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail || !await isAdmin(user.primaryEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await pool.query(`
            SELECT * FROM plans ORDER BY days ASC
        `);

        return NextResponse.json({ plans: result.rows });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ plans: [] });
    }
}

// POST - Create or update plan
export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail || !await isAdmin(user.primaryEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, days, price_brl, price_usd, original_price_brl, original_price_usd, is_popular, is_active, features } = body;

        if (id) {
            // Update existing plan
            await pool.query(`
                UPDATE plans SET 
                    name = $1, days = $2, price_brl = $3, price_usd = $4,
                    original_price_brl = $5, original_price_usd = $6,
                    is_popular = $7, is_active = $8, features = $9,
                    updated_at = NOW()
                WHERE id = $10
            `, [name, days, price_brl, price_usd, original_price_brl, original_price_usd, is_popular, is_active, JSON.stringify(features || []), id]);

            return NextResponse.json({ success: true, message: 'Plano atualizado!' });
        } else {
            // Create new plan
            const result = await pool.query(`
                INSERT INTO plans (name, days, price_brl, price_usd, original_price_brl, original_price_usd, is_popular, is_active, features)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `, [name, days, price_brl, price_usd, original_price_brl, original_price_usd, is_popular, is_active, JSON.stringify(features || [])]);

            return NextResponse.json({ success: true, message: 'Plano criado!', id: result.rows[0].id });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// DELETE - Remove plan
export async function DELETE(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail || !await isAdmin(user.primaryEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 });
        }

        await pool.query('DELETE FROM plans WHERE id = $1', [id]);

        return NextResponse.json({ success: true, message: 'Plano removido!' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
