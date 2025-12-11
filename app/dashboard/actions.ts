"use server"

import pool from "@/lib/db"
import { stackServerApp } from "@/stack"

export async function getUserPlan() {
    const user = await stackServerApp.getUser()
    if (!user || !user.primaryEmail) return null

    const email = user.primaryEmail

    try {
        // 1. Get Profile/User ID
        const profileRes = await pool.query(
            'SELECT id FROM profiles WHERE email = $1',
            [email]
        )

        if (profileRes.rows.length === 0) return null
        const profileId = profileRes.rows[0].id

        // 2. Get Active Plan
        const planRes = await pool.query(`
            SELECT * FROM user_plans 
            WHERE user_id = $1 AND subscription_status = 'active' 
            ORDER BY created_at DESC LIMIT 1
        `, [profileId])

        if (planRes.rows.length === 0) return null
        const plan = planRes.rows[0]

        // 3. Get Daily Logs for this plan (progress)
        const logsRes = await pool.query(
            'SELECT * FROM daily_logs WHERE user_plan_id = $1',
            [plan.id]
        )

        return { plan, logs: logsRes.rows || [] }

    } catch (error) {
        console.error("Database error in getUserPlan:", error)
        return null
    }
}

export async function toggleMealCompletion(planId: string, profileId: string, date: string, mealId: number) {
    try {
        const mealIdStr = String(mealId)

        // Check if log exists
        const res = await pool.query(
            'SELECT * FROM daily_logs WHERE user_plan_id = $1 AND date = $2',
            [planId, date]
        )

        const existingLog = res.rows[0]

        if (existingLog) {
            // Update existing
            let currentMeals = (existingLog.meal_ids || []) as string[]
            if (currentMeals.includes(mealIdStr)) {
                currentMeals = currentMeals.filter(id => id !== mealIdStr)
            } else {
                currentMeals.push(mealIdStr)
            }

            await pool.query(
                `UPDATE daily_logs SET meal_ids = $1, updated_at = NOW() WHERE id = $2`,
                [currentMeals, existingLog.id]
            )
        } else {
            // Create new
            await pool.query(
                `INSERT INTO daily_logs (user_plan_id, user_id, date, meal_ids, workout_completed)
                 VALUES ($1, $2, $3, $4, $5)`,
                [planId, profileId, date, [mealIdStr], false]
            )
        }
    } catch (error) {
        console.error("Database error in toggleMealCompletion:", error)
        throw error
    }
}

export async function toggleWorkoutCompletion(planId: string, profileId: string, date: string) {
    try {
        // Check if log exists
        const res = await pool.query(
            'SELECT * FROM daily_logs WHERE user_plan_id = $1 AND date = $2',
            [planId, date]
        )

        const existingLog = res.rows[0]

        if (existingLog) {
            await pool.query(
                `UPDATE daily_logs SET workout_completed = $1, updated_at = NOW() WHERE id = $2`,
                [!existingLog.workout_completed, existingLog.id]
            )
        } else {
            await pool.query(
                `INSERT INTO daily_logs (user_plan_id, user_id, date, meal_ids, workout_completed)
                 VALUES ($1, $2, $3, $4, $5)`,
                [planId, profileId, date, [], true]
            )
        }
    } catch (error) {
        console.error("Database error in toggleWorkoutCompletion:", error)
        throw error
    }
}

export async function getPaymentHistory() {
    const user = await stackServerApp.getUser()
    if (!user || !user.primaryEmail) return []

    const email = user.primaryEmail

    try {
        // Get orders via customer email
        const ordersRes = await pool.query(`
            SELECT o.id, o.days, o.price, o.currency, o.status, o.created_at
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE c.email = $1 
            ORDER BY o.created_at DESC
        `, [email])

        return ordersRes.rows || []

    } catch (error) {
        console.error("Database error in getPaymentHistory:", error)
        return []
    }
}

// ==================== WEIGHT TRACKING ====================

export async function getUserHeightFromPlan(): Promise<number | null> {
    const user = await stackServerApp.getUser()
    if (!user || !user.primaryEmail) return null

    const email = user.primaryEmail

    try {
        const profileRes = await pool.query(
            'SELECT id FROM profiles WHERE email = $1',
            [email]
        )

        if (profileRes.rows.length === 0) return null
        const profileId = profileRes.rows[0].id

        // Get user's height from their latest plan intake
        const planRes = await pool.query(`
            SELECT intake FROM user_plans 
            WHERE user_id = $1 
            ORDER BY created_at DESC LIMIT 1
        `, [profileId])

        if (planRes.rows.length === 0) return null

        const intake = planRes.rows[0].intake
        return intake?.height || null

    } catch (error) {
        console.error("Database error in getUserHeightFromPlan:", error)
        return null
    }
}

export async function addWeightLog(weight: number, height: number, notes?: string) {
    const user = await stackServerApp.getUser()
    if (!user || !user.primaryEmail) {
        throw new Error("User not authenticated")
    }

    const email = user.primaryEmail

    try {
        const profileRes = await pool.query(
            'SELECT id FROM profiles WHERE email = $1',
            [email]
        )

        if (profileRes.rows.length === 0) {
            throw new Error("Profile not found")
        }

        const profileId = profileRes.rows[0].id
        const today = new Date().toISOString().split('T')[0]

        // Calculate BMI: weight (kg) / (height in meters)²
        const heightInMeters = height / 100
        const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2))

        // Upsert - insert or update if already exists for today
        await pool.query(`
            INSERT INTO weight_logs (user_id, weight, height, bmi, date, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, date) 
            DO UPDATE SET weight = $2, height = $3, bmi = $4, notes = $6, created_at = NOW()
        `, [profileId, weight, height, bmi, today, notes || null])

        return { success: true, bmi }

    } catch (error) {
        console.error("Database error in addWeightLog:", error)
        throw error
    }
}

export async function getWeightHistory(limit: number = 90) {
    const user = await stackServerApp.getUser()
    if (!user || !user.primaryEmail) return []

    const email = user.primaryEmail

    try {
        const profileRes = await pool.query(
            'SELECT id FROM profiles WHERE email = $1',
            [email]
        )

        if (profileRes.rows.length === 0) return []
        const profileId = profileRes.rows[0].id

        const logsRes = await pool.query(`
            SELECT id, weight, height, bmi, date, notes, created_at
            FROM weight_logs 
            WHERE user_id = $1 
            ORDER BY date DESC
            LIMIT $2
        `, [profileId, limit])

        return logsRes.rows || []

    } catch (error) {
        console.error("Database error in getWeightHistory:", error)
        return []
    }
}

