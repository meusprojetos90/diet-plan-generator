
import { Pool } from 'pg';

let pool: Pool;

if (!global.pgPool) {
    global.pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Neon/AWS usually, verify if 'require' string param handles it
    });
}

pool = global.pgPool;

export default pool;
