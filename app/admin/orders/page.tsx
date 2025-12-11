'use client';

import { useEffect, useState } from 'react';

interface Order {
    id: string;
    customer_name: string | null;
    customer_email: string | null;
    days: number;
    price: number;
    currency: string;
    status: string;
    created_at: string;
}

interface Stats {
    total: number;
    paid: number;
    pending: number;
    totalRevenue: number;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, paid: 0, pending: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data.orders || []);
                setStats(data.stats || { total: 0, paid: 0, pending: 0, totalRevenue: 0 });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Carregando...</div>;
    }

    return (
        <div className="admin-orders">
            <header className="page-header">
                <h1>💳 Pedidos</h1>
                <p>Histórico de pagamentos</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card"><span className="stat-value">{stats.total}</span><span className="stat-label">Total</span></div>
                <div className="stat-card paid"><span className="stat-value">{stats.paid}</span><span className="stat-label">Pagos</span></div>
                <div className="stat-card pending"><span className="stat-value">{stats.pending}</span><span className="stat-label">Pendentes</span></div>
                <div className="stat-card revenue"><span className="stat-value">{formatCurrency(stats.totalRevenue)}</span><span className="stat-label">Receita Total</span></div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr><th>Data</th><th>Cliente</th><th>Email</th><th>Plano</th><th>Valor</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan={6} className="empty">Nenhum pedido encontrado</td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{formatDate(order.created_at)}</td>
                                    <td>{order.customer_name || '-'}</td>
                                    <td className="email">{order.customer_email || '-'}</td>
                                    <td><span className="plan-badge">{order.days} dias</span></td>
                                    <td className="price">{formatCurrency(order.price)}</td>
                                    <td><span className={`status-badge ${order.status}`}>
                                        {order.status === 'paid' && '✅ Pago'}
                                        {order.status === 'pending' && '⏳ Pendente'}
                                        {order.status === 'cancelled' && '❌ Cancelado'}
                                    </span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .admin-orders { color: white; }
                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                .page-header p { color: rgba(255,255,255,0.6); }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                .stat-card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
                .stat-card.paid { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1); }
                .stat-card.pending { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.1); }
                .stat-card.revenue { border-color: rgba(102,126,234,0.3); background: rgba(102,126,234,0.1); }
                .stat-value { display: block; font-size: 1.5rem; font-weight: 700; margin-bottom: 5px; }
                .stat-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
                .table-container { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
                th { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); font-weight: 600; background: rgba(0,0,0,0.2); }
                .email { color: rgba(255,255,255,0.7); }
                .price { font-weight: 600; color: #10b981; }
                .plan-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; background: rgba(102,126,234,0.2); color: #667eea; }
                .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
                .status-badge.paid { background: rgba(16,185,129,0.2); color: #10b981; }
                .status-badge.pending { background: rgba(245,158,11,0.2); color: #f59e0b; }
                .status-badge.cancelled { background: rgba(239,68,68,0.2); color: #ef4444; }
                td.empty { text-align: center; color: rgba(255,255,255,0.5); padding: 50px; }
                @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
            `}</style>
        </div>
    );
}
