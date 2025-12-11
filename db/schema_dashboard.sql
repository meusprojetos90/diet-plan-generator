-- Dashboard Tables --

-- Profiles (linking Auth users to app data)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- User Plans (Active plans for dashboard)
CREATE TABLE IF NOT EXISTS user_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    intake JSONB NOT NULL,
    meal_plan JSONB NOT NULL,
    workout_plan JSONB,
    days INTEGER DEFAULT 7,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    subscription_status VARCHAR(50) DEFAULT 'active',
    stripe_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    amount_paid DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'BRL',
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

CREATE INDEX idx_user_plans_user_id ON user_plans (user_id);

-- Daily Logs (Progress tracking)
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_plan_id UUID NOT NULL REFERENCES user_plans (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_ids TEXT [], -- Array of completed meal IDs (e.g., ["meal-1", "meal-3"])
    workout_completed BOOLEAN DEFAULT FALSE,
    water_ml INTEGER DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        UNIQUE (user_plan_id, date)
);

CREATE INDEX idx_daily_logs_user_plan_date ON daily_logs (user_plan_id, date);

-- Weight Logs (Weight tracking with BMI)
CREATE TABLE IF NOT EXISTS weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    weight DECIMAL(5, 2) NOT NULL, -- peso em kg
    height DECIMAL(5, 2) NOT NULL, -- altura em cm (para cálculo de IMC)
    bmi DECIMAL(4, 2), -- IMC calculado
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT, -- observações opcionais
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        UNIQUE (user_id, date) -- um registro por dia por usuário
);

CREATE INDEX idx_weight_logs_user_date ON weight_logs (user_id, date);

-- Function to handle new user signup (Supabase Auth Hook pattern)
-- Note: You might need to set this up in Supabase dashboard explicitly if triggers aren't sufficient
-- or rely on the API to create the profile row manually (which save-plan currently does logic for, partially).