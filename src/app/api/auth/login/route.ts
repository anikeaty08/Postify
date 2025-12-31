import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import type { ApiResponse, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate input
        const validatedData = loginSchema.parse(body);
        const { email, password } = validatedData;

        // Connect to database
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
        });

        // Set auth cookie
        await setAuthCookie(token);

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

        console.error('Login error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to log in. Please try again.',
            },
            { status: 500 }
        );
    }
}
