'use client';

import { useEffect, useState } from 'react';

interface Plan {
    id: string;
    name: string;
    days: number;
    price_brl: number;
    price_usd: number;
    original_price_brl: number | null;
    original_price_usd: number | null;
    is_popular: boolean;
    is_active: boolean;
    features: string[];
}

const emptyPlan: Omit<Plan, 'id'> = {
    name: '',
    days: 7,
    price_brl: 0,
    price_usd: 0,
    original_price_brl: null,
    original_price_usd: null,
    is_popular: false,
    is_active: true,
    features: []
};

export default function AdminPlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [saving, setSaving] = useState(false);
    const [newFeature, setNewFeature] = useState('');

    const fetchPlans = () => {
        fetch('/api/admin/plans')
            .then(res => res.json())
            .then(data => {
                setPlans(data.plans || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSave = async () => {
        if (!editingPlan) return;
        setSaving(true);

        try {
            const res = await fetch('/api/admin/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPlan)
            });
            if (res.ok) {
                setEditingPlan(null);
                fetchPlans();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este plano?')) return;

        try {
            await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE' });
            fetchPlans();
        } catch (e) {
            console.error(e);
        }
    };

    const addFeature = () => {
        if (!newFeature.trim() || !editingPlan) return;
        setEditingPlan({
            ...editingPlan,
            features: [...(editingPlan.features || []), newFeature.trim()]
        });
        setNewFeature('');
    };

    const removeFeature = (index: number) => {
        if (!editingPlan) return;
        setEditingPlan({
            ...editingPlan,
            features: (editingPlan.features || []).filter((_, i) => i !== index)
        });
    };

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Carregando...</div>;
    }

    return (
        <div className="admin-plans">
            <header className="page-header">
                <div>
                    <h1>💰 Planos e Preços</h1>
                    <p>Gerenciar planos disponíveis para venda</p>
                </div>
                <button className="btn-new" onClick={() => setEditingPlan(emptyPlan)}>
                    + Novo Plano
                </button>
            </header>

            <div className="plans-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className={`plan-card ${!plan.is_active ? 'inactive' : ''}`}>
                        <div className="plan-header">
                            <h3>{plan.name}</h3>
                            {plan.is_popular && <span className="popular-badge">Popular</span>}
                            {!plan.is_active && <span className="inactive-badge">Inativo</span>}
                        </div>
                        <div className="plan-days">{plan.days} dias</div>
                        <div className="plan-prices">
                            <div className="price">
                                <span className="currency">BRL</span>
                                {plan.original_price_brl && (
                                    <span className="original">R$ {plan.original_price_brl}</span>
                                )}
                                <span className="current">R$ {plan.price_brl}</span>
                            </div>
                            <div className="price">
                                <span className="currency">USD</span>
                                {plan.original_price_usd && (
                                    <span className="original">$ {plan.original_price_usd}</span>
                                )}
                                <span className="current">$ {plan.price_usd}</span>
                            </div>
                        </div>
                        <div className="plan-features">
                            {(typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || []).slice(0, 3).map((f: string, i: number) => (
                                <span key={i} className="feature">✓ {f}</span>
                            ))}
                        </div>
                        <div className="plan-actions">
                            <button onClick={() => setEditingPlan(plan)}>Editar</button>
                            <button className="delete" onClick={() => handleDelete(plan.id)}>Excluir</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingPlan && (
                <div className="modal-overlay" onClick={() => setEditingPlan(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editingPlan.id ? 'Editar Plano' : 'Novo Plano'}</h2>

                        <div className="form-row">
                            <label>Nome do Plano</label>
                            <input
                                type="text"
                                value={editingPlan.name || ''}
                                onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                placeholder="Ex: Plano Mensal"
                            />
                        </div>

                        <div className="form-row">
                            <label>Duração (dias)</label>
                            <input
                                type="number"
                                value={editingPlan.days || ''}
                                onChange={e => setEditingPlan({ ...editingPlan, days: parseInt(e.target.value) })}
                                placeholder="30"
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-row">
                                <label>Preço BRL</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingPlan.price_brl || ''}
                                    onChange={e => setEditingPlan({ ...editingPlan, price_brl: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="form-row">
                                <label>Preço Original BRL</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingPlan.original_price_brl || ''}
                                    onChange={e => setEditingPlan({ ...editingPlan, original_price_brl: parseFloat(e.target.value) || null })}
                                    placeholder="Para mostrar desconto"
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-row">
                                <label>Preço USD</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingPlan.price_usd || ''}
                                    onChange={e => setEditingPlan({ ...editingPlan, price_usd: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="form-row">
                                <label>Preço Original USD</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingPlan.original_price_usd || ''}
                                    onChange={e => setEditingPlan({ ...editingPlan, original_price_usd: parseFloat(e.target.value) || null })}
                                />
                            </div>
                        </div>

                        <div className="form-row checkbox-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={editingPlan.is_popular || false}
                                    onChange={e => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })}
                                />
                                Destacar como Popular
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={editingPlan.is_active !== false}
                                    onChange={e => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                                />
                                Plano Ativo
                            </label>
                        </div>

                        <div className="form-row">
                            <label>Recursos do Plano</label>
                            <div className="features-list">
                                {(editingPlan.features || []).map((f, i) => (
                                    <div key={i} className="feature-item">
                                        <span>{f}</span>
                                        <button type="button" onClick={() => removeFeature(i)}>×</button>
                                    </div>
                                ))}
                            </div>
                            <div className="add-feature">
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={e => setNewFeature(e.target.value)}
                                    placeholder="Adicionar recurso"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                />
                                <button type="button" onClick={addFeature}>+</button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setEditingPlan(null)}>Cancelar</button>
                            <button className="btn-save" onClick={handleSave} disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-plans { color: white; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
                .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                .page-header p { color: rgba(255,255,255,0.6); }
                .btn-new { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
                .btn-new:hover { transform: translateY(-2px); }

                .plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                .plan-card { background: linear-gradient(135deg, #1e1e30 0%, #252540 100%); border-radius: 16px; padding: 25px; border: 1px solid rgba(255,255,255,0.1); }
                .plan-card.inactive { opacity: 0.6; }
                .plan-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
                .plan-header h3 { margin: 0; font-size: 1.2rem; }
                .popular-badge { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
                .inactive-badge { background: rgba(239,68,68,0.2); color: #ef4444; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
                .plan-days { font-size: 2rem; font-weight: 700; margin-bottom: 15px; }
                .plan-prices { display: flex; gap: 20px; margin-bottom: 15px; }
                .price { display: flex; flex-direction: column; gap: 3px; }
                .price .currency { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
                .price .original { text-decoration: line-through; color: rgba(255,255,255,0.4); font-size: 0.85rem; }
                .price .current { font-size: 1.3rem; font-weight: 700; color: #10b981; }
                .plan-features { display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px; }
                .plan-features .feature { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
                .plan-actions { display: flex; gap: 10px; }
                .plan-actions button { flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
                .plan-actions button:first-child { background: rgba(102,126,234,0.2); color: #667eea; }
                .plan-actions button.delete { background: rgba(239,68,68,0.2); color: #ef4444; }
                .plan-actions button:hover { transform: translateY(-2px); }

                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; overflow-y: auto; }
                .modal { background: #1e1e30; padding: 30px; border-radius: 20px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
                .modal h2 { margin: 0 0 25px 0; }
                .form-row { margin-bottom: 20px; }
                .form-row label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: rgba(255,255,255,0.8); }
                .form-row input[type="text"], .form-row input[type="number"] { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; font-size: 1rem; }
                .form-row input:focus { outline: none; border-color: #667eea; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .checkbox-row { display: flex; gap: 20px; }
                .checkbox-row label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .checkbox-row input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
                .features-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
                .feature-item { display: flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.2); color: #10b981; padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; }
                .feature-item button { background: none; border: none; color: #10b981; cursor: pointer; font-size: 1.1rem; padding: 0; }
                .add-feature { display: flex; gap: 10px; }
                .add-feature input { flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; }
                .add-feature button { background: #10b981; color: white; border: none; width: 40px; border-radius: 8px; cursor: pointer; font-size: 1.2rem; }
                .modal-actions { display: flex; gap: 15px; margin-top: 30px; }
                .btn-cancel { flex: 1; padding: 12px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 10px; cursor: pointer; }
                .btn-save { flex: 1; padding: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 10px; cursor: pointer; }
                .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
