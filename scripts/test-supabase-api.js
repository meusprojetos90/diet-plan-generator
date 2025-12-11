
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testApi() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Testing Supabase API connection...');
    console.log(`URL: ${url}`);

    if (!url || !key) {
        console.error('Missing Supabase env vars');
        return;
    }

    const supabase = createClient(url, key);

    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ API Error:', error.message);
            if (error.code) console.error('Code:', error.code);
        } else {
            console.log('✅ API Connection Successful!');
            console.log('Profiles count accessible (or partial access).');
        }
    } catch (err) {
        console.error('❌ Network/Client Error:', err.message);
    }
}

testApi();
