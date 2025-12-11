'use client';

import { useEffect, useState } from 'react';

interface Refund {
    id: string;
    user_email: string;
    user_name: string | null;
    amount: number;
    currency: string;
    reason: string | null;
    status: string;
    plan_days: number;
    plan_start: string;
    requested_at: string;
    processed_at: string | null;
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalRefunded: number;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminRefunds() {
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0, totalRefunded: 0 });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchRefunds = () => {
        fetch('/api/admin/refunds')
            .then(res => res.json())
            .then(data => {
                setRefunds(data.refunds || []);
                setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0, totalRefunded: 0 });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchRefunds();
    }, []);

    const handleAction = async (refundId: string, action: 'approve' | 'reject') => {
        setProcessing(refundId);
        try {
            const res = await fetch('/api/admin/refunds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refundId, action })
            });
            if (res.ok) {
                fetchRefunds();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Carregando...</div>;
    }

    return (
        <div className="admin-refunds">
            <header className="page-header">
                <h1>💰 Reembolsos</h1>
                <p>Gerenciar solicitações de reembolso</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card"><span className="stat-value">{stats.total}</span><span className="stat-label">Total</span></div>
                <div className="stat-card pending"><span className="stat-value">{stats.pending}</span><span className="stat-label">Pendentes</span></div>
                <div className="stat-card approved"><span className="stat-value">{stats.approved}</span><span className="stat-label">Aprovados</span></div>
                <div className="stat-card refunded"><span className="stat-value">{formatCurrency(stats.totalRefunded)}</span><span className="stat-label">Total Reembolsado</span></div>
            </div>

            {refunds.length === 0 ? (
                <div className="info-box">
                    <p>💰 Nenhuma solicitação de reembolso ainda.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Plano</th>
                                <th>Valor</th>
                                <th>Motivo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {refunds.map((refund) => (
                                <tr key={refund.id}>
                                    <td>{formatDate(refund.requested_at)}</td>
                                    <td>
                                        <div>{refund.user_name || '-'}</div>
                                        <small style={{ color: 'rgba(255,255,255,0.5)' }}>{refund.user_email}</small>
                                    </td>
                                    <td>{refund.plan_days} dias</td>
                                    <td className="amount">{formatCurrency(refund.amount)}</td>
                                    <td className="reason">{refund.reason || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${refund.status}`}>
                                            {refund.status === 'pending' && '⏳ Pendente'}
                                            {refund.status === 'approved' && '✅ Aprovado'}
                                            {refund.status === 'rejected' && '❌ Rejeitado'}
                                        </span>
                                    </td>
                                    <td>
                                        {refund.status === 'pending' && (
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleAction(refund.id, 'approve')}
                                                    disabled={processing === refund.id}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleAction(refund.id, 'reject')}
                                                    disabled={processing === refund.id}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                        {refund.status !== 'pending' && (
                                            <small style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                {refund.processed_at ? formatDate(refund.processed_at) : '-'}
                                            </small>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .admin-refunds { color: white; }
                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                .page-header p { color: rgba(255,255,255,0.6); }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                .stat-card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
                .stat-card.pending { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.1); }
                .stat-card.approved { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1); }
                .stat-card.refunded { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }
                .stat-value { display: block; font-size: 1.5rem; font-weight: 700; margin-bottom: 5px; }
                .stat-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
                .info-box { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 30px; text-align: center; }
                .info-box p { color: rgba(255,255,255,0.7); }
                .table-container { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
                th { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); font-weight: 600; background: rgba(0,0,0,0.2); }
                .amount { font-weight: 600; color: #10b981; }
                .reason { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: rgba(255,255,255,0.6); }
                .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
                .status-badge.pending { background: rgba(245,158,11,0.2); color: #f59e0b; }
                .status-badge.approved { background: rgba(16,185,129,0.2); color: #10b981; }
                .status-badge.rejected { background: rgba(239,68,68,0.2); color: #ef4444; }
                .action-buttons { display: flex; gap: 8px; }
                .btn-approve, .btn-reject { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
                .btn-approve { background: rgba(16,185,129,0.2); color: #10b981; }
                .btn-approve:hover { background: #10b981; color: white; }
                .btn-reject { background: rgba(239,68,68,0.2); color: #ef4444; }
                .btn-reject:hover { background: #ef4444; color: white; }
                .btn-approve:disabled, .btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
                @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
            `}</style>
        </div>
    );
}
