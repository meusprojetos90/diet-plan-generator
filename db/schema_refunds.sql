-- Refund Requests Table
CREATE TABLE IF NOT EXISTS refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES user_plans (id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    admin_notes TEXT,
    requested_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        processed_at TIMESTAMP
    WITH
        TIME ZONE,
        processed_by TEXT
);

CREATE INDEX idx_refund_requests_user_id ON refund_requests (user_id);

CREATE INDEX idx_refund_requests_status ON refund_requests (status);

CREATE INDEX idx_refund_requests_requested_at ON refund_requests (requested_at);