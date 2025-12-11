
import { NextRequest, NextResponse } from "next/server"
import { stackServerApp } from "@/stack"
import pool from "@/lib/db"

// Simple mock meal plan generator (no type dependency)
function generateSimpleMealPlan(days: number) {
    const meals = [
        { time: "08:00", name: "Café da Manhã", calories: 400 },
        { time: "10:30", name: "Lanche da Manhã", calories: 200 },
        { time: "13:00", name: "Almoço", calories: 600 },
        { time: "16:00", name: "Lanche da Tarde", calories: 200 },
        { time: "19:30", name: "Jantar", calories: 500 }
    ]

    return {
        days: Array.from({ length: days }, (_, i) => ({
            day: i + 1,
            total_calories: 1900,
            total_macros: { calories: 1900, protein: 120, carbs: 200, fat: 60, fiber: 25 },
            meals: meals.map(m => ({
                ...m,
                recipe: "Receita de exemplo",
                ingredients: [{ item: "Ingrediente", quantity: "100", unit: "g" }],
                macros: { calories: m.calories, protein: 20, carbs: 30, fat: 10, fiber: 5 },
                preparation_time: 15,
                difficulty: "easy"
            }))
        })),
        shopping_list: [
            { item: "Frango", quantity: "2kg", category: "Proteínas" },
            { item: "Arroz", quantity: "1kg", category: "Grãos" },
            { item: "Vegetais variados", quantity: "2kg", category: "Vegetais" }
        ],
        notes: "Plano de teste gerado automaticamente.",
        macros_summary: {
            daily_average: { calories: 1900, protein: 120, carbs: 200, fat: 60, fiber: 25 },
            weekly_total: { calories: 13300, protein: 840, carbs: 1400, fat: 420, fiber: 175 }
        }
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await stackServerApp.getUser()

        if (!user || !user.primaryEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const email = user.primaryEmail
        const name = user.displayName || email.split('@')[0]

        // 1. Ensure Profile Exists
        let profileId: string
        const profileRes = await pool.query('SELECT id FROM profiles WHERE email = $1', [email])

        if (profileRes.rows.length === 0) {
            const insertRes = await pool.query(
                'INSERT INTO profiles (email, name) VALUES ($1, $2) RETURNING id',
                [email, name]
            )
            profileId = insertRes.rows[0].id
        } else {
            profileId = profileRes.rows[0].id
        }

        // 2. Generate Mock Data
        const days = 30
        const intake = {
            gender: "male",
            age: 30,
            weight: 80,
            height: 180,
            goal: "lose_weight",
            activity_level: "moderate",
            diet_type: "omnivore",
            allergies: [],
            locale: "pt-BR"
        }

        const mealPlan = generateSimpleMealPlan(days)

        // Mock Workout Plan
        const workoutPlan = {
            days: Array.from({ length: days }, (_, i) => ({
                day: i + 1,
                focus: i % 2 === 0 ? "Superiores" : "Inferiores",
                duration: 45,
                exercises: [
                    { name: "Flexão de Braço", sets: 3, reps: 12 },
                    { name: "Agachamento", sets: 3, reps: 15 },
                    { name: "Prancha", sets: 3, reps: "30s" }
                ]
            }))
        }

        // 3. Insert Plan
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + days)

        const insertPlanRes = await pool.query(`
            INSERT INTO user_plans (
                user_id, intake, meal_plan, workout_plan, days, 
                start_date, end_date, subscription_status, 
                amount_paid, currency
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            ) RETURNING id`,
            [
                profileId,
                JSON.stringify(intake),
                JSON.stringify(mealPlan),
                JSON.stringify(workoutPlan),
                days,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
                "active",
                0.00,
                "BRL"
            ]
        )

        return NextResponse.json({
            success: true,
            planId: insertPlanRes.rows[0].id,
            message: "Test plan created successfully. Check your Dashboard."
        })

    } catch (error: any) {
        console.error("Seed error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
