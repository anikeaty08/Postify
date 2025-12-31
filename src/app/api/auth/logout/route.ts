import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
    try {
        // Clear auth cookie
        await clearAuthCookie();

        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Logged out successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to log out' },
            { status: 500 }
        );
    }
}
