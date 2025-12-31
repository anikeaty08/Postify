import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validations';
import type { ApiResponse } from '@/types';

export async function PUT(request: NextRequest) {
    try {
        // Get current user from JWT
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();

        // Validate input
        const validatedData = updateProfileSchema.parse(body);

        // Connect to database
        await dbConnect();

        // Update user profile
        const user = await User.findByIdAndUpdate(
            currentUser.userId,
            {
                $set: {
                    bio: validatedData.bio,
                    avatar: validatedData.avatar,
                },
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Return response
        const response: ApiResponse = {
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
    } catch (error: any) {
        // Handle validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    error: error.errors[0].message,
                },
                { status: 400 }
            );
        }

        console.error('Update profile error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to update profile',
            },
            { status: 500 }
        );
    }
}
