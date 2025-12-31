import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import type { ApiResponse } from '@/types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;

        // Connect to database
        await dbConnect();

        // Find user by username
        const user = await User.findOne({ username: username.toLowerCase() }).select('-password');

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Get all published posts for this user
        const posts = await Post.find({
            userId: user._id.toString(),
            isDraft: false,
        })
            .sort({ createdAt: -1 })
            .lean();

        // Return response
        const response: ApiResponse = {
            success: true,
            data: {
                user: {
                    id: user._id.toString(),
                    username: user.username,
                    bio: user.bio,
                    avatar: user.avatar,
                },
                posts: posts.map((post) => ({
                    id: post._id.toString(),
                    title: post.title,
                    content: post.content,
                    coverImage: post.coverImage,
                    views: post.views,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                })),
            },
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Get user posts error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: 'Failed to fetch user posts',
            },
            { status: 500 }
        );
    }
}
