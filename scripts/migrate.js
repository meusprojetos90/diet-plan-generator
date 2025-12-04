/**
 * Database Migration Script
 * Run with: node scripts/migrate.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected successfully!');

        console.log('\n📄 Reading schema file...');
        const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Executing migration...\n');
        await client.query(schema);

        console.log('✅ Migration completed successfully!');
        console.log('\n📊 Tables created:');
        console.log('  - customers');
        console.log('  - intakes');
        console.log('  - orders');
        console.log('  - jobs');
        console.log('  - meal_plans');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
}

migrate();
