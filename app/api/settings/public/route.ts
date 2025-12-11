import { NextResponse } from 'next/server';
import { getPublicSettings } from '@/lib/settings';

// Public endpoint - no auth required
// Returns settings needed for tracking and SEO
export async function GET() {
    try {
        const settings = await getPublicSettings();

        // Cache for 5 minutes
        return NextResponse.json(
            { settings },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
