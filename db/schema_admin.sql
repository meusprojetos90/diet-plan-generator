-- Admin Panel Database Schema

-- Admin users (whitelist)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- Insert default admin (replace with your email)
INSERT INTO
    admins (email, name)
VALUES (
        'edimarbarros90@gmail.com',
        'Admin'
    )
ON CONFLICT DO NOTHING;

-- AI usage tracking
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID REFERENCES customers (id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders (id) ON DELETE SET NULL,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    model VARCHAR(50) DEFAULT 'gpt-4o-mini',
    cost_usd DECIMAL(10, 6),
    operation VARCHAR(100),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs (created_at);

CREATE INDEX idx_ai_usage_logs_customer_id ON ai_usage_logs (customer_id);

-- Leads tracking (incomplete signups)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    quiz_data JSONB,
    source VARCHAR(50) DEFAULT 'quiz',
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        converted_at TIMESTAMP
    WITH
        TIME ZONE
);

CREATE INDEX idx_leads_email ON leads (email);

CREATE INDEX idx_leads_status ON leads (status);

CREATE INDEX idx_leads_created_at ON leads (created_at);