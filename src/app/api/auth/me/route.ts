import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import type { ApiResponse, AuthResponse } from '@/types';

export async function GET(request: NextRequest) {
    try {
        // Get current user from JWT
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user
        const user = await User.findById(currentUser.userId).select('-password');

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Return response
        const response: ApiResponse<AuthResponse> = {
            success: true,
            data: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                    bio: user.bio,
                    avatar: user.avatar,
                },
            },
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to get user information' },
            { status: 500 }
        );
    }
}
