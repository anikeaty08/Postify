import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { getCurrentUser } from '@/lib/auth';
import { updatePostSchema } from '@/lib/validations';
import type { ApiResponse } from '@/types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Connect to database
        await dbConnect();

        // Get post
        const post = await Post.findById(id).lean();

        if (!post) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        // Increment views
        await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

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
                    views: post.views + 1,
                    userId: post.userId,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                },
            },
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Get post error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to fetch post',
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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
        const validatedData = updatePostSchema.parse(body);

        // Connect to database
        await dbConnect();

        // Find post
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        // Check ownership
        if (post.userId !== currentUser.userId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Unauthorized to update this post' },
                { status: 403 }
            );
        }

        // Update post
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $set: validatedData },
            { new: true, runValidators: true }
        );

        // Return response
        const response: ApiResponse = {
            success: true,
            data: {
                post: {
                    id: updatedPost!._id.toString(),
                    title: updatedPost!.title,
                    content: updatedPost!.content,
                    coverImage: updatedPost!.coverImage,
                    isDraft: updatedPost!.isDraft,
                    views: updatedPost!.views,
                    createdAt: updatedPost!.createdAt,
                    updatedAt: updatedPost!.updatedAt,
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

        console.error('Update post error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to update post',
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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

        // Find post
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        // Check ownership
        if (post.userId !== currentUser.userId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Unauthorized to delete this post' },
                { status: 403 }
            );
        }

        // Delete post
        await Post.findByIdAndDelete(id);

        // Return response
        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Post deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete post error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to delete post',
            },
            { status: 500 }
        );
    }
}
