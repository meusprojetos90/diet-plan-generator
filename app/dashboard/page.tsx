import { stackServerApp } from "@/stack"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import { getUserPlan } from "./actions"

export default async function DashboardPage() {
    const user = await stackServerApp.getUser()

    if (!user) {
        redirect("/handler/sign-in?redirect_url=" + encodeURIComponent("/dashboard"))
    }

    // Adapt Stack user to expected format
    const dashboardUser = {
        name: user.displayName,
        email: user.primaryEmail
    }

    // Fetch Plan Data
    let stats = undefined
    let todayMeals: any[] = []
    let todayWorkout: any = null
    let todayLogs: any = null
    let planId: string | null = null
    let profileId: string | null = null

    const planData = await getUserPlan()

    if (planData && planData.plan) {
        planId = planData.plan.id
        profileId = planData.plan.user_id

        // Extract stats from the first day of the plan
        const firstDay = planData.plan.meal_plan?.days?.[0]
        if (firstDay) {
            stats = {
                calories: firstDay.total_calories || 0,
                protein: firstDay.total_macros?.protein || 0,
                carbs: firstDay.total_macros?.carbs || 0,
                fat: firstDay.total_macros?.fat || 0
            }
        }

        // Find today's plan
        const today = new Date()
        const startDate = new Date(planData.plan.start_date)
        const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

        const days = planData.plan.meal_plan?.days || []
        const workoutDays = planData.plan.workout_plan?.days || []

        // Find the day in the plan that matches today
        const todayPlan = days.find((d: any) => d.day === dayDiff + 1) || days[0]

        if (todayPlan) {
            todayMeals = (todayPlan.meals || []).map((m: any, idx: number) => ({
                id: idx,
                name: m.name || m.time,
                time: m.time,
                calories: m.macros?.calories || 0
            }))
        }

        // Find workout for today
        const workoutForToday = workoutDays.find((w: any) => w.day === dayDiff + 1) || workoutDays[0]
        if (workoutForToday) {
            todayWorkout = {
                name: workoutForToday.focus || "Treino do Dia",
                duration: workoutForToday.duration || 45,
                exercises: (workoutForToday.exercises || []).map((e: any, idx: number) => ({
                    id: idx,
                    name: e.name,
                    sets: e.sets,
                    reps: e.reps
                }))
            }
        }

        // Check today's logs for completion status
        const todayStr = today.toISOString().split('T')[0]
        const log = planData.logs.find((l: any) => l.date === todayStr)
        if (log) {
            todayLogs = {
                completedMeals: log.meal_ids || [],
                completedExercises: log.exercise_ids || [],
                workoutCompleted: log.workout_completed || false
            }
        }
    }

    return (
        <DashboardClient
            user={dashboardUser}
            stats={stats}
            todayMeals={todayMeals}
            todayWorkout={todayWorkout}
            todayLogs={todayLogs}
            planId={planId}
            profileId={profileId}
        />
    )
}

