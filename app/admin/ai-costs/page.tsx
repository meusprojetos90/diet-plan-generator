'use client';

import { useEffect, useState } from 'react';

interface Stats {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    todayRequests: number;
    todayCost: number;
}

interface UsageLog {
    id: string;
    operation: string;
    model: string;
    tokens_input: number;
    tokens_output: number;
    cost_usd: number;
    customer_id: string | null;
    order_id: string | null;
    created_at: string;
    customer_email?: string;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 }).format(value);
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR');
}

function getOperationLabel(operation: string): string {
    const labels: Record<string, string> = {
        'generate_preview_1d': '📝 Preview (1 dia)',
        'generate_meal_plan_1d': '📝 Plano 1 dia',
        'generate_meal_plan_7d': '🍽️ Plano 7 dias',
        'generate_meal_plan_14d': '🍽️ Plano 14 dias',
        'generate_meal_plan_30d': '🍽️ Plano 30 dias',
        'generate_meal_plan_90d': '🍽️ Plano 90 dias',
    };
    return labels[operation] || operation;
}

export default function AdminAICosts() {
    const [stats, setStats] = useState<Stats>({ totalRequests: 0, totalTokens: 0, totalCost: 0, todayRequests: 0, todayCost: 0 });
    const [usage, setUsage] = useState<UsageLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/ai-costs')
            .then(res => res.json())
            .then(data => {
                setStats(data.stats || { totalRequests: 0, totalTokens: 0, totalCost: 0, todayRequests: 0, todayCost: 0 });
                setUsage(data.usage || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Carregando...</div>;
    }

    return (
        <div className="admin-ai-costs">
            <header className="page-header">
                <h1>🤖 Custos de IA</h1>
                <p>Monitoramento de uso da API OpenAI</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card"><span className="stat-value">{formatNumber(stats.totalRequests)}</span><span className="stat-label">Total de Requisições</span></div>
                <div className="stat-card"><span className="stat-value">{formatNumber(stats.totalTokens)}</span><span className="stat-label">Tokens Usados</span></div>
                <div className="stat-card cost"><span className="stat-value">{formatCurrency(stats.totalCost)}</span><span className="stat-label">Custo Total</span></div>
                <div className="stat-card today"><span className="stat-value">{formatCurrency(stats.todayCost)}</span><span className="stat-label">Custo Hoje</span></div>
            </div>

            {usage.length > 0 ? (
                <div className="usage-table-container">
                    <h2>📊 Histórico de Uso</h2>
                    <table className="usage-table">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Operação</th>
                                <th>Modelo</th>
                                <th>Tokens In</th>
                                <th>Tokens Out</th>
                                <th>Total</th>
                                <th>Custo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usage.map((log) => (
                                <tr key={log.id}>
                                    <td className="date">{formatDate(log.created_at)}</td>
                                    <td className="operation">{getOperationLabel(log.operation)}</td>
                                    <td className="model">{log.model}</td>
                                    <td className="tokens">{formatNumber(log.tokens_input)}</td>
                                    <td className="tokens">{formatNumber(log.tokens_output)}</td>
                                    <td className="tokens total">{formatNumber(log.tokens_input + log.tokens_output)}</td>
                                    <td className="cost">{formatCurrency(log.cost_usd)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="info-box">
                    <p>📊 Nenhum uso de IA registrado ainda. Os custos serão exibidos aqui após gerações de planos.</p>
                </div>
            )}

            <style jsx>{`
                .admin-ai-costs { color: white; }
                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                .page-header p { color: rgba(255,255,255,0.6); }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                .stat-card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
                .stat-card.cost { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }
                .stat-card.today { border-color: rgba(102,126,234,0.3); background: rgba(102,126,234,0.1); }
                .stat-value { display: block; font-size: 1.5rem; font-weight: 700; margin-bottom: 5px; }
                .stat-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
                
                .usage-table-container { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 25px; }
                .usage-table-container h2 { margin: 0 0 20px 0; font-size: 1.3rem; }
                .usage-table { width: 100%; border-collapse: collapse; }
                .usage-table th { text-align: left; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-weight: 500; font-size: 0.85rem; }
                .usage-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .usage-table tr:hover { background: rgba(255,255,255,0.03); }
                .usage-table .date { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
                .usage-table .operation { font-weight: 500; }
                .usage-table .model { font-family: monospace; font-size: 0.85rem; color: rgba(102,126,234,0.9); }
                .usage-table .tokens { text-align: right; font-family: monospace; color: rgba(255,255,255,0.7); }
                .usage-table .tokens.total { font-weight: 600; color: white; }
                .usage-table .cost { text-align: right; font-weight: 600; color: #10b981; }
                
                .info-box { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 30px; text-align: center; }
                .info-box p { color: rgba(255,255,255,0.7); }
                @media (max-width: 768px) { 
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .usage-table-container { overflow-x: auto; }
                }
            `}</style>
        </div>
    );
}
