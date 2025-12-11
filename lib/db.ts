import { Pool } from 'pg';

// Extend globalThis to include pgPool
const globalForPg = globalThis as unknown as { pgPool?: Pool };

let pool: Pool;

if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
}

pool = globalForPg.pgPool;

export default pool;
