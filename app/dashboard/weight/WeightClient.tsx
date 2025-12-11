"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { addWeightLog } from "../actions"

interface WeightLog {
    id: string
    weight: number
    height: number
    bmi: number
    date: string
    notes: string | null
    created_at: string
}

interface WeightClientProps {
    userEmail: string
    weightHistory: WeightLog[]
    userHeight: number | null
    initialWeight: number | null
}

// BMI Classification
function getBMIClassification(bmi: number): { label: string; color: string } {
    if (bmi < 18.5) return { label: "Abaixo do peso", color: "#3498db" }
    if (bmi < 25) return { label: "Peso normal", color: "#27ae60" }
    if (bmi < 30) return { label: "Sobrepeso", color: "#f39c12" }
    return { label: "Obesidade", color: "#e74c3c" }
}

export default function WeightClient({ userEmail, weightHistory, userHeight, initialWeight }: WeightClientProps) {
    const [weight, setWeight] = useState<string>("")
    const [height, setHeight] = useState<string>(userHeight?.toString() || "")
    const [notes, setNotes] = useState<string>("")
    const [isPending, startTransition] = useTransition()
    const [history, setHistory] = useState<WeightLog[]>(weightHistory)
    const [message, setMessage] = useState<string>("")

    // Current BMI from latest log or calculate from inputs
    const latestLog = history[0]
    const currentBMI = latestLog?.bmi ? parseFloat(latestLog.bmi.toString()) : null

    // Chart dimensions
    const chartWidth = 600
    const chartHeight = 200
    const padding = 40

    // Prepare chart data (reverse to show oldest first)
    const chartData = [...history].reverse().slice(-30) // Last 30 entries

    // Calculate chart scales
    const weights = chartData.map(d => parseFloat(d.weight.toString()))
    const minWeight = weights.length > 0 ? Math.min(...weights) - 2 : 50
    const maxWeight = weights.length > 0 ? Math.max(...weights) + 2 : 100

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!weight || !height) return

        startTransition(async () => {
            try {
                const result = await addWeightLog(
                    parseFloat(weight),
                    parseFloat(height),
                    notes || undefined
                )

                if (result.success) {
                    setMessage("Peso registrado com sucesso!")
                    // Add to local state
                    const newLog: WeightLog = {
                        id: Date.now().toString(),
                        weight: parseFloat(weight),
                        height: parseFloat(height),
                        bmi: result.bmi,
                        date: new Date().toISOString().split('T')[0],
                        notes: notes || null,
                        created_at: new Date().toISOString()
                    }
                    setHistory([newLog, ...history])
                    setWeight("")
                    setNotes("")
                }
            } catch (error) {
                setMessage("Erro ao registrar peso. Tente novamente.")
            }
        })
    }

    // Generate SVG path for weight line chart
    const generatePath = () => {
        if (chartData.length < 2) return ""

        const xStep = (chartWidth - padding * 2) / (chartData.length - 1)
        const yScale = (chartHeight - padding * 2) / (maxWeight - minWeight)

        return chartData.map((d, i) => {
            const x = padding + i * xStep
            const y = chartHeight - padding - (parseFloat(d.weight.toString()) - minWeight) * yScale
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')
    }

    // Generate SVG path for BMI line
    const generateBMIPath = () => {
        if (chartData.length < 2) return ""

        const bmis = chartData.map(d => parseFloat(d.bmi.toString()))
        const minBMI = Math.min(...bmis) - 1
        const maxBMI = Math.max(...bmis) + 1

        const xStep = (chartWidth - padding * 2) / (chartData.length - 1)
        const yScale = (chartHeight - padding * 2) / (maxBMI - minBMI)

        return chartData.map((d, i) => {
            const x = padding + i * xStep
            const y = chartHeight - padding - (parseFloat(d.bmi.toString()) - minBMI) * yScale
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')
    }

    return (
        <div className="weight-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h1>🥗 Meu Plano</h1>
                </div>
                <div className="nav-links">
                    <Link href="/dashboard" className="nav-link">
                        Home
                    </Link>
                    <Link href="/dashboard/calendar" className="nav-link">
                        Calendário
                    </Link>
                    <Link href="/dashboard/weight" className="nav-link active">
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
                    <span>{userEmail}</span>
                </div>
            </nav>

            <main className="weight-main">
                <div className="page-header">
                    <h2>📊 Acompanhamento de Peso</h2>
                    <p>Registre seu peso e acompanhe sua evolução</p>
                </div>

                {/* Current Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon">⚖️</div>
                        <div className="stat-content">
                            <h3>{latestLog ? `${latestLog.weight} kg` : "--"}</h3>
                            <p>Peso Atual</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📏</div>
                        <div className="stat-content">
                            <h3>{latestLog ? `${latestLog.height} cm` : userHeight ? `${userHeight} cm` : "--"}</h3>
                            <p>Altura</p>
                        </div>
                    </div>

                    <div className="stat-card bmi-card" style={{ borderColor: currentBMI ? getBMIClassification(currentBMI).color : '#ddd' }}>
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <h3>{currentBMI ? currentBMI.toFixed(1) : "--"}</h3>
                            <p>IMC</p>
                            {currentBMI && (
                                <span className="bmi-label" style={{ color: getBMIClassification(currentBMI).color }}>
                                    {getBMIClassification(currentBMI).label}
                                </span>
                            )}
                        </div>
                    </div>

                    {initialWeight && latestLog && (
                        <div className="stat-card">
                            <div className="stat-icon">{parseFloat(latestLog.weight.toString()) < initialWeight ? "📉" : "📈"}</div>
                            <div className="stat-content">
                                <h3>{(parseFloat(latestLog.weight.toString()) - initialWeight).toFixed(1)} kg</h3>
                                <p>Variação Total</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Weight Form */}
                <div className="form-section">
                    <h3>Registrar Peso de Hoje</h3>
                    <form onSubmit={handleSubmit} className="weight-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Peso (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="30"
                                    max="300"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="Ex: 75.5"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Altura (cm)</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="100"
                                    max="250"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Ex: 170"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Observações (opcional)</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Ex: Após acordar, em jejum"
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={isPending}>
                            {isPending ? "Salvando..." : "Registrar Peso"}
                        </button>
                        {message && <p className="message">{message}</p>}
                    </form>
                </div>

                {/* Weight Chart */}
                {chartData.length >= 2 && (
                    <div className="chart-section">
                        <h3>Evolução do Peso</h3>
                        <div className="chart-container">
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="weight-chart">
                                {/* Grid lines */}
                                {[...Array(5)].map((_, i) => {
                                    const y = padding + (i * (chartHeight - padding * 2) / 4)
                                    const weightVal = maxWeight - (i * (maxWeight - minWeight) / 4)
                                    return (
                                        <g key={i}>
                                            <line
                                                x1={padding}
                                                y1={y}
                                                x2={chartWidth - padding}
                                                y2={y}
                                                stroke="#eee"
                                                strokeWidth="1"
                                            />
                                            <text x={padding - 5} y={y + 4} fontSize="10" textAnchor="end" fill="#999">
                                                {weightVal.toFixed(0)}
                                            </text>
                                        </g>
                                    )
                                })}

                                {/* Weight line */}
                                <path
                                    d={generatePath()}
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Gradient */}
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#667eea" />
                                        <stop offset="100%" stopColor="#764ba2" />
                                    </linearGradient>
                                </defs>

                                {/* Data points */}
                                {chartData.map((d, i) => {
                                    const xStep = (chartWidth - padding * 2) / (chartData.length - 1)
                                    const yScale = (chartHeight - padding * 2) / (maxWeight - minWeight)
                                    const x = padding + i * xStep
                                    const y = chartHeight - padding - (parseFloat(d.weight.toString()) - minWeight) * yScale
                                    return (
                                        <circle
                                            key={d.id}
                                            cx={x}
                                            cy={y}
                                            r="4"
                                            fill="#667eea"
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                    )
                                })}
                            </svg>
                        </div>
                    </div>
                )}

                {/* BMI Chart */}
                {chartData.length >= 2 && (
                    <div className="chart-section">
                        <h3>Evolução do IMC</h3>
                        <div className="chart-container">
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="bmi-chart">
                                {/* BMI zones */}
                                <rect x={padding} y={padding} width={chartWidth - padding * 2} height={(chartHeight - padding * 2) * 0.25} fill="rgba(231, 76, 60, 0.1)" />
                                <rect x={padding} y={padding + (chartHeight - padding * 2) * 0.25} width={chartWidth - padding * 2} height={(chartHeight - padding * 2) * 0.25} fill="rgba(243, 156, 18, 0.1)" />
                                <rect x={padding} y={padding + (chartHeight - padding * 2) * 0.5} width={chartWidth - padding * 2} height={(chartHeight - padding * 2) * 0.25} fill="rgba(39, 174, 96, 0.1)" />
                                <rect x={padding} y={padding + (chartHeight - padding * 2) * 0.75} width={chartWidth - padding * 2} height={(chartHeight - padding * 2) * 0.25} fill="rgba(52, 152, 219, 0.1)" />

                                {/* BMI line */}
                                <path
                                    d={generateBMIPath()}
                                    fill="none"
                                    stroke="#27ae60"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="bmi-legend">
                            <span style={{ color: "#3498db" }}>● Abaixo do peso (&lt;18.5)</span>
                            <span style={{ color: "#27ae60" }}>● Normal (18.5-24.9)</span>
                            <span style={{ color: "#f39c12" }}>● Sobrepeso (25-29.9)</span>
                            <span style={{ color: "#e74c3c" }}>● Obesidade (≥30)</span>
                        </div>
                    </div>
                )}

                {/* History List */}
                <div className="history-section">
                    <h3>Histórico de Registros</h3>
                    {history.length === 0 ? (
                        <p className="empty-state">Nenhum registro ainda. Comece registrando seu peso acima!</p>
                    ) : (
                        <div className="history-list">
                            {history.slice(0, 10).map((log) => (
                                <div key={log.id} className="history-item">
                                    <div className="history-date">
                                        {new Date(log.date).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="history-weight">{log.weight} kg</div>
                                    <div className="history-bmi">
                                        IMC: {parseFloat(log.bmi.toString()).toFixed(1)}
                                        <span className="bmi-badge" style={{ backgroundColor: getBMIClassification(log.bmi).color }}>
                                            {getBMIClassification(log.bmi).label}
                                        </span>
                                    </div>
                                    {log.notes && <div className="history-notes">{log.notes}</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .weight-container {
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

                .nav-user span {
                    color: #666;
                    font-size: 0.9rem;
                }

                .weight-main {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .page-header {
                    margin-bottom: 30px;
                }

                .page-header h2 {
                    font-size: 2rem;
                    margin: 0 0 10px 0;
                    color: #333;
                }

                .page-header p {
                    color: #666;
                    margin: 0;
                }

                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .bmi-card {
                    border-left: 4px solid;
                }

                .stat-icon {
                    font-size: 2rem;
                }

                .stat-content h3 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: #333;
                }

                .stat-content p {
                    margin: 5px 0 0 0;
                    color: #666;
                    font-size: 0.85rem;
                }

                .bmi-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .form-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .form-section h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                }

                .weight-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .form-group label {
                    font-weight: 500;
                    color: #333;
                    font-size: 0.9rem;
                }

                .form-group input {
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    align-self: flex-start;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }

                .btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .message {
                    color: #27ae60;
                    font-weight: 500;
                    margin: 10px 0 0 0;
                }

                .chart-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .chart-section h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                }

                .chart-container {
                    width: 100%;
                    overflow-x: auto;
                }

                .weight-chart,
                .bmi-chart {
                    width: 100%;
                    max-width: 600px;
                    height: auto;
                }

                .bmi-legend {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-top: 15px;
                    font-size: 0.85rem;
                }

                .history-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .history-section h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                }

                .empty-state {
                    color: #999;
                    text-align: center;
                    padding: 30px;
                }

                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .history-item {
                    display: grid;
                    grid-template-columns: 120px 80px 1fr;
                    gap: 15px;
                    align-items: center;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }

                .history-date {
                    font-weight: 500;
                    color: #333;
                }

                .history-weight {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #667eea;
                }

                .history-bmi {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #666;
                }

                .bmi-badge {
                    font-size: 0.7rem;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 10px;
                }

                .history-notes {
                    grid-column: 1 / -1;
                    font-size: 0.85rem;
                    color: #888;
                    font-style: italic;
                    padding-top: 5px;
                    border-top: 1px solid #eee;
                }

                @media (max-width: 768px) {
                    .dashboard-nav {
                        flex-direction: column;
                        gap: 15px;
                        padding: 15px;
                    }

                    .nav-links {
                        gap: 15px;
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .stats-row {
                        grid-template-columns: 1fr 1fr;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .history-item {
                        grid-template-columns: 1fr 1fr;
                    }

                    .history-bmi {
                        grid-column: 1 / -1;
                    }
                }
            `}</style>
        </div>
    )
}
