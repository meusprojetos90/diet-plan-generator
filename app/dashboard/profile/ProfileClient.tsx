"use client"

import { useState } from "react"
import Link from "next/link"

interface ProfileClientProps {
    user: {
        name?: string | null
        email?: string | null
    }
    activePlan: any
    status: string
    expirationDate: string
    payments: any[]
}

export default function ProfileClient({ user, activePlan, status, expirationDate, payments }: ProfileClientProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [showRefundModal, setShowRefundModal] = useState(false)
    const [refundReason, setRefundReason] = useState('')
    const [refundLoading, setRefundLoading] = useState(false)
    const [refundMessage, setRefundMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [refundStatus, setRefundStatus] = useState<string | null>(null)

    // Mock settings data (would normally be fetched from DB)
    const [settings, setSettings] = useState({
        goal: "Perder Peso",
        preferences: "Sem glúten, Preferência por frango",
        activityLevel: "Moderado (3-4x semana)"
    })

    // Check if within 7 days refund period
    const startDate = activePlan?.start_date ? new Date(activePlan.start_date) : null
    const now = new Date()
    const daysSinceStart = startDate ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 999
    const canRequestRefund = daysSinceStart <= 7 && activePlan

    const handleRefundRequest = async () => {
        if (!activePlan?.id) return
        setRefundLoading(true)
        setRefundMessage(null)

        try {
            const res = await fetch('/api/refund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: activePlan.id, reason: refundReason })
            })

            const data = await res.json()

            if (res.ok) {
                setRefundMessage({ type: 'success', text: data.message || 'Solicitação enviada!' })
                setRefundStatus('pending')
                setShowRefundModal(false)
            } else {
                setRefundMessage({ type: 'error', text: data.error || 'Erro ao solicitar reembolso' })
            }
        } catch {
            setRefundMessage({ type: 'error', text: 'Erro de conexão' })
        } finally {
            setRefundLoading(false)
        }
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h1>🥗 Meu Perfil</h1>
                </div>
                <div className="nav-links">
                    <Link href="/dashboard" className="nav-link">
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
                    <Link href="/dashboard/profile" className="nav-link active">
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
                <div className="profile-header">
                    <div className="avatar">
                        {(user.name || user.email || "U")[0].toUpperCase()}
                    </div>
                    <div className="user-info">
                        <h2>{user.name || "Usuário"}</h2>
                        <span className="email">{user.email}</span>
                    </div>
                </div>

                <div className="settings-grid">
                    <div className="settings-card">
                        <div className="card-header">
                            <h3>Configurações do Plano</h3>
                        </div>

                        <div className="setting-item">
                            <label>Objetivo</label>
                            <p>Perder Peso (Baseado nas respostas)</p>
                        </div>

                        <div className="setting-item">
                            <label>Plano Atual</label>
                            <p>{activePlan ? `${activePlan.days} dias` : "Nenhum plano ativo"}</p>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="card-header">
                            <h3>Assinatura</h3>
                        </div>

                        <div className="setting-item">
                            <label>Status</label>
                            <span className={`status-badge ${status === 'Ativo' ? 'active' : 'inactive'}`}>
                                {status}
                            </span>
                        </div>

                        <div className="setting-item">
                            <label>Vencimento do Acesso</label>
                            <p>{expirationDate}</p>
                            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                                (Planos de pagamento único não renovam automaticamente)
                            </small>
                        </div>

                        <div className="actions">
                            {refundMessage && (
                                <div className={`refund-alert ${refundMessage.type}`}>
                                    {refundMessage.text}
                                </div>
                            )}

                            {refundStatus === 'pending' ? (
                                <div className="refund-pending">
                                    ⏳ Solicitação de reembolso em análise
                                </div>
                            ) : canRequestRefund ? (
                                <>
                                    <button
                                        className="btn-refund"
                                        onClick={() => setShowRefundModal(true)}
                                    >
                                        💰 Solicitar Reembolso
                                    </button>
                                    <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '5px' }}>
                                        Garantia de 7 dias - {7 - daysSinceStart} dias restantes
                                    </p>
                                </>
                            ) : (
                                <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                                    Período de garantia de 7 dias expirado.
                                </p>
                            )}
                        </div>

                        {/* Refund Modal */}
                        {showRefundModal && (
                            <div className="refund-modal-overlay" onClick={() => setShowRefundModal(false)}>
                                <div className="refund-modal" onClick={e => e.stopPropagation()}>
                                    <h3>Solicitar Reembolso</h3>
                                    <p>Tem certeza que deseja solicitar o reembolso?</p>
                                    <p className="refund-info">
                                        Valor: R$ {activePlan?.amount_paid || '0.00'}
                                    </p>
                                    <textarea
                                        placeholder="Motivo do reembolso (opcional)"
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                    />
                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            onClick={() => setShowRefundModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="btn-confirm"
                                            onClick={handleRefundRequest}
                                            disabled={refundLoading}
                                        >
                                            {refundLoading ? 'Enviando...' : 'Confirmar Solicitação'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="settings-card full-width">
                        <div className="card-header">
                            <h3>Histórico de Pagamentos</h3>
                        </div>

                        <div className="payment-history">
                            {payments.length > 0 ? (
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Descrição</th>
                                            <th>Valor</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment: any) => (
                                            <tr key={payment.id}>
                                                <td>{new Date(payment.created_at).toLocaleDateString('pt-BR')}</td>
                                                <td>Plano {payment.days} dias</td>
                                                <td>
                                                    {payment.currency === 'BRL' ? 'R$' : '$'} {payment.price}
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${payment.status}`}>
                                                        {payment.status === 'paid' ? 'Pago' : payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="empty-state">Nenhum pagamento encontrado.</p>
                            )}
                        </div>
                    </div>
                </div>
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

                .nav-user .btn-logout {
                    text-decoration: none;
                    color: #666;
                    font-size: 0.9rem;
                }

                .dashboard-main {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .avatar {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 2rem;
                    font-weight: 700;
                }

                .user-info h2 {
                    margin: 0 0 5px 0;
                    color: #333;
                }

                .user-info .email {
                    color: #888;
                }

                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                }

                .settings-card {
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }

                .full-width {
                    grid-column: 1 / -1;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #f0f0f0;
                }

                .card-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: #444;
                }

                .setting-item {
                    margin-bottom: 20px;
                }

                .setting-item label {
                    display: block;
                    font-size: 0.85rem;
                    color: #888;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .setting-item p {
                    margin: 0;
                    font-weight: 500;
                    color: #333;
                }

                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .status-badge.active {
                    background: #e6fffa;
                    color: #38b2ac;
                }

                .status-badge.inactive {
                    background: #fff5f5;
                    color: #e53e3e;
                }

                .actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 30px;
                }

                .btn-danger {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: not-allowed;
                    background: #fff5f5;
                    color: #e53e3e;
                    opacity: 0.7;
                }

                .history-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .history-table th, .history-table td {
                    text-align: left;
                    padding: 15px;
                    border-bottom: 1px solid #f0f0f0;
                }

                .history-table th {
                    color: #888;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                }

                .status-pill {
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .status-pill.paid {
                    background: #e6fffa;
                    color: #38b2ac;
                }

                .status-pill.pending {
                    background: #fffaf0;
                    color: #ed8936;
                }

                .empty-state {
                    text-align: center;
                    color: #888;
                    padding: 20px;
                }

                /* Refund styles */
                .btn-refund {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-refund:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }

                .refund-pending {
                    background: rgba(245, 158, 11, 0.1);
                    color: #d97706;
                    padding: 15px;
                    border-radius: 10px;
                    font-weight: 500;
                }

                .refund-alert {
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    font-size: 0.9rem;
                }

                .refund-alert.success {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .refund-alert.error {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .refund-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .refund-modal {
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    max-width: 450px;
                    width: 90%;
                }

                .refund-modal h3 {
                    margin: 0 0 15px 0;
                    font-size: 1.3rem;
                }

                .refund-info {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #10b981;
                    margin: 15px 0;
                }

                .refund-modal textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    min-height: 80px;
                    resize: vertical;
                    font-family: inherit;
                    margin-bottom: 20px;
                }

                .modal-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: flex-end;
                }

                .modal-actions .btn-cancel {
                    background: #f1f1f1;
                    color: #666;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .modal-actions .btn-confirm {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .modal-actions .btn-confirm:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .dashboard-nav {
                        flex-direction: column;
                        gap: 20px;
                        padding: 20px;
                    }
                    
                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    )
}
