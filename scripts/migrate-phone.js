
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runMigration() {
    try {
        console.log("Connecting to DB...");
        const client = await pool.connect();
        console.log("Connected.");

        console.log("Adding phone column to customers table...");
        await client.query("ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone VARCHAR(50);");
        console.log("Migration successful!");

        client.release();
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
    }
}

runMigration();
