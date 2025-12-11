'use client';

import { useEffect, useState } from 'react';

interface Client {
    id: string;
    email: string;
    name: string | null;
    created_at: string;
    plans_count: number;
    last_plan_date: string | null;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export default function AdminClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/clients')
            .then(res => res.json())
            .then(data => {
                setClients(data.clients || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Carregando...</div>;
    }

    return (
        <div className="admin-clients">
            <header className="page-header">
                <div className="header-content">
                    <h1>👥 Clientes</h1>
                    <p>Gerenciar clientes cadastrados</p>
                </div>
                <div className="header-stats">
                    <span className="total">{clients.length} clientes</span>
                </div>
            </header>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Planos</th>
                            <th>Último Plano</th>
                            <th>Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="empty">Nenhum cliente encontrado</td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr key={client.id}>
                                    <td className="name-cell">
                                        <div className="avatar">{(client.name || client.email).charAt(0).toUpperCase()}</div>
                                        {client.name || '-'}
                                    </td>
                                    <td className="email">{client.email}</td>
                                    <td><span className={`plans-badge ${client.plans_count > 0 ? 'has-plans' : ''}`}>{client.plans_count} planos</span></td>
                                    <td>{client.last_plan_date ? formatDate(client.last_plan_date) : '-'}</td>
                                    <td>{formatDate(client.created_at)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .admin-clients { color: white; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
                .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                .page-header p { color: rgba(255,255,255,0.6); }
                .header-stats .total { background: rgba(102,126,234,0.2); color: #667eea; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; }
                .table-container { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
                th { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); font-weight: 600; background: rgba(0,0,0,0.2); }
                tr:hover { background: rgba(255,255,255,0.02); }
                .name-cell { display: flex; align-items: center; gap: 12px; font-weight: 500; }
                .avatar { width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
                .email { color: rgba(255,255,255,0.7); }
                .plans-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
                .plans-badge.has-plans { background: rgba(16,185,129,0.2); color: #10b981; }
                td.empty { text-align: center; color: rgba(255,255,255,0.5); padding: 50px; }
            `}</style>
        </div>
    );
}
