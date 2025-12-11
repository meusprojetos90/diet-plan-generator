"use client"

import Link from "next/link"
import { useStackApp } from "@stackframe/stack"
import { useState, useTransition } from "react"
import { toggleMealCompletion, toggleWorkoutCompletion } from "./actions"

interface TodayMeal {
    id: number
    name: string
    time: string
    calories: number
}

interface Exercise {
    id: number
    name: string
    sets: number
    reps: string | number
}

interface TodayWorkout {
    name: string
    duration: number
    exercises: Exercise[]
}

interface TodayLogs {
    completedMeals: string[]
    completedExercises: string[]
    workoutCompleted: boolean
}

interface DashboardClientProps {
    user: {
        name?: string | null
        email?: string | null
    }
    stats?: {
        calories: number
        protein: number
        carbs: number
        fat: number
    }
    todayMeals?: TodayMeal[]
    todayWorkout?: TodayWorkout | null
    todayLogs?: TodayLogs | null
    planId?: string | null
    profileId?: string | null
}

export default function DashboardClient({
    user,
    stats,
    todayMeals = [],
    todayWorkout,
    todayLogs,
    planId,
    profileId
}: DashboardClientProps) {
    const app = useStackApp()
    const [isPending, startTransition] = useTransition()
    const [localLogs, setLocalLogs] = useState<TodayLogs>(todayLogs || { completedMeals: [], completedExercises: [], workoutCompleted: false })

    // Default Fallback Stats (if no plan)
    const displayStats = stats || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    }

    const handleSignOut = async () => {
        await app.signOut()
        window.location.href = "/"
    }

    const handleToggleMeal = (mealId: number) => {
        if (!planId || !profileId) return

        const mealIdStr = String(mealId)
        const isCompleted = localLogs.completedMeals.includes(mealIdStr)

        // Optimistic update
        setLocalLogs(prev => ({
            ...prev,
            completedMeals: isCompleted
                ? prev.completedMeals.filter(id => id !== mealIdStr)
                : [...prev.completedMeals, mealIdStr]
        }))

        startTransition(async () => {
            const today = new Date().toISOString().split('T')[0]
            await toggleMealCompletion(planId, profileId, today, mealId)
        })
    }

    const handleToggleExercise = (exerciseId: number) => {
        const exerciseIdStr = String(exerciseId)
        const isCompleted = localLogs.completedExercises.includes(exerciseIdStr)

        // Optimistic update
        setLocalLogs(prev => {
            const newCompletedExercises = isCompleted
                ? prev.completedExercises.filter(id => id !== exerciseIdStr)
                : [...prev.completedExercises, exerciseIdStr]

            // Check if all exercises are completed
            const allExercisesCount = todayWorkout?.exercises?.length || 0
            const allCompleted = newCompletedExercises.length === allExercisesCount && allExercisesCount > 0

            return {
                ...prev,
                completedExercises: newCompletedExercises,
                workoutCompleted: allCompleted
            }
        })
    }

    const handleToggleWorkout = () => {
        if (!planId || !profileId) return

        // Optimistic update
        setLocalLogs(prev => ({
            ...prev,
            workoutCompleted: !prev.workoutCompleted
        }))

        startTransition(async () => {
            const today = new Date().toISOString().split('T')[0]
            await toggleWorkoutCompletion(planId, profileId, today)
        })
    }

    const mealsProgress = todayMeals.length > 0
        ? Math.round((localLogs.completedMeals.length / todayMeals.length) * 100)
        : 0

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h1>🥗 Meu Plano</h1>
                </div>
                <div className="nav-links">
                    <Link href="/dashboard" className="nav-link active">
                        Home
                    </Link>
                    <Link href="/dashboard/calendar" className="nav-link">
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
                    <span>{user.email}</span>
                    <button onClick={handleSignOut} className="btn-logout">
                        Sair
                    </button>
                </div>
            </nav>

            <main className="dashboard-main">
                <div className="welcome-section">
                    <h2>Olá, {user.name || user.email}! 👋</h2>
                    <p>Bem-vindo à sua área do cliente</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-content">
                            <h3>{displayStats.calories}</h3>
                            <p>Calorias/dia</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">💪</div>
                        <div className="stat-content">
                            <h3>{displayStats.protein}g</h3>
                            <p>Proteínas</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🍞</div>
                        <div className="stat-content">
                            <h3>{displayStats.carbs}g</h3>
                            <p>Carboidratos</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🥑</div>
                        <div className="stat-content">
                            <h3>{displayStats.fat}g</h3>
                            <p>Gorduras</p>
                        </div>
                    </div>
                </div>

                {/* Today's Tracking Section */}
                {todayMeals.length > 0 && (
                    <div className="today-section">
                        <h3>📅 Acompanhamento de Hoje</h3>

                        <div className="today-grid">
                            {/* Meals Tracker */}
                            <div className="tracker-card">
                                <div className="tracker-header">
                                    <span className="tracker-title">🥗 Refeições</span>
                                    <span className="tracker-progress">{localLogs.completedMeals.length}/{todayMeals.length}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${mealsProgress}%` }}></div>
                                </div>
                                <div className="meal-list">
                                    {todayMeals.map(meal => {
                                        const isCompleted = localLogs.completedMeals.includes(String(meal.id))
                                        return (
                                            <div
                                                key={meal.id}
                                                className={`meal-item ${isCompleted ? 'completed' : ''}`}
                                                onClick={() => handleToggleMeal(meal.id)}
                                            >
                                                <div className="meal-check">
                                                    {isCompleted ? '✓' : '○'}
                                                </div>
                                                <div className="meal-info">
                                                    <span className="meal-name">{meal.name}</span>
                                                    <span className="meal-meta">{meal.time} • {meal.calories} kcal</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Workout Tracker */}
                            {todayWorkout && todayWorkout.exercises && todayWorkout.exercises.length > 0 && (
                                <div className="tracker-card">
                                    <div className="tracker-header">
                                        <span className="tracker-title">💪 {todayWorkout.name}</span>
                                        <span className="tracker-progress">
                                            {localLogs.completedExercises.length}/{todayWorkout.exercises.length}
                                        </span>
                                    </div>
                                    <div className="progress-bar workout-progress">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(localLogs.completedExercises.length / todayWorkout.exercises.length) * 100}%`,
                                                background: 'linear-gradient(90deg, #ed8936 0%, #f6ad55 100%)'
                                            }}
                                        ></div>
                                    </div>
                                    <p className="workout-duration">⏱️ {todayWorkout.duration} min</p>

                                    {/* Start Workout Button */}
                                    {!localLogs.workoutCompleted && (
                                        <Link href="/dashboard/workout" className="start-workout-btn">
                                            ▶️ Iniciar Treino Guiado
                                        </Link>
                                    )}

                                    <div className="exercise-list">
                                        {todayWorkout.exercises.map(exercise => {
                                            const isCompleted = localLogs.completedExercises.includes(String(exercise.id))
                                            return (
                                                <div
                                                    key={exercise.id}
                                                    className={`exercise-item ${isCompleted ? 'completed' : ''}`}
                                                    onClick={() => handleToggleExercise(exercise.id)}
                                                >
                                                    <div className="exercise-check">
                                                        {isCompleted ? '✓' : '○'}
                                                    </div>
                                                    <div className="exercise-info">
                                                        <span className="exercise-name">{exercise.name}</span>
                                                        <span className="exercise-meta">{exercise.sets}x{exercise.reps}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {localLogs.workoutCompleted && (
                                        <div className="workout-complete-badge">
                                            🎉 Treino Completo!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="quick-actions">
                    <h3>Acesso Rápido</h3>
                    <div className="actions-grid">
                        <Link href="/dashboard/calendar" className="action-card">
                            <div className="action-icon">📅</div>
                            <div className="action-content">
                                <h4>Calendário</h4>
                                <p>Acompanhe seu plano diário de refeições e treinos</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>

                        <Link href="/dashboard/weight" className="action-card">
                            <div className="action-icon">⚖️</div>
                            <div className="action-content">
                                <h4>Acompanhamento de Peso</h4>
                                <p>Registre seu peso e veja sua evolução e IMC</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>

                        <Link href="/dashboard/profile" className="action-card">
                            <div className="action-icon">👤</div>
                            <div className="action-content">
                                <h4>Meu Perfil</h4>
                                <p>Gerencie sua conta e assinatura</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>
                    </div>
                </div>

                {displayStats.calories === 0 && (
                    <div className="info-message">
                        <h3>📋 Nenhum plano ativo</h3>
                        <p>
                            Você ainda não possui um plano alimentar ativo.
                            Complete o questionário para receber seu plano personalizado!
                        </p>
                        <div className="action-area">
                            <Link href="/quiz" className="btn-primary">
                                Iniciar Questionário
                            </Link>
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

                .nav-user {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .nav-user span {
                    color: #666;
                    font-size: 0.9rem;
                }

                .btn-logout {
                    background: #f0f0f0;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background 0.3s ease;
                }

                .btn-logout:hover {
                    background: #e0e0e0;
                }

                .dashboard-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .welcome-section {
                    margin-bottom: 40px;
                }

                .welcome-section h2 {
                    font-size: 2rem;
                    margin: 0 0 10px 0;
                    color: #333;
                }

                .welcome-section p {
                    color: #666;
                    margin: 0;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .stat-card {
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .stat-icon {
                    font-size: 2.5rem;
                }

                .stat-content h3 {
                    margin: 0;
                    font-size: 1.8rem;
                    color: #333;
                }

                .stat-content p {
                    margin: 5px 0 0 0;
                    color: #666;
                    font-size: 0.9rem;
                }

                .quick-actions {
                    margin-bottom: 40px;
                }

                .quick-actions h3 {
                    margin: 0 0 20px 0;
                    font-size: 1.3rem;
                    color: #333;
                }

                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }

                .action-card {
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    text-decoration: none;
                    color: inherit;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .action-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
                }

                .action-icon {
                    font-size: 2.5rem;
                }

                .action-content h4 {
                    margin: 0 0 5px 0;
                    font-size: 1.1rem;
                    color: #333;
                }

                .action-content p {
                    margin: 0;
                    color: #666;
                    font-size: 0.9rem;
                }

                .action-arrow {
                    margin-left: auto;
                    font-size: 1.5rem;
                    color: #667eea;
                }

                .info-message {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px;
                    border-radius: 20px;
                    text-align: center;
                }

                .info-message h3 {
                    margin: 0 0 15px 0;
                    font-size: 1.5rem;
                }

                .info-message p {
                    margin: 10px 0;
                    line-height: 1.6;
                }

                .action-area {
                    margin: 30px 0;
                }

                .btn-primary {
                    display: inline-block;
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .today-section {
                    margin-bottom: 40px;
                }

                .today-section h3 {
                    margin: 0 0 20px 0;
                    font-size: 1.3rem;
                    color: #333;
                }

                .today-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .tracker-card {
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .tracker-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .tracker-title {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #333;
                }

                .tracker-progress {
                    background: #667eea;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .progress-bar {
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }

                .meal-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .meal-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 15px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .meal-item:hover {
                    background: #e9ecef;
                }

                .meal-item.completed {
                    background: #e6fffa;
                    border: 1px solid #38b2ac;
                }

                .meal-check {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: #999;
                }

                .meal-item.completed .meal-check {
                    color: #38b2ac;
                    font-weight: bold;
                }

                .meal-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .meal-name {
                    font-weight: 500;
                    color: #333;
                }

                .meal-meta {
                    font-size: 0.8rem;
                    color: #888;
                }

                .workout-duration {
                    color: #888;
                    font-size: 0.9rem;
                    margin: 0 0 15px 0;
                }

                .exercise-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .exercise-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 15px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .exercise-item:hover {
                    background: #e9ecef;
                }

                .exercise-item.completed {
                    background: #fff7ed;
                    border: 1px solid #ed8936;
                }

                .exercise-check {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: #999;
                }

                .exercise-item.completed .exercise-check {
                    color: #ed8936;
                    font-weight: bold;
                }

                .exercise-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .exercise-name {
                    font-weight: 500;
                    color: #333;
                }

                .exercise-meta {
                    font-size: 0.8rem;
                    color: #ed8936;
                    font-weight: 600;
                }

                .workout-complete-badge {
                    margin-top: 15px;
                    padding: 12px;
                    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                    color: white;
                    text-align: center;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1rem;
                }

                .start-workout-btn {
                    display: block;
                    text-align: center;
                    padding: 14px;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .start-workout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }

                @media (max-width: 768px) {
                    .dashboard-nav {
                        flex-direction: column;
                        gap: 20px;
                        padding: 20px;
                    }

                    .nav-links {
                        gap: 15px;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .today-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
}
