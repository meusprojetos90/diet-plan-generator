# Diet Plan Generator - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Vercel account (for deployment)
- Stripe account
- OpenAI API key
- AWS S3 bucket (or Supabase Storage)
- Resend account (for emails)
- PostgreSQL database (Supabase or Vercel Postgres)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all the required values:

- **OPENAI_API_KEY**: Get from https://platform.openai.com/api-keys
- **STRIPE_SECRET_KEY**: Get from https://dashboard.stripe.com/apikeys
- **STRIPE_WEBHOOK_SECRET**: Create webhook endpoint in Stripe dashboard
- **RESEND_API_KEY**: Get from https://resend.com/api-keys
- **AWS credentials**: Create IAM user with S3 access

### 3. Setup Database

Run the schema:

```bash
# If using Supabase
psql $DATABASE_URL < db/schema.sql

# Or use your database GUI to run the schema.sql file
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Stripe Webhook Setup (Local Testing)

Install Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
```

Login and forward webhooks:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook signing secret to `.env.local`.

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo in the Vercel dashboard.

### 3. Configure Environment Variables

Add all environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add all variables from `.env.example`

### 4. Setup Stripe Webhook (Production)

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook signing secret to Vercel env vars

### 5. Configure DNS (Optional)

Add custom domain in Vercel dashboard:
- Settings → Domains
- Add your domain and configure DNS

## Background Jobs (Production)

The current implementation calls the PDF generation endpoint directly from the webhook. For production, consider using:

### Option 1: Vercel Cron Jobs + Database Queue

Create a cron job that processes pending jobs from the database.

### Option 2: Upstash + QStash

```bash
npm install @upstash/qstash
```

Configure in webhook handler to queue jobs.

### Option 3: Inngest

```bash
npm install inngest
```

Best for complex workflows with retries and monitoring.

## Monitoring & Debugging

### View Logs

```bash
vercel logs <deployment-url>
```

### Test Webhook Locally

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{"type":"checkout.session.completed"}'
```

### Test PDF Generation

```bash
curl -X POST http://localhost:3000/api/preview \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "age": 30,
    "weight": 70,
    "height": 170,
    "gender": "male",
    "goal": "lose weight",
    "restrictions": [],
    "style": "omnivore",
    "activityLevel": "moderate",
    "mealsPerDay": 4,
    "locale": "en"
  }'
```

## Performance Optimization

### 1. Puppeteer in Vercel

Vercel has a 50MB deployment limit. Use `puppeteer-core` with `@sparticuz/chromium`:

```bash
npm install puppeteer-core @sparticuz/chromium
```

Update `lib/pdf-generator.ts`:

```typescript
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

### 2. OpenAI Rate Limits

Monitor usage at https://platform.openai.com/usage

Consider implementing:
- Request queuing
- Rate limiting per user
- Caching for similar requests

### 3. S3 Optimization

- Enable CloudFront CDN
- Set appropriate cache headers
- Use presigned URLs for temporary access

## Security Checklist

- ✅ Stripe webhook signature verification
- ✅ Internal API secret for PDF generation endpoint
- ✅ Environment variables not committed to git
- ✅ S3 bucket CORS configuration
- ✅ Rate limiting on API routes
- ✅ Input validation on all endpoints

## Cost Estimation (Monthly)

- **Vercel Pro**: $20/month (includes 100GB bandwidth)
- **OpenAI**: ~$0.50 per 1000 meal plans (GPT-4o-mini)
- **Stripe**: 2.9% + $0.30 per transaction
- **Resend**: Free up to 3,000 emails/month
- **AWS S3**: ~$0.023 per GB storage + $0.09 per GB transfer
- **Database**: Supabase free tier or Vercel Postgres $20/month

**Example**: 100 customers/month = ~$50-70 total costs

## Troubleshooting

### PDF Generation Fails

- Check Puppeteer logs
- Verify chromium installation in production
- Increase Vercel function timeout (max 60s on Pro)

### Webhook Not Receiving Events

- Verify webhook URL in Stripe dashboard
- Check webhook signing secret
- Review Vercel function logs

### Email Not Sending

- Verify Resend API key
- Check email domain verification
- Review Resend dashboard logs

## Next Steps

1. Implement proper job queue (BullMQ/Inngest)
2. Add database persistence for orders
3. Create admin dashboard
4. Add customer portal for re-downloading PDFs
5. Implement analytics and tracking
6. Add A/B testing for pricing
7. Create referral system
