'use client';

import { useEffect, useState } from 'react';

interface StatsData {
    totalClients: number;
    activeClients: number;
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    recentOrders: Array<{
        id: string;
        customer_name: string;
        customer_email: string;
        price: number;
        status: string;
        created_at: string;
    }>;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando...</p>
                <style jsx>{`
                    .loading {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 400px;
                        color: white;
                    }
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid rgba(255,255,255,0.2);
                        border-top-color: #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 15px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!stats) {
        return <div style={{ color: 'white' }}>Erro ao carregar dados</div>;
    }

    return (
        <div className="admin-dashboard">
            <header className="page-header">
                <h1>📊 Dashboard</h1>
                <p>Visão geral do sistema</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalClients}</span>
                        <span className="stat-label">Total de Clientes</span>
                    </div>
                </div>

                <div className="stat-card highlight">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.activeClients}</span>
                        <span className="stat-label">Clientes Ativos</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalOrders}</span>
                        <span className="stat-label">Total de Pedidos</span>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
                        <span className="stat-label">Receita Total</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.todayOrders}</span>
                        <span className="stat-label">Pedidos Hoje</span>
                    </div>
                </div>

                <div className="stat-card today-revenue">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                        <span className="stat-value">{formatCurrency(stats.todayRevenue)}</span>
                        <span className="stat-label">Receita Hoje</span>
                    </div>
                </div>
            </div>

            <section className="recent-orders">
                <h2>🕐 Pedidos Recentes</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Email</th>
                                <th>Valor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty">Nenhum pedido encontrado</td>
                                </tr>
                            ) : (
                                stats.recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td>{order.customer_name || '-'}</td>
                                        <td>{order.customer_email || '-'}</td>
                                        <td>{formatCurrency(order.price)}</td>
                                        <td>
                                            <span className={`status ${order.status}`}>
                                                {order.status === 'paid' ? '✅ Pago' :
                                                    order.status === 'pending' ? '⏳ Pendente' :
                                                        order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <style jsx>{`
                .admin-dashboard { color: white; }
                .page-header { margin-bottom: 40px; }
                .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                .page-header p { color: rgba(255,255,255,0.6); font-size: 1rem; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
                .stat-card { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); padding: 25px; border-radius: 16px; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s; }
                .stat-card:hover { transform: translateY(-3px); border-color: rgba(102, 126, 234, 0.3); }
                .stat-card.highlight { border-color: #10b981; background: linear-gradient(135deg, #1e302a 0%, #253530 100%); }
                .stat-card.revenue { border-color: #f59e0b; background: linear-gradient(135deg, #302a1e 0%, #353025 100%); }
                .stat-card.today-revenue { border-color: #667eea; background: linear-gradient(135deg, #1e2030 0%, #252540 100%); }
                .stat-icon { font-size: 2.5rem; }
                .stat-info { display: flex; flex-direction: column; gap: 5px; }
                .stat-value { font-size: 1.6rem; font-weight: 700; }
                .stat-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
                .recent-orders { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
                .recent-orders h2 { font-size: 1.3rem; font-weight: 600; margin-bottom: 20px; }
                .table-container { overflow-x: auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
                th { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); font-weight: 600; }
                td { font-size: 0.9rem; }
                td.empty { text-align: center; color: rgba(255,255,255,0.5); padding: 30px; }
                .status { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
                .status.paid { background: rgba(16, 185, 129, 0.2); color: #10b981; }
                .status.pending { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
                @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
            `}</style>
        </div>
    );
}
