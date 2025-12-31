import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { getCurrentUser } from '@/lib/auth';
import { createPostSchema } from '@/lib/validations';
import type { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // Connect to database
        await dbConnect();

        // Build query
        const query: any = {};
        if (userId) {
            query.userId = userId;
        }

        // Get posts
        const posts = await Post.find(query).sort({ createdAt: -1 }).lean();

        // Return response
        const response: ApiResponse = {
            success: true,
            data: {
                posts: posts.map((post) => ({
                    id: post._id.toString(),
                    title: post.title,
                    content: post.content,
                    coverImage: post.coverImage,
                    isDraft: post.isDraft,
                    views: post.views,
                    userId: post.userId,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                })),
            },
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Get posts error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to fetch posts',
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
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
        const validatedData = createPostSchema.parse(body);

        // Connect to database
        await dbConnect();

        // Create post
        const post = await Post.create({
            ...validatedData,
            userId: currentUser.userId,
        });

        // Return response
        const response: ApiResponse = {
            success: true,
            data: {
                post: {
                    id: post._id.toString(),
                    title: post.title,
                    content: post.content,
                    coverImage: post.coverImage,
                    isDraft: post.isDraft,
                    views: post.views,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
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

        console.error('Create post error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to create post',
            },
            { status: 500 }
        );
    }
}
