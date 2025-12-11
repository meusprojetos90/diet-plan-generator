import { stackServerApp } from "@/stack"
import { redirect } from "next/navigation"
import { getUserPlan } from "../actions"
import WorkoutPlayer from "./WorkoutPlayer"

export default async function WorkoutPage() {
    const user = await stackServerApp.getUser()

    if (!user) {
        redirect("/login")
    }

    const planData = await getUserPlan()

    if (!planData || !planData.plan) {
        redirect("/dashboard")
    }

    // Find today's workout
    const today = new Date()
    const startDate = new Date(planData.plan.start_date)
    const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const workoutDays = planData.plan.workout_plan?.days || []
    const todayWorkout = workoutDays.find((w: any) => w.day === dayDiff + 1) || workoutDays[0]

    if (!todayWorkout) {
        redirect("/dashboard")
    }

    // Format workout data for player
    const workoutData = {
        name: todayWorkout.focus || "Treino do Dia",
        duration: todayWorkout.duration || 45,
        exercises: (todayWorkout.exercises || []).map((e: any, idx: number) => ({
            id: idx,
            name: e.name,
            sets: e.sets || 3,
            reps: e.reps,
            // If reps is a time string like "30s", it's a timed exercise
            isTimed: typeof e.reps === 'string' && e.reps.includes('s'),
            duration: typeof e.reps === 'string' && e.reps.includes('s')
                ? parseInt(e.reps.replace('s', ''))
                : 0,
            restTime: 60 // Default rest time in seconds
        }))
    }

    return (
        <WorkoutPlayer
            workout={workoutData}
            planId={planData.plan.id}
            profileId={planData.plan.user_id}
        />
    )
}
