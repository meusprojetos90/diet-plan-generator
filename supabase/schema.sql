-- Schema do Banco de Dados para Área do Cliente
-- Execute este SQL no Supabase SQL Editor

-- Tabela de usuários (estende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users (id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- Tabela de planos dos usuários
CREATE TABLE IF NOT EXISTS public.user_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

-- Dados do intake (quiz)
intake JSONB NOT NULL,

-- Plano gerado pela IA
meal_plan JSONB NOT NULL, workout_plan JSONB,

-- Metadados do plano
days INTEGER NOT NULL DEFAULT 7,
start_date DATE NOT NULL DEFAULT CURRENT_DATE,
end_date DATE NOT NULL,

-- Status da assinatura
subscription_status TEXT DEFAULT 'active' CHECK (
    subscription_status IN (
        'active',
        'expired',
        'cancelled'
    )
),

-- Dados do pagamento
stripe_session_id TEXT,
    stripe_payment_intent_id TEXT,
    amount_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'BRL',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de progresso diário
CREATE TABLE IF NOT EXISTS public.daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.user_plans(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,

-- Check-ins de refeições
meals_completed JSONB DEFAULT '[]'::jsonb,

-- Check-in de treino
workout_completed BOOLEAN DEFAULT FALSE,
workout_completed_at TIMESTAMP
WITH
    TIME ZONE,
    workout_notes TEXT,

-- Dados do dia
water_intake INTEGER DEFAULT 0, -- copos de água
    weight DECIMAL(5, 2), -- peso do dia
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, plan_id, date)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON public.user_plans (user_id);

CREATE INDEX IF NOT EXISTS idx_user_plans_status ON public.user_plans (subscription_status);

CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON public.daily_progress (user_id, date);

CREATE INDEX IF NOT EXISTS idx_daily_progress_plan_id ON public.daily_progress (plan_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at
    BEFORE UPDATE ON public.user_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_progress_updated_at
    BEFORE UPDATE ON public.daily_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid () = id);

-- Políticas RLS para user_plans
CREATE POLICY "Users can view own plans" ON public.user_plans FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own plans" ON public.user_plans FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Políticas RLS para daily_progress
CREATE POLICY "Users can view own progress" ON public.daily_progress FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own progress" ON public.daily_progress FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own progress" ON public.daily_progress FOR
UPDATE USING (auth.uid () = user_id);

-- Função para criar perfil automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Comentários para documentação
COMMENT ON TABLE public.profiles IS 'Perfis de usuários estendendo auth.users';

COMMENT ON TABLE public.user_plans IS 'Planos alimentares e de treino dos usuários';

COMMENT ON TABLE public.daily_progress IS 'Progresso diário dos usuários (check-ins, peso, etc)';