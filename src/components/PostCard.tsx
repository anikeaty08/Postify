"use client";

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
    post: {
        id: string;
        title: string;
        content: string; // Used for excerpt
        coverImage?: string;
        createdAt: string | Date;
        views: number;
        user?: {
            username: string;
            avatar?: string;
        };
    };
    showAuthor?: boolean;
}

export default function PostCard({ post, showAuthor = false }: PostCardProps) {
    // Strip HTML tags for clean excerpt
    const excerpt = post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

    return (
        <Link href={`/p/${post.id}`} className="block group h-full">
            <article className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                {post.coverImage ? (
                    <div className="relative w-full aspect-video overflow-hidden">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                        <span className="text-4xl">📄</span>
                    </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                    {showAuthor && post.user && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                                {post.user.avatar ? (
                                    <Image src={post.user.avatar} alt={post.user.username} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                                )}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {post.user.username}
                            </span>
                        </div>
                    )}

                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-violet-600 transition-colors">
                        {post.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.views}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
