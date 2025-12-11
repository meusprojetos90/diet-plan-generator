"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Settings {
    site_name: string
    site_description: string
    logo_url: string
    favicon_url: string
    facebook_pixel_id: string
    google_analytics_id: string
    google_tag_manager_id: string
    meta_title: string
    meta_description: string
    meta_keywords: string
    primary_color: string
    secondary_color: string
}

type TabType = 'general' | 'seo' | 'tracking' | 'colors'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('general')
    const [settings, setSettings] = useState<Settings>({
        site_name: '',
        site_description: '',
        logo_url: '',
        favicon_url: '',
        facebook_pixel_id: '',
        google_analytics_id: '',
        google_tag_manager_id: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        primary_color: '#667eea',
        secondary_color: '#764ba2'
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (data.settings) {
                setSettings(prev => ({ ...prev, ...data.settings }))
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        setMessage(null)

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            })

            if (res.ok) {
                setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' })
            } else {
                setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
        } finally {
            setIsSaving(false)
        }
    }

    const updateField = (key: keyof Settings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const tabs = [
        { id: 'general' as TabType, label: '⚙️ Geral', icon: '⚙️' },
        { id: 'seo' as TabType, label: '🔍 SEO', icon: '🔍' },
        { id: 'tracking' as TabType, label: '📊 Rastreamento', icon: '📊' },
        { id: 'colors' as TabType, label: '🎨 Cores', icon: '🎨' }
    ]

    if (isLoading) {
        return (
            <div className="admin-container">
                <div className="loading">Carregando configurações...</div>
            </div>
        )
    }

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <Link href="/admin" className="back-link">← Voltar ao Admin</Link>
                <h1>⚙️ Configurações do Site</h1>
            </nav>

            <div className="settings-layout">
                <div className="tabs-sidebar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {activeTab === 'general' && (
                        <div className="settings-section">
                            <h2>Configurações Gerais</h2>

                            <div className="form-group">
                                <label>Nome do Site</label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => updateField('site_name', e.target.value)}
                                    placeholder="Cool Plan"
                                />
                            </div>

                            <div className="form-group">
                                <label>Descrição do Site</label>
                                <textarea
                                    value={settings.site_description}
                                    onChange={(e) => updateField('site_description', e.target.value)}
                                    placeholder="Planos alimentares personalizados"
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label>URL do Logo</label>
                                <input
                                    type="url"
                                    value={settings.logo_url}
                                    onChange={(e) => updateField('logo_url', e.target.value)}
                                    placeholder="https://exemplo.com/logo.png"
                                />
                                {settings.logo_url && (
                                    <div className="preview">
                                        <img src={settings.logo_url} alt="Logo" style={{ maxHeight: '60px' }} />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>URL do Favicon</label>
                                <input
                                    type="url"
                                    value={settings.favicon_url}
                                    onChange={(e) => updateField('favicon_url', e.target.value)}
                                    placeholder="https://exemplo.com/favicon.ico"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="settings-section">
                            <h2>SEO - Otimização para Buscadores</h2>

                            <div className="form-group">
                                <label>Meta Title</label>
                                <input
                                    type="text"
                                    value={settings.meta_title}
                                    onChange={(e) => updateField('meta_title', e.target.value)}
                                    placeholder="Plano Alimentar Personalizado"
                                />
                                <small>Título que aparece na aba do navegador e nos resultados de busca</small>
                            </div>

                            <div className="form-group">
                                <label>Meta Description</label>
                                <textarea
                                    value={settings.meta_description}
                                    onChange={(e) => updateField('meta_description', e.target.value)}
                                    placeholder="Descrição do site para buscadores"
                                    rows={3}
                                />
                                <small>Descrição exibida nos resultados de busca (máximo 160 caracteres)</small>
                            </div>

                            <div className="form-group">
                                <label>Keywords</label>
                                <input
                                    type="text"
                                    value={settings.meta_keywords}
                                    onChange={(e) => updateField('meta_keywords', e.target.value)}
                                    placeholder="dieta, plano alimentar, nutrição, treino"
                                />
                                <small>Palavras-chave separadas por vírgula</small>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tracking' && (
                        <div className="settings-section">
                            <h2>Rastreamento e Analytics</h2>

                            <div className="form-group">
                                <label>🔵 Facebook Pixel ID</label>
                                <input
                                    type="text"
                                    value={settings.facebook_pixel_id}
                                    onChange={(e) => updateField('facebook_pixel_id', e.target.value)}
                                    placeholder="123456789012345"
                                />
                                <small>ID numérico do seu Pixel do Facebook</small>
                            </div>

                            <div className="form-group">
                                <label>📈 Google Analytics ID</label>
                                <input
                                    type="text"
                                    value={settings.google_analytics_id}
                                    onChange={(e) => updateField('google_analytics_id', e.target.value)}
                                    placeholder="G-XXXXXXXXXX"
                                />
                                <small>ID do Google Analytics 4 (começa com G-)</small>
                            </div>

                            <div className="form-group">
                                <label>📦 Google Tag Manager ID</label>
                                <input
                                    type="text"
                                    value={settings.google_tag_manager_id}
                                    onChange={(e) => updateField('google_tag_manager_id', e.target.value)}
                                    placeholder="GTM-XXXXXXX"
                                />
                                <small>ID do GTM (começa com GTM-)</small>
                            </div>
                        </div>
                    )}

                    {activeTab === 'colors' && (
                        <div className="settings-section">
                            <h2>Cores do Tema</h2>

                            <div className="color-grid">
                                <div className="form-group">
                                    <label>Cor Primária</label>
                                    <div className="color-input">
                                        <input
                                            type="color"
                                            value={settings.primary_color}
                                            onChange={(e) => updateField('primary_color', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={settings.primary_color}
                                            onChange={(e) => updateField('primary_color', e.target.value)}
                                            placeholder="#667eea"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Cor Secundária</label>
                                    <div className="color-input">
                                        <input
                                            type="color"
                                            value={settings.secondary_color}
                                            onChange={(e) => updateField('secondary_color', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={settings.secondary_color}
                                            onChange={(e) => updateField('secondary_color', e.target.value)}
                                            placeholder="#764ba2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="color-preview">
                                <div
                                    className="preview-box"
                                    style={{
                                        background: `linear-gradient(135deg, ${settings.primary_color} 0%, ${settings.secondary_color} 100%)`
                                    }}
                                >
                                    <span>Preview do Gradiente</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="actions">
                        <button
                            className="save-btn"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Salvando...' : '💾 Salvar Configurações'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-container {
                    min-height: 100vh;
                    background: #f5f5f5;
                    padding: 20px;
                }

                .admin-nav {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .back-link {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 500;
                }

                .admin-nav h1 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .settings-layout {
                    display: flex;
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .tabs-sidebar {
                    width: 220px;
                    background: white;
                    border-radius: 12px;
                    padding: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    height: fit-content;
                }

                .tab-btn {
                    display: block;
                    width: 100%;
                    padding: 15px 20px;
                    border: none;
                    background: none;
                    text-align: left;
                    font-size: 1rem;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .tab-btn:hover {
                    background: #f0f0f0;
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .tab-content {
                    flex: 1;
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .settings-section h2 {
                    margin: 0 0 25px 0;
                    color: #333;
                    font-size: 1.3rem;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 10px;
                }

                .form-group {
                    margin-bottom: 25px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }

                .form-group input[type="text"],
                .form-group input[type="url"],
                .form-group textarea {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    border-color: #667eea;
                    outline: none;
                }

                .form-group small {
                    display: block;
                    margin-top: 6px;
                    color: #888;
                    font-size: 0.85rem;
                }

                .preview {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f9f9f9;
                    border-radius: 8px;
                }

                .color-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .color-input {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .color-input input[type="color"] {
                    width: 50px;
                    height: 40px;
                    border: none;
                    cursor: pointer;
                    border-radius: 8px;
                }

                .color-input input[type="text"] {
                    flex: 1;
                }

                .color-preview {
                    margin-top: 20px;
                }

                .preview-box {
                    height: 100px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .message {
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }

                .message.success {
                    background: #d4edda;
                    color: #155724;
                }

                .message.error {
                    background: #f8d7da;
                    color: #721c24;
                }

                .actions {
                    margin-top: 30px;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }

                .save-btn {
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .save-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .save-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .loading {
                    text-align: center;
                    padding: 50px;
                    color: #666;
                }

                @media (max-width: 768px) {
                    .settings-layout {
                        flex-direction: column;
                    }

                    .tabs-sidebar {
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 5px;
                    }

                    .tab-btn {
                        flex: 1;
                        min-width: calc(50% - 5px);
                        text-align: center;
                    }

                    .color-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
}
