import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente com service role para operações administrativas
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

// Types para o banco de dados
export interface Profile {
    id: string
    email: string
    name: string | null
    created_at: string
    updated_at: string
}

export interface UserPlan {
    id: string
    user_id: string
    intake: any
    meal_plan: any
    workout_plan: any | null
    days: number
    start_date: string
    end_date: string
    subscription_status: 'active' | 'expired' | 'cancelled'
    stripe_session_id: string | null
    stripe_payment_intent_id: string | null
    amount_paid: number | null
    currency: string
    created_at: string
    updated_at: string
}

export interface DailyProgress {
    id: string
    user_id: string
    plan_id: string
    date: string
    meals_completed: any[]
    workout_completed: boolean
    workout_completed_at: string | null
    workout_notes: string | null
    water_intake: number
    weight: number | null
    energy_level: number | null
    notes: string | null
    created_at: string
    updated_at: string
}
