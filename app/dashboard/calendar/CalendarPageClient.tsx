"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Calendar from "../components/Calendar"
import DailyPlan from "../components/DailyPlan"
import { getUserPlan, toggleMealCompletion, toggleWorkoutCompletion } from "../actions"

// Types matching DailyPlan expectation
interface MealItem {
    id: number | string // Allow both for flexibility
    name: string
    time: string
    items: string[]
    calories: number
    completed: boolean
}

interface WorkoutItem {
    id: string
    name: string
    duration: string
    exercises: { name: string; sets: string }[]
    completed: boolean
}

type DayPlan = {
    meals: MealItem[]
    workout: WorkoutItem | null
}

export default function CalendarPageClient() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [planData, setPlanData] = useState<Record<string, DayPlan>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [planId, setPlanId] = useState<string | null>(null)
    const [profileId, setProfileId] = useState<string | null>(null)
    const [useMockData, setUseMockData] = useState(false)

    // Load data
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true)
                const data = await getUserPlan()

                if (!data || !data.plan) {
                    console.log("No plan found, using mock data")
                    setUseMockData(true)
                    setPlanData(generateMockData())
                } else {
                    setPlanId(data.plan.id)
                    setProfileId(data.plan.user_id)

                    // Parse DB plan into UI format
                    const parsedPlan = parseDbPlan(data.plan, data.logs)
                    setPlanData(parsedPlan)
                }
            } catch (error) {
                console.error("Failed to load plan", error)
                setUseMockData(true)
                setPlanData(generateMockData())
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const parseDbPlan = (plan: any, logs: any[]) => {
        // This parser needs to map the JSON structure from AI to our UI structure
        // And apply "completed" status from logs

        // Simplified mapping assuming 'plan.meal_plan.days' array exists
        const days = plan.meal_plan?.days || []
        const workoutDays = plan.workout_plan?.days || []
        const planMap: Record<string, DayPlan> = {}

        // We need to map relative days (day 1, day 2...) to real dates
        // Starting from plan.start_date
        const startDate = new Date(plan.start_date)

        days.forEach((day: any) => {
            // Calculate date for this day index (0-based inside generation, usually 1-based in JSON)
            const dayOffset = (day.day || 1) - 1
            const date = new Date(startDate)
            date.setDate(date.getDate() + dayOffset)
            const dateKey = date.toDateString()

            // Find logs for this date - l.date may be a Date object from PostgreSQL
            const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
            const log = logs.find((l: any) => {
                const logDate = l.date instanceof Date
                    ? l.date.toISOString().split('T')[0]
                    : String(l.date).split('T')[0]
                return logDate === dateStr
            })
            const completedMeals = log?.meal_ids || []
            const workoutCompleted = log?.workout_completed || false

            // Parse meals - handle different structures (AI generated vs mock)
            const meals: MealItem[] = (day.meals || []).map((m: any, idx: number) => {
                // Build items from ingredients or use recipe
                let items: string[] = []
                if (m.ingredients && m.ingredients.length > 0) {
                    items = m.ingredients.map((i: any) => {
                        if (typeof i === 'string') return i
                        const qty = i.quantity || ''
                        const unit = i.unit || ''
                        return `${i.item} (${qty}${unit})`
                    })
                }
                // Add recipe as an item if available
                if (m.recipe) {
                    items.push(`📝 ${m.recipe}`)
                }

                return {
                    id: idx,
                    name: m.name || m.time || `Refeição ${idx + 1}`,
                    time: m.time || '',
                    items: items,
                    calories: m.macros?.calories || 0,
                    completed: completedMeals.includes(String(idx))
                }
            })

            // Find workout for this day - check both day.workout and workout_plan.days
            const workoutForDay = day.workout || workoutDays.find((w: any) => w.day === day.day)

            const workout: WorkoutItem | null = workoutForDay ? {
                id: `wk-${day.day}`,
                name: workoutForDay.focus || workoutForDay.name || "Treino do Dia",
                duration: `${workoutForDay.duration || 45} min`,
                exercises: (workoutForDay.exercises || []).map((e: any) => ({
                    name: e.name,
                    sets: `${e.sets}x${e.reps}`
                })),
                completed: workoutCompleted
            } : null

            planMap[dateKey] = { meals, workout }
        })

        return planMap
    }

    // Mock Data Generator (extracted for reuse)
    const generateMockData = () => {
        const data: Record<string, DayPlan> = {}
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() // Current month

        const generateForMonth = (m: number) => {
            const daysInMonth = new Date(year, m + 1, 0).getDate()
            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(year, m, d)
                const dateKey = date.toDateString()
                const dayOfWeek = date.getDay()
                const isRestDay = dayOfWeek === 0

                const meals: MealItem[] = [
                    { id: 1, name: "Café da Manhã", time: "08:00", items: ["Ovos mexidos (2 un)", "Pão integral (2 fatias)", "Café preto"], calories: 350, completed: false },
                    { id: 2, name: "Almoço", time: "12:30", items: ["Peito de frango grelhado (150g)", "Arroz integral (100g)", "Salada verde"], calories: 550, completed: false },
                    { id: 3, name: "Lanche", time: "16:00", items: ["Iogurte natural", "Fruta"], calories: 250, completed: false },
                    { id: 4, name: "Jantar", time: "20:00", items: ["Peixe assado", "Legumes"], calories: 400, completed: false },
                ]
                // Random completion for past days
                if (date < today) meals.forEach(m => m.completed = Math.random() > 0.3)

                const workout: WorkoutItem | null = isRestDay ? null : {
                    id: `wk-${d}`,
                    name: dayOfWeek % 2 === 0 ? "Treino A - Superiores" : "Treino B - Inferiores",
                    duration: "45 min",
                    exercises: [
                        { name: "Aquecimento", sets: "5 min" },
                        { name: "Exercício Principal", sets: "4x12" },
                        { name: "Exercício Auxiliar", sets: "3x15" },
                    ],
                    completed: date < today && Math.random() > 0.4
                }
                data[dateKey] = { meals, workout }
            }
        }

        generateForMonth(month)
        generateForMonth(month + 1)
        return data
    }


    const handleToggleMeal = async (mealId: number | string) => {
        const dateKey = selectedDate.toDateString()

        // Optimistic Update
        setPlanData(prev => {
            const currentDay = prev[dateKey]
            if (!currentDay) return prev
            return {
                ...prev,
                [dateKey]: {
                    ...currentDay,
                    meals: currentDay.meals.map(m =>
                        m.id === mealId ? { ...m, completed: !m.completed } : m
                    )
                }
            }
        })

        if (!useMockData && planId && profileId) {
            try {
                // Ensure ID is number if that's what API expects, or string
                const idToSend = Number(mealId)
                await toggleMealCompletion(planId, profileId, selectedDate.toISOString().split('T')[0], idToSend)
            } catch (e) {
                console.error("Failed to save meal toggle", e)
                // Revert on error? For now, silent fail or toast
            }
        }
    }

    const handleToggleWorkout = async () => {
        const dateKey = selectedDate.toDateString()

        // Optimistic Update
        setPlanData(prev => {
            const currentDay = prev[dateKey]
            if (!currentDay || !currentDay.workout) return prev
            return {
                ...prev,
                [dateKey]: {
                    ...currentDay,
                    workout: {
                        ...currentDay.workout,
                        completed: !currentDay.workout.completed
                    }
                }
            }
        })

        if (!useMockData && planId && profileId) {
            try {
                await toggleWorkoutCompletion(planId, profileId, selectedDate.toISOString().split('T')[0])
            } catch (e) {
                console.error("Failed to save workout toggle", e)
            }
        }
    }

    // Derive indicators for Calendar
    const calendarStatus = useMemo(() => {
        const status: Record<string, any> = {}
        Object.keys(planData).forEach(key => {
            const day = planData[key]
            status[key] = {
                hasMeals: day.meals.length > 0,
                mealsCompleted: day.meals.length > 0 && day.meals.every(m => m.completed),
                hasWorkout: !!day.workout,
                workoutCompleted: day.workout?.completed
            }
        })
        return status
    }, [planData])

    // Current selected day data
    const currentDayData = planData[selectedDate.toDateString()] || { meals: [], workout: null }

    // Calculate weekly stats
    const weeklyStats = useMemo(() => {
        let totalMeals = 0
        let completedMeals = 0
        let totalWorkouts = 0
        let completedWorkouts = 0

        Object.values(planData).forEach(day => {
            totalMeals += day.meals.length
            completedMeals += day.meals.filter(m => m.completed).length
            if (day.workout) {
                totalWorkouts++
                if (day.workout.completed) completedWorkouts++
            }
        })

        return {
            meals: { total: totalMeals, completed: completedMeals },
            workouts: { total: totalWorkouts, completed: completedWorkouts }
        }
    }, [planData])

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h1>🥗 Meu Plano</h1>
                </div>
                <div className="nav-links">
                    <Link href="/dashboard" className="nav-link">
                        Home
                    </Link>
                    <Link href="/dashboard/calendar" className="nav-link active">
                        Calendário
                    </Link>
                    <Link href="/dashboard/weight" className="nav-link">
                        Peso
                    </Link>
                    <Link href="/dashboard/workout" className="nav-link">
                        Treino
                    </Link>
                    <Link href="/dashboard/profile" className="nav-link">
                        Perfil
                    </Link>
                </div>
                <div className="nav-user">
                    <Link href="/api/auth/signout" className="btn-logout">
                        Sair
                    </Link>
                </div>
            </nav>

            <main className="dashboard-main">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Carregando seu plano...</p>
                    </div>
                ) : (
                    <div className="calendar-layout">
                        <div className="calendar-section">
                            <Calendar
                                selectedDate={selectedDate}
                                onSelectDate={setSelectedDate}
                                planData={calendarStatus}
                            />

                            <div className="summary-card">
                                <h3>Resumo do Mês {useMockData && "(Demonstração)"}</h3>
                                <div className="summary-stats">
                                    <div className="stat">
                                        <span className="label">Treinos</span>
                                        <span className="value">{weeklyStats.workouts.completed}/{weeklyStats.workouts.total}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="label">Refeições</span>
                                        <span className="value">{weeklyStats.meals.completed}/{weeklyStats.meals.total}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="label">Foco</span>
                                        <span className="value">
                                            {weeklyStats.meals.total > 0
                                                ? Math.round((weeklyStats.meals.completed / weeklyStats.meals.total) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="daily-section">
                            <DailyPlan
                                date={selectedDate}
                                meals={currentDayData.meals}
                                workout={currentDayData.workout}
                                onToggleMeal={handleToggleMeal}
                                onToggleWorkout={handleToggleWorkout}
                            />
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                .dashboard-container {
                    min-height: 100vh;
                    background: #f8f9fa;
                }

                .dashboard-nav {
                    background: white;
                    padding: 20px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .nav-brand h1 {
                    margin: 0;
                    font-size: 1.5rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .nav-links {
                    display: flex;
                    gap: 30px;
                }

                .nav-link {
                    text-decoration: none;
                    color: #666;
                    font-weight: 500;
                    transition: color 0.3s ease;
                }

                .nav-link:hover,
                .nav-link.active {
                    color: #667eea;
                }

                .nav-user .btn-logout {
                    text-decoration: none;
                    color: #666;
                    font-size: 0.9rem;
                }

                .dashboard-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    gap: 20px;
                    color: #666;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .calendar-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 40px;
                    align-items: start;
                }

                .summary-card {
                    background: white;
                    border-radius: 20px;
                    padding: 25px;
                    margin-top: 30px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }

                .summary-card h3 {
                    margin: 0 0 20px 0;
                    font-size: 1.1rem;
                    color: #444;
                }

                .summary-stats {
                    display: flex;
                    justify-content: space-between;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }

                .stat .label {
                    font-size: 0.8rem;
                    color: #888;
                }

                .stat .value {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #667eea;
                }

                @media (max-width: 900px) {
                    .calendar-layout {
                        grid-template-columns: 1fr;
                    }

                    .calendar-section {
                        order: 1;
                    }

                    .daily-section {
                        order: 2;
                    }
                }

                @media (max-width: 768px) {
                    .dashboard-nav {
                        flex-direction: column;
                        gap: 20px;
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    )
}
