# 🥗 Diet Plan Generator

Complete Next.js application for generating personalized AI-powered meal plans with Stripe payments and automated PDF delivery.

## ✨ Features

- 🌍 **Multi-language Support**: Automatic detection (PT-BR / EN)
- 💰 **Multi-currency Pricing**: BRL / USD with automatic detection
- 🤖 **AI-Powered Meal Plans**: OpenAI GPT-4o-mini generates personalized plans
- 📄 **Professional PDFs**: Beautiful, print-ready meal plans
- 💳 **Stripe Payments**: Secure checkout with webhook integration
- 📧 **Email Delivery**: Automated PDF delivery via Resend
- ☁️ **Cloud Storage**: S3 integration for PDF hosting

## 🏗️ Architecture

```
User → Quiz → Preview (1 day) → Stripe Checkout → Payment
                                                      ↓
                                                   Webhook
                                                      ↓
                                              Generate Full Plan
                                                      ↓
                                              AI → HTML → PDF
                                                      ↓
                                              S3 Upload + Email
```

## 📦 What's Included

### Core Utilities
- **`lib/prompts.ts`**: Comprehensive AI prompts (PT-BR/EN) with structured JSON output
- **`lib/pdf-generator.ts`**: HTML rendering + Puppeteer PDF generation
- **`lib/prices.ts`**: Multi-currency price mapping
- **`lib/openai.ts`**: OpenAI integration for meal plan generation
- **`lib/email.ts`**: Resend email service with bilingual templates
- **`lib/storage.ts`**: S3 upload functionality

### API Routes
- **`/api/checkout`**: Create Stripe checkout session
- **`/api/webhook`**: Handle Stripe payment confirmations
- **`/api/preview`**: Generate 1-day sample meal plan
- **`/api/generate-pdf`**: Background job for full plan generation

### Configuration
- **`middleware.ts`**: Auto-detect language and currency
- **`db/schema.sql`**: PostgreSQL database schema
- **`package.json`**: All required dependencies
- **`.env.example`**: Environment variables template

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your API keys:
- OpenAI API key
- Stripe secret key & webhook secret
- Resend API key
- AWS S3 credentials
- Database URL

### 3. Setup Database

```bash
psql $DATABASE_URL < db/schema.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📝 Example Usage

### Generate Preview

```typescript
const response = await fetch('/api/preview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "João Silva",
    age: 30,
    weight: 75,
    height: 175,
    gender: "male",
    goal: "perder peso",
    restrictions: ["lactose"],
    style: "onívoro",
    activityLevel: "moderado",
    mealsPerDay: 4,
    locale: "pt-BR"
  })
});

const preview = await response.json();
```

### Create Checkout

```typescript
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    days: "30",
    customerEmail: "joao@example.com",
    customerName: "João Silva",
    currency: "BRL",
    intakeId: "uuid-here"
  })
});

const { url } = await response.json();
window.location.href = url; // Redirect to Stripe
```

## 🎨 AI Prompt Features

The AI prompts are designed to generate:

- ✅ Detailed recipes with step-by-step instructions
- ✅ Precise macro calculations (calories, protein, carbs, fat, fiber)
- ✅ Ingredient lists with quantities
- ✅ Preparation time and difficulty level
- ✅ Cooking tips and substitutions
- ✅ Organized shopping list by category
- ✅ Nutritional summary (daily average + weekly total)

## 💳 Pricing Plans

| Duration | BRL | USD |
|----------|-----|-----|
| 7 days   | R$ 19 | $9  |
| 14 days  | R$ 29 | $19 |
| 30 days  | R$ 39 | $29 |
| 90 days  | R$ 59 | $39 |

## 📄 PDF Output

Generated PDFs include:

1. **Cover Page**: Personalized with customer name
2. **Nutritional Summary**: Daily averages and weekly totals
3. **Daily Meal Plans**: Complete breakdown for each day
4. **Meal Cards**: Time, recipe, ingredients, macros, tips
5. **Shopping List**: Organized by category
6. **Notes**: Important guidelines and tips

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o-mini
- **Payments**: Stripe
- **PDF**: Puppeteer
- **Email**: Resend
- **Storage**: AWS S3
- **Database**: PostgreSQL
- **Deployment**: Vercel

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Complete deployment guide
- **[Implementation Plan](/.gemini/antigravity/brain/.../implementation_plan.md)**: Detailed architecture

## 🔐 Security

- ✅ Stripe webhook signature verification
- ✅ Internal API secret for protected endpoints
- ✅ Environment variables for sensitive data
- ✅ Input validation on all routes
- ✅ CORS configuration for S3

## 🚧 Next Steps

### Frontend (To Be Implemented)

You'll need to create:

1. **Landing Page** (`app/page.tsx`)
   - Hero section with language detection
   - Pricing cards
   - CTA to start quiz

2. **Quiz Page** (`app/quiz/page.tsx`)
   - Interactive form to collect user data
   - Progress indicator
   - Submit to `/api/preview`

3. **Preview Page** (`app/preview/page.tsx`)
   - Display 1-day sample
   - Show pricing options
   - CTA to checkout

4. **Success/Cancel Pages**
   - Thank you message
   - Instructions to check email

### Recommended Libraries

- **Forms**: React Hook Form + Zod
- **UI**: shadcn/ui or Tailwind UI
- **Animations**: Framer Motion
- **State**: Zustand or React Context

## 🐛 Troubleshooting

### Puppeteer on Vercel

Use `puppeteer-core` with `@sparticuz/chromium`:

```bash
npm install puppeteer-core @sparticuz/chromium
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

### Webhook Not Working

1. Verify webhook URL in Stripe dashboard
2. Check webhook signing secret
3. Test locally with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

## 📊 Cost Estimation

For 100 customers/month:
- Vercel Pro: $20
- OpenAI: ~$5 (GPT-4o-mini)
- Stripe: ~$30 (fees)
- S3: ~$2
- Resend: Free (< 3k emails)

**Total: ~$57/month**

## 📄 License

MIT

## 🤝 Contributing

This is a starter template. Feel free to customize and extend!

## 💬 Support

For questions or issues, please refer to:
- [Implementation Plan](/.gemini/antigravity/brain/.../implementation_plan.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Built with ❤️ using Next.js, OpenAI, and Stripe**
