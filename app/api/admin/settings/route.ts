import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import pool from '@/lib/db';
import { getAllSettings, updateSettings } from '@/lib/settings';

async function isAdmin(email: string): Promise<boolean> {
    const adminEmails = ['edimarbarros90@gmail.com', 'meusprojetos90@gmail.com'];
    if (adminEmails.includes(email)) return true;

    try {
        const result = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
        return result.rows.length > 0;
    } catch {
        return false;
    }
}

export async function GET() {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isUserAdmin = await isAdmin(user.primaryEmail);
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const settings = await getAllSettings();
        return NextResponse.json({ settings });

    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const user = await stackServerApp.getUser();
        if (!user || !user.primaryEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isUserAdmin = await isAdmin(user.primaryEmail);
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { settings } = body;

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
        }

        await updateSettings(settings);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
