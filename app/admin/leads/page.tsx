'use client';

import { useEffect, useState } from 'react';

interface Lead {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    source: string;
    status: string;
    created_at: string;
}

interface Stats {
    total: number;
    new: number;
    contacted: number;
    converted: number;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, new: 0, contacted: 0, converted: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/leads')
            .then(res => res.json())
            .then(data => {
                setLeads(data.leads || []);
                setStats(data.stats || { total: 0, new: 0, contacted: 0, converted: 0 });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Carregando...</div>;
    }

    return (
        <div className="admin-leads">
            <header className="page-header">
                <h1>📧 Leads</h1>
                <p>Gerenciamento de leads e conversões</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card"><span className="stat-value">{stats.total}</span><span className="stat-label">Total</span></div>
                <div className="stat-card new"><span className="stat-value">{stats.new}</span><span className="stat-label">Novos</span></div>
                <div className="stat-card contacted"><span className="stat-value">{stats.contacted}</span><span className="stat-label">Contatados</span></div>
                <div className="stat-card converted"><span className="stat-value">{stats.converted}</span><span className="stat-label">Convertidos</span></div>
            </div>

            {leads.length === 0 ? (
                <div className="info-box">
                    <p>📧 Nenhum lead capturado ainda. Leads serão registrados quando usuários iniciarem mas não completarem o checkout.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Data</th><th>Email</th><th>Nome</th><th>Telefone</th><th>Origem</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>{formatDate(lead.created_at)}</td>
                                    <td className="email">{lead.email}</td>
                                    <td>{lead.name || '-'}</td>
                                    <td>{lead.phone || '-'}</td>
                                    <td><span className="source-badge">{lead.source}</span></td>
                                    <td><span className={`status-badge ${lead.status}`}>
                                        {lead.status === 'new' && '🆕 Novo'}
                                        {lead.status === 'contacted' && '📞 Contatado'}
                                        {lead.status === 'converted' && '✅ Convertido'}
                                    </span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .admin-leads { color: white; }
                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                .page-header p { color: rgba(255,255,255,0.6); }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                .stat-card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
                .stat-card.new { border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.1); }
                .stat-card.contacted { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.1); }
                .stat-card.converted { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1); }
                .stat-value { display: block; font-size: 1.5rem; font-weight: 700; margin-bottom: 5px; }
                .stat-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
                .info-box { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 30px; text-align: center; }
                .info-box p { color: rgba(255,255,255,0.7); }
                .table-container { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
                th { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); font-weight: 600; background: rgba(0,0,0,0.2); }
                .email { font-weight: 500; }
                .source-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
                .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
                .status-badge.new { background: rgba(59,130,246,0.2); color: #3b82f6; }
                .status-badge.contacted { background: rgba(245,158,11,0.2); color: #f59e0b; }
                .status-badge.converted { background: rgba(16,185,129,0.2); color: #10b981; }
                @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
            `}</style>
        </div>
    );
}
