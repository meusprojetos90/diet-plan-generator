"use client"

interface MealItem {
    id: number | string
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

interface DailyPlanProps {
    date: Date
    meals: MealItem[]
    workout: WorkoutItem | null
    onToggleMeal: (id: number | string) => void
    onToggleWorkout: () => void
}

export default function DailyPlan({ date, meals, workout, onToggleMeal, onToggleWorkout }: DailyPlanProps) {
    const totalItems = meals.length + (workout ? 1 : 0)
    const completedItems = meals.filter(m => m.completed).length + (workout?.completed ? 1 : 0)
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    }

    return (
        <div className="daily-plan-container">
            <div className="daily-header">
                <h2>{formatDate(date)}</h2>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    <span>{progress}% concluído</span>
                </div>
            </div>

            <div className="section-title">
                <h3>🥗 Refeições</h3>
            </div>

            <div className="meals-list">
                {meals.map((meal) => (
                    <div key={meal.id} className={`meal-card ${meal.completed ? 'completed' : ''}`}>
                        <div className="meal-header">
                            <div className="meal-info">
                                <span className="meal-time">{meal.time}</span>
                                <h4>{meal.name}</h4>
                            </div>
                            <div className="meal-calories">
                                {meal.calories} kcal
                            </div>
                        </div>
                        <ul className="meal-items">
                            {meal.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                        <button
                            className={`check-btn ${meal.completed ? 'checked' : ''}`}
                            onClick={() => onToggleMeal(meal.id)}
                        >
                            {meal.completed ? '✓ Concluído' : 'Marcar como feito'}
                        </button>
                    </div>
                ))}
                {meals.length === 0 && (
                    <div className="empty-state">
                        <p>Nenhuma refeição planejada para hoje.</p>
                    </div>
                )}
            </div>

            <div className="section-title">
                <h3>💪 Treino do Dia</h3>
            </div>

            {workout ? (
                <div className={`workout-card ${workout.completed ? 'completed' : ''}`}>
                    <div className="workout-header">
                        <div className="workout-info">
                            <h4>{workout.name}</h4>
                            <span className="duration">⏱ {workout.duration}</span>
                        </div>
                    </div>
                    <ul className="exercises-list">
                        {workout.exercises.map((ex, idx) => (
                            <li key={idx}>
                                <span className="ex-name">{ex.name}</span>
                                <span className="ex-sets">{ex.sets}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        className={`check-btn workout-btn ${workout.completed ? 'checked' : ''}`}
                        onClick={onToggleWorkout}
                    >
                        {workout.completed ? '✓ Treino Concluído' : 'Marcar treino como feito'}
                    </button>
                </div>
            ) : (
                <div className="empty-state">
                    <p>Dia de descanso! Aproveite para recuperar.</p>
                </div>
            )}

            <style jsx>{`
                .daily-plan-container {
                    padding: 10px 0;
                }

                .daily-header {
                    margin-bottom: 30px;
                }

                .daily-header h2 {
                    margin: 0 0 15px 0;
                    font-size: 1.8rem;
                    color: #333;
                    text-transform: capitalize;
                }

                .progress-bar {
                    height: 24px;
                    background: #e9ecef;
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    transition: width 0.3s ease;
                }

                .progress-bar span {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #555;
                    mix-blend-mode: multiply;
                }

                .section-title {
                    margin: 30px 0 20px 0;
                }

                .section-title h3 {
                    margin: 0;
                    font-size: 1.4rem;
                    color: #444;
                }

                .meals-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .meal-card, .workout-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .meal-card:hover, .workout-card:hover {
                    transform: translateY(-2px);
                }

                .meal-card.completed, .workout-card.completed {
                    border-color: #48bb78;
                    background: #f0fff4;
                }

                .meal-header, .workout-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                }

                .meal-time {
                    font-size: 0.85rem;
                    color: #888;
                    font-weight: 600;
                    display: block;
                    margin-bottom: 4px;
                }

                .meal-info h4, .workout-info h4 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #333;
                }

                .meal-calories {
                    background: #f0f0f0;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #666;
                }

                .meal-items, .exercises-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 20px 0;
                }

                .meal-items li {
                    padding: 6px 0;
                    border-bottom: 1px solid #f0f0f0;
                    color: #555;
                    font-size: 0.95rem;
                }

                .meal-items li:last-child {
                    border-bottom: none;
                }

                .check-btn {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 10px;
                    background: #f0f0f0;
                    color: #666;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .check-btn:hover {
                    background: #e0e0e0;
                }

                .check-btn.checked {
                    background: #48bb78;
                    color: white;
                }

                .check-btn.workout-btn {
                    background: linear-gradient(135deg, #ed8936 0%, #f6ad55 100%);
                    color: white;
                }

                .check-btn.workout-btn.checked {
                   background: #48bb78; /* Green when checked */
                }

                .check-btn.workout-btn:hover {
                    opacity: 0.9;
                }

                .exercises-list li {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #f0f0f0;
                }

                .ex-name {
                    font-weight: 500;
                    color: #444;
                }

                .ex-sets {
                    font-weight: 600;
                    color: #667eea;
                }

                .duration {
                    font-size: 0.9rem;
                    color: #666;
                    margin-top: 5px;
                    display: block;
                }

                .empty-state {
                    text-align: center;
                    padding: 30px;
                    background: #f8f9fa;
                    border-radius: 16px;
                    color: #888;
                }
            `}</style>
        </div>
    )
}
