import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// Public API - no auth required
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT id, name, days, price_brl, price_usd, 
                   original_price_brl, original_price_usd, 
                   is_popular, features
            FROM plans 
            WHERE is_active = true 
            ORDER BY days ASC
        `);

        return NextResponse.json({
            plans: result.rows.map((p: any) => ({
                ...p,
                price_brl: parseFloat(p.price_brl),
                price_usd: parseFloat(p.price_usd),
                original_price_brl: p.original_price_brl ? parseFloat(p.original_price_brl) : null,
                original_price_usd: p.original_price_usd ? parseFloat(p.original_price_usd) : null,
                features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
            }))
        });
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json({ plans: [] });
    }
}
