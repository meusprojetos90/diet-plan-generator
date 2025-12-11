"use client"

import { useState } from "react"

interface DayStatus {
    hasMeals: boolean
    mealsCompleted: boolean
    hasWorkout: boolean
    workoutCompleted: boolean
}

interface CalendarProps {
    selectedDate: Date
    onSelectDate: (date: Date) => void
    planData?: Record<string, DayStatus>
}

export default function Calendar({ selectedDate, onSelectDate, planData = {} }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const renderDays = () => {
        const days = []
        const totalDays = daysInMonth(currentMonth)
        const firstDay = firstDayOfMonth(currentMonth)

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const dateKey = date.toDateString()
            const isSelected = dateKey === selectedDate.toDateString()
            const isToday = dateKey === new Date().toDateString()
            const dayStatus = planData[dateKey]

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                    onClick={() => onSelectDate(date)}
                >
                    <span className="day-number">{day}</span>
                    {dayStatus && (
                        <div className="indicators">
                            {dayStatus.hasMeals && (
                                <span className={`dot meal ${dayStatus.mealsCompleted ? "completed" : ""}`}></span>
                            )}
                            {dayStatus.hasWorkout && (
                                <span className={`dot workout ${dayStatus.workoutCompleted ? "completed" : ""}`}></span>
                            )}
                        </div>
                    )}
                </div>
            )
        }

        return days
    }

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={prevMonth} className="nav-btn">&lt;</button>
                <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                <button onClick={nextMonth} className="nav-btn">&gt;</button>
            </div>
            <div className="weekdays">
                <div>Dom</div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
            </div>
            <div className="calendar-grid">
                {renderDays()}
            </div>

            <style jsx>{`
                .calendar-container {
                    background: white;
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }

                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .calendar-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: #333;
                    font-weight: 600;
                }

                .nav-btn {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #666;
                    cursor: pointer;
                    padding: 5px 10px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }

                .nav-btn:hover {
                    background: #f0f0f0;
                }

                .weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-weight: 500;
                    color: #999;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }

                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 5px;
                }

                .calendar-day {
                    aspect-ratio: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                    color: #444;
                    position: relative;
                }

                .calendar-day:hover:not(.empty) {
                    background: #f8f9fa;
                }

                .calendar-day.selected {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 10px rgba(118, 75, 162, 0.3);
                }

                .calendar-day.today {
                    border: 2px solid #667eea;
                }

                .calendar-day.today.selected {
                    border: none;
                }

                .indicators {
                    display: flex;
                    gap: 3px;
                    margin-top: 4px;
                }

                .dot {
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #ddd;
                }

                .calendar-day.selected .dot {
                    background: rgba(255,255,255,0.6);
                }

                .dot.meal { background: #48bb78; }
                .dot.workout { background: #ed8936; }
                
                .calendar-day.selected .dot.meal,
                .calendar-day.selected .dot.workout {
                    background: white;
                }
            `}</style>
        </div>
    )
}

