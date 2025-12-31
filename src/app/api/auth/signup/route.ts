import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { signupSchema } from '@/lib/validations';
import type { ApiResponse, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate input
        const validatedData = signupSchema.parse(body);
        const { email, username, password } = validatedData;

        // Connect to database
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Email already exists' },
                    { status: 400 }
                );
            }
            if (existingUser.username === username.toLowerCase()) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Username already taken' },
                    { status: 400 }
                );
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password: hashedPassword,
        });

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

        return NextResponse.json(response, { status: 201 });
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

        console.error('Signup error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to create account. Please try again.',
            },
            { status: 500 }
        );
    }
}
