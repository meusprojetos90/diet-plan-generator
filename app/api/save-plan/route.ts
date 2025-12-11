import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req: NextRequest) {
    try {
        const {
            email,
            name,
            intake,
            mealPlan,
            workoutPlan,
            days,
            sessionId,
            paymentIntentId,
            amountPaid,
            currency,
        } = await req.json()

        // Validar dados obrigatórios
        if (!email || !intake || !mealPlan) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Criar ou buscar usuário no banco local (profiles)
        let userId: string

        const profileRes = await pool.query(
            'SELECT id FROM profiles WHERE email = $1',
            [email]
        )

        if (profileRes.rows.length > 0) {
            userId = profileRes.rows[0].id
        } else {
            // Criar novo usuário local
            const insertRes = await pool.query(
                'INSERT INTO profiles (email, name) VALUES ($1, $2) RETURNING id',
                [email, name || email]
            )
            userId = insertRes.rows[0].id
            // Note: In Stack Auth, user signs up separately. This local profile links via email.
        }

        // Calcular data de término
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + (days || 7))

        // Salvar plano
        const insertPlanRes = await pool.query(`
            INSERT INTO user_plans (
                user_id, intake, meal_plan, workout_plan, days, 
                start_date, end_date, subscription_status, 
                stripe_session_id, stripe_payment_intent_id, amount_paid, currency
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) RETURNING id`,
            [
                userId,
                intake,
                mealPlan,
                workoutPlan,
                days || 7,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
                "active",
                sessionId,
                paymentIntentId,
                amountPaid,
                currency || "BRL"
            ]
        )

        const planId = insertPlanRes.rows[0].id

        return NextResponse.json({
            success: true,
            userId,
            planId,
        })
    } catch (error) {
        console.error("Error in save-plan:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
