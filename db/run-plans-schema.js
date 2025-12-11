// Run: node db/run-plans-schema.js
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const schema = `
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    days INTEGER NOT NULL UNIQUE,
    price_brl DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    original_price_brl DECIMAL(10, 2),
    original_price_usd DECIMAL(10, 2),
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    features JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO plans (name, days, price_brl, price_usd, original_price_brl, original_price_usd, is_popular, features)
VALUES 
    ('Plano Semanal', 7, 19.00, 9.00, 47.00, 19.00, false, '["Plano alimentar completo", "Lista de compras", "Suporte por email"]'),
    ('Plano Quinzenal', 14, 29.00, 19.00, 67.00, 29.00, false, '["Plano alimentar completo", "Lista de compras", "Treino básico", "Suporte por email"]'),
    ('Plano Mensal', 30, 39.00, 29.00, 97.00, 39.00, true, '["Plano alimentar completo", "Lista de compras", "Treino personalizado", "Área do cliente", "Suporte prioritário"]'),
    ('Plano Trimestral', 90, 59.00, 39.00, 237.00, 99.00, false, '["Plano alimentar completo", "Lista de compras", "Treino personalizado", "Área do cliente", "Suporte VIP", "Atualizações gratuitas"]')
ON CONFLICT (days) DO NOTHING;
`;

async function run() {
    try {
        console.log('Creating plans table...');
        await pool.query(schema);
        console.log('✅ Plans table created with default plans!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

run();
