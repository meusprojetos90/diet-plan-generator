# Configuração do Supabase - Passo a Passo

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name:** dieta-personalizada (ou nome de sua preferência)
   - **Database Password:** Crie uma senha forte e salve ApWhz2fU8Lg8CUfU
   - **Region:** South America (São Paulo) - mais próximo do Brasil
5. Clique em "Create new project"
6. Aguarde alguns minutos até o projeto ser criado

## 2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (ícone de banco de dados na sidebar)
2. Clique em "+ New query"
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em "Run" ou pressione Ctrl+Enter
6. Aguarde a execução (deve aparecer "Success. No rows returned")

## 3. Obter as Credenciais

1. No painel do Supabase, vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Você verá:
   - **Project URL** - copie este valor
   - **anon public** key - copie este valor
   - **service_role** key - clique em "Reveal" e copie este valor

## 4. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

**Exemplo:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tqfdhtxjxvhrktxyfasx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZmRodHhqeHZocmt0eHlmYXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODIyMDgsImV4cCI6MjA4MDc1ODIwOH0.JSkw8NnGa8ANcn3T2KIZHb6P7YqzXvnI6QtrRSrEx_Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Reiniciar o Servidor

Após adicionar as variáveis:

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

## 6. Testar o Fluxo Completo

### Teste 1: Login/Registro
1. Acesse `http://localhost:3000/login`
2. Digite qualquer email/senha
3. Deve redirecionar para `/dashboard`

### Teste 2: Pagamento e Salvamento
1. Complete o quiz
2. Escolha um plano e faça o pagamento de teste
3. Após o pagamento, verifique no Supabase:
   - Vá em **Table Editor**
   - Selecione a tabela `user_plans`
   - Deve aparecer um registro com seus dados

### Teste 3: Webhook (com Stripe CLI)
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Faça um novo pagamento e veja os logs no terminal do Stripe CLI.

## 7. Verificar Dados no Supabase

1. Vá em **Table Editor**
2. Verifique as tabelas:
   - `profiles` - deve ter o usuário criado
   - `user_plans` - deve ter o plano salvo
   - `daily_progress` - ainda vazio (será usado depois)

## Estrutura das Tabelas

### profiles
- `id` - UUID do usuário
- `email` - Email do usuário
- `name` - Nome do usuário
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### user_plans
- `id` - UUID do plano
- `user_id` - Referência ao usuário
- `intake` - Dados do quiz (JSON)
- `meal_plan` - Plano alimentar (JSON)
- `workout_plan` - Plano de treinos (JSON)
- `days` - Duração do plano
- `start_date` - Data de início
- `end_date` - Data de término
- `subscription_status` - Status (active/expired/cancelled)
- `stripe_session_id` - ID da sessão do Stripe
- `amount_paid` - Valor pago
- `currency` - Moeda

### daily_progress
- `id` - UUID do progresso
- `user_id` - Referência ao usuário
- `plan_id` - Referência ao plano
- `date` - Data do progresso
- `meals_completed` - Refeições concluídas (JSON)
- `workout_completed` - Treino concluído (boolean)
- `water_intake` - Copos de água
- `weight` - Peso do dia
- `energy_level` - Nível de energia (1-5)

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou as chaves corretamente
- Certifique-se de que não há espaços extras
- Reinicie o servidor após adicionar as variáveis

### Erro: "relation does not exist"
- Execute o schema SQL novamente
- Verifique se todas as tabelas foram criadas

### Plano não aparece no banco
- Verifique os logs do webhook
- Certifique-se de que o Stripe CLI está rodando
- Verifique se os dados estão sendo enviados no metadata

## Próximos Passos

Após configurar o Supabase:
1. ✅ Testar login/registro
2. ✅ Testar salvamento de plano
3. 🔄 Implementar visualização do plano no dashboard
4. 🔄 Criar calendário com refeições/treinos
5. 🔄 Implementar sistema de check-ins
