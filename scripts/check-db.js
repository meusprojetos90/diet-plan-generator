
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDB() {
    try {
        const client = await pool.connect();

        console.log("--- LATEST ORDER ---");
        const orders = await client.query("SELECT id, status, customer_id, stripe_session_id FROM orders ORDER BY created_at DESC LIMIT 1");
        console.log(orders.rows[0] || "No orders found");

        console.log("\n--- LATEST PROFILE ---");
        const profiles = await client.query("SELECT id, email, name FROM profiles ORDER BY created_at DESC LIMIT 1");
        console.log(profiles.rows[0] || "No profiles found");

        console.log("\n--- LATEST USER PLAN ---");
        const plans = await client.query("SELECT id, user_id, subscription_status, start_date FROM user_plans ORDER BY created_at DESC LIMIT 1");
        console.log(plans.rows[0] || "No plans found");

        client.release();
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        pool.end();
    }
}

checkDB();
