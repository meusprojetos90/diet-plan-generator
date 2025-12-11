import pool from './db';

export async function getSetting(key: string): Promise<string | null> {
    try {
        const result = await pool.query(
            'SELECT value FROM site_settings WHERE key = $1',
            [key]
        );
        return result.rows[0]?.value || null;
    } catch (error) {
        console.error('Error getting setting:', error);
        return null;
    }
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
    try {
        const result = await pool.query(
            'SELECT key, value FROM site_settings WHERE key = ANY($1)',
            [keys]
        );
        const settings: Record<string, string> = {};
        result.rows.forEach((row: any) => {
            settings[row.key] = row.value || '';
        });
        return settings;
    } catch (error) {
        console.error('Error getting settings:', error);
        return {};
    }
}

export async function getAllSettings(): Promise<Record<string, string>> {
    try {
        const result = await pool.query('SELECT key, value FROM site_settings');
        const settings: Record<string, string> = {};
        result.rows.forEach((row: any) => {
            settings[row.key] = row.value || '';
        });
        return settings;
    } catch (error) {
        console.error('Error getting all settings:', error);
        return {};
    }
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
    try {
        await pool.query(
            `INSERT INTO site_settings (key, value, updated_at) 
             VALUES ($1, $2, NOW()) 
             ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
            [key, value]
        );
        return true;
    } catch (error) {
        console.error('Error updating setting:', error);
        return false;
    }
}

export async function updateSettings(settings: Record<string, string>): Promise<boolean> {
    try {
        for (const [key, value] of Object.entries(settings)) {
            await updateSetting(key, value);
        }
        return true;
    } catch (error) {
        console.error('Error updating settings:', error);
        return false;
    }
}

// Get public settings for client-side (tracking, SEO, branding)
export async function getPublicSettings(): Promise<Record<string, string>> {
    const publicKeys = [
        'site_name',
        'site_description',
        'logo_url',
        'favicon_url',
        'facebook_pixel_id',
        'google_analytics_id',
        'google_tag_manager_id',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'primary_color',
        'secondary_color'
    ];
    return getSettings(publicKeys);
}
