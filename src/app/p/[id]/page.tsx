import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Metadata } from 'next';

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        const res = await fetch(`${baseUrl}/api/posts/${id}`, { cache: 'no-store' });
        const data = await res.json();
        if (!data.success) return { title: 'Post Not Found - Postify' };

        return {
            title: `${data.data.post.title} - Postify`,
            description: data.data.post.content.replace(/<[^>]+>/g, '').substring(0, 160),
        };
    } catch (e) {
        return { title: 'Postify' };
    }
}

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let post;
    let author;

    try {
        const res = await fetch(`${baseUrl}/api/posts/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) notFound();
            throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        post = data.data.post;

        // Fetch author details (since the post object only has userId, typically we'd populate it on backend but 
        // my API structure separates them or I need to fetch user separately? 
        // Wait, my Get Single Post API doesn't populate User. 
        // I should probably fix the API to populate user or fetch it here.
        // Let's fetch the user based on post.userId. 
        // Wait, I don't have a generic "get user by ID" public API, only "get user by username".
        // I should probably update the Get Single Post API to populate the user or at least include username.
        // For now, I'll update the API route to populate the user. 
        // BUT since I am in "building pages" mode, I can also just fetch the user if I find a way.
        // Actually, let's fix the API route `src/app/api/posts/[id]/route.ts` to populate the user!
        // It is much cleaner.

        // However, I can't interrupt this write_to_file easily to do that without a separate tool call.
        // I will write this file assuming the API *will* return user data, and then I will go fix the API.
        // Or I can just write it to handle missing user for now and fix it in the next step.

        // Let's look at `src/app/api/posts/[id]/route.ts`. It does `Post.findById(id).lean()`. It doesn't populate.
        // I will write this file to expect `post.user` and then I will immediately update the API route.

        // Actually, I can use a second fetch if I really wanted to, but fixing the API is better.
        // I'll assume I'll fix the API to return `user` object inside `post` or alongside it.
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <article className="min-h-screen bg-white dark:bg-black pb-20">
            {/* Cover Image */}
            {post.coverImage && (
                <div className="relative w-full h-[40vh] md:h-[60vh]">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                </div>
            )}

            <div className="container max-w-3xl -mt-20 relative z-10 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
                    <header className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href={`/`} className="text-sm font-medium text-violet-600 hover:underline">
                                ← Back to Home
                            </Link>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <span className="text-sm text-gray-500">
                                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                            </span>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {post.views} views
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Author Check - Temporary fallback until API is updated */}
                        {/* If API is not updated yet, this part might define user as undefined */}
                        {/* I will fix the API right after this */}
                    </header>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-violet-600 hover:prose-a:text-violet-500"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>
        </article>
    );
}
