-- Diet Plan Generator Database Schema

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    country VARCHAR(2),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

CREATE INDEX idx_customers_email ON customers (email);

-- Intakes table (quiz responses)
CREATE TABLE IF NOT EXISTS intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    payload_json JSONB NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

CREATE INDEX idx_intakes_customer_id ON intakes (customer_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    intake_id UUID REFERENCES intakes (id) ON DELETE SET NULL,
    days INTEGER NOT NULL CHECK (days IN (7, 14, 30, 90)),
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    pdf_url TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

CREATE INDEX idx_orders_customer_id ON orders (customer_id);

CREATE INDEX idx_orders_stripe_session_id ON orders (stripe_session_id);

CREATE INDEX idx_orders_status ON orders (status);

-- Jobs table (for PDF generation tracking)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    order_id UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    started_at TIMESTAMP
    WITH
        TIME ZONE,
        finished_at TIMESTAMP
    WITH
        TIME ZONE,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

CREATE INDEX idx_jobs_order_id ON jobs (order_id);

CREATE INDEX idx_jobs_status ON jobs (status);

-- Meal plans table (stores generated meal plan JSON)
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    order_id UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    plan_json JSONB NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

CREATE INDEX idx_meal_plans_order_id ON meal_plans (order_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE customers IS 'Stores customer information';

COMMENT ON TABLE intakes IS 'Stores quiz/form responses from customers';

COMMENT ON TABLE orders IS 'Stores payment and order information';

COMMENT ON TABLE jobs IS 'Tracks background job status for PDF generation';

COMMENT ON TABLE meal_plans IS 'Stores generated meal plan data';