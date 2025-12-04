# 🚀 Como Rodar o Projeto / How to Run

## Passo a Passo / Step by Step

### 1. Reinicie o servidor / Restart the server

Se o servidor estiver rodando, pare com `Ctrl+C` e rode novamente:

```bash
npm run dev
```

### 2. Acesse no navegador / Open in browser

```
http://localhost:3000
```

## 📱 Fluxo Completo / Complete Flow

1. **Landing Page** (`/`)
   - Hero section com detecção automática de idioma
   - Features do produto
   - Pricing cards
   - CTA para começar

2. **Quiz** (`/quiz`)
   - 3 passos interativos:
     - Passo 1: Informações básicas (nome, email, idade, peso, altura)
     - Passo 2: Objetivos e estilo (meta, dieta, atividade física)
     - Passo 3: Preferências (restrições, orçamento, habilidade)
   - Gera prévia automaticamente ao finalizar

3. **Preview** (`/preview`)
   - Mostra amostra de 1 dia do plano
   - Exibe macros e receitas
   - Seleção do plano (7, 14, 30 ou 90 dias)
   - Botão de checkout (Stripe)

4. **Checkout** (Stripe)
   - Redirecionamento automático para Stripe
   - Pagamento seguro

5. **Success** (`/success`)
   - Confirmação de pagamento
   - Instruções sobre recebimento do PDF

6. **Cancel** (`/cancel`)
   - Mensagem de cancelamento
   - Opção de tentar novamente

## ⚙️ Configuração Necessária / Required Setup

### Variáveis de Ambiente / Environment Variables

Edite o arquivo `.env.local` e preencha:

```bash
# OpenAI (obrigatório para gerar planos)
OPENAI_API_KEY=sk-...

# Stripe (obrigatório para pagamentos)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (obrigatório para enviar emails)
RESEND_API_KEY=re_...

# AWS S3 (obrigatório para armazenar PDFs)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...

# Outros
NEXT_PUBLIC_APP_URL=http://localhost:3000
INTERNAL_API_SECRET=qualquer-string-secreta
```

### Como Obter as Chaves / How to Get Keys

1. **OpenAI**: https://platform.openai.com/api-keys
2. **Stripe**: https://dashboard.stripe.com/apikeys
3. **Resend**: https://resend.com/api-keys
4. **AWS S3**: https://console.aws.amazon.com/iam/

## 🧪 Testando sem Configuração / Testing Without Setup

Você pode testar o fluxo frontend sem configurar as integrações:

1. Landing page funciona normalmente
2. Quiz funciona e salva dados no localStorage
3. Preview vai falhar ao gerar (precisa OpenAI)
4. Checkout vai falhar (precisa Stripe)

## 🐛 Problemas Comuns / Common Issues

### Erro: "Module not found: Can't resolve './globals.css'"

**Solução**: Pare o servidor (`Ctrl+C`) e rode novamente:
```bash
npm run dev
```

### Erro: "Invalid next.config.mjs options"

**Solução**: Já corrigido! O arquivo foi atualizado.

### Erro ao gerar preview

**Causa**: Falta configurar `OPENAI_API_KEY`

**Solução**: Adicione a chave no `.env.local`

### Erro no checkout

**Causa**: Falta configurar Stripe

**Solução**: Adicione as chaves Stripe no `.env.local`

## 📚 Próximos Passos / Next Steps

1. ✅ Frontend completo
2. ⚙️ Configurar variáveis de ambiente
3. 🧪 Testar fluxo completo localmente
4. 🚀 Deploy na Vercel
5. 🔗 Configurar webhook do Stripe

## 💡 Dicas / Tips

- Use cartões de teste do Stripe: https://stripe.com/docs/testing
- Monitore logs do OpenAI: https://platform.openai.com/usage
- Teste em PT-BR e EN mudando o idioma do navegador

---

**Tudo pronto para começar! / Ready to start!** 🎉
