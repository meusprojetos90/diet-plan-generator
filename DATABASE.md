# 🗄️ Database Guide

## ✅ Migration Completed Successfully!

Your PostgreSQL database has been set up with the following tables:

### Tables Created

1. **customers** (8 columns)
   - Stores customer information
   - Unique email constraint
   - Tracks locale and currency preferences

2. **intakes** (4 columns)
   - Stores quiz/form responses
   - JSON payload for flexibility
   - Links to customers

3. **orders** (12 columns)
   - Payment and order information
   - Stripe integration fields
   - PDF URL storage
   - Status tracking

4. **jobs** (7 columns)
   - Background job tracking
   - PDF generation status
   - Error logging

5. **meal_plans** (4 columns)
   - Generated meal plan data
   - JSON storage for AI output
   - Links to orders

## 🔧 Database Scripts

### Run Migration
```bash
node scripts/migrate.js
```

### Verify Database
```bash
node scripts/verify-db.js
```

## 📝 Example Queries

### Insert a Customer
```sql
INSERT INTO customers (name, email, locale, currency, country)
VALUES ('João Silva', 'joao@example.com', 'pt-BR', 'BRL', 'BR');
```

### Insert an Intake
```sql
INSERT INTO intakes (customer_id, payload_json)
VALUES (
  'customer-uuid-here',
  '{"name": "João", "age": 30, "weight": 75, "goals": ["perder peso"]}'::jsonb
);
```

### Create an Order
```sql
INSERT INTO orders (customer_id, intake_id, days, price, currency, status)
VALUES (
  'customer-uuid-here',
  'intake-uuid-here',
  30,
  39.00,
  'BRL',
  'pending'
);
```

### Query Orders with Customer Info
```sql
SELECT 
  o.id,
  o.days,
  o.price,
  o.currency,
  o.status,
  c.name as customer_name,
  c.email as customer_email
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC
LIMIT 10;
```

## 🔄 Next Steps

1. **Configure Stripe Webhook**
   - The webhook will automatically save orders to the database
   - See `app/api/webhook/route.ts`

2. **Test the Flow**
   - Complete the quiz
   - Make a test payment
   - Check if data is saved correctly

3. **Monitor Jobs**
   ```sql
   SELECT * FROM jobs WHERE status = 'pending' ORDER BY created_at DESC;
   ```

## 🛠️ Useful Queries

### Check Recent Orders
```sql
SELECT 
  o.*,
  c.email,
  j.status as job_status
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN jobs j ON j.order_id = o.id
ORDER BY o.created_at DESC
LIMIT 5;
```

### Find Failed Jobs
```sql
SELECT 
  j.*,
  o.days,
  c.email
FROM jobs j
JOIN orders o ON j.order_id = o.id
JOIN customers c ON o.customer_id = c.id
WHERE j.status = 'failed'
ORDER BY j.created_at DESC;
```

### Get Customer Statistics
```sql
SELECT 
  COUNT(*) as total_customers,
  COUNT(DISTINCT CASE WHEN locale = 'pt-BR' THEN id END) as brazilian_customers,
  COUNT(DISTINCT CASE WHEN locale = 'en' THEN id END) as english_customers
FROM customers;
```

## 🔐 Security Notes

- All sensitive data is in `.env.local` (not committed to git)
- Database URL should use SSL in production
- Use prepared statements to prevent SQL injection
- Customer emails are unique (enforced by database)

## 📊 Database Diagram

```
customers
    ↓ (1:N)
intakes
    ↓
orders ← jobs (1:1)
    ↓
meal_plans
```

## 🚨 Troubleshooting

### Connection Issues
```bash
# Test connection
node -e "const {Client}=require('pg');const c=new Client({connectionString:process.env.DATABASE_URL});c.connect().then(()=>console.log('✅ Connected')).catch(e=>console.error('❌',e.message))"
```

### Reset Database (⚠️ DANGER - Deletes all data)
```sql
DROP TABLE IF EXISTS meal_plans CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS intakes CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
```

Then run migration again:
```bash
node scripts/migrate.js
```
