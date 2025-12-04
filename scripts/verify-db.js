/**
 * Verify Database Tables
 * Run with: node scripts/verify-db.js
 */

const { Client } = require('pg');

async function verify() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // List all tables
        const result = await client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('📊 Tables in database:\n');
        result.rows.forEach(row => {
            console.log(`  ✓ ${row.table_name} (${row.column_count} columns)`);
        });

        // Check each table structure
        console.log('\n📋 Table structures:\n');

        const tables = ['customers', 'intakes', 'orders', 'jobs', 'meal_plans'];

        for (const table of tables) {
            const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table]);

            console.log(`\n${table}:`);
            columns.rows.forEach(col => {
                const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
                console.log(`  - ${col.column_name}: ${col.data_type} ${nullable}`);
            });
        }

        console.log('\n✅ Database verification complete!');

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        await client.end();
    }
}

require('dotenv').config({ path: '.env.local' });
verify();
