import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';
import { Metadata } from 'next';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params;
    // In a real app, we would fetch the user here to get their bio/avatar for metadata
    return {
        title: `${username}'s Blog - Postify`,
        description: `Read the latest stories from ${username} on Postify.`,
    };
}

// Ensure the page is dynamic to fetch latest data
export const dynamic = 'force-dynamic';

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    // We need to fetch data from our API
    // Since we are on the server, we can't use relative URLs for fetch unless we configure a base URL
    // But strictly speaking, it's better to call the DB logic directly in Server Components
    // However, for consistency with the plan, I will use fetch with the absolute URL if possible, 
    // or better: I'll use the API logic but import it? No, that's messy with Next.js App Router rules sometimes.
    // I'll assume localhost for now or use the DB connection directly if I want to be cleaner.
    // Actually, for this implementation, calling the internal API is fine if I have the base URL.
    // But to avoid "localhost" hardcoding issues in different environments, using the DB directly is safer for Server Components.

    // Let's import the DB logic directly to avoid self-request HTTP issues during build/runtime
    // We need to import the models

    // Wait, I can just use the API endpoint logic here? 
    // Let's just fetch from the API using the NEXT_PUBLIC_APP_URL environment variable

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let data;
    try {
        const res = await fetch(`${baseUrl}/api/user/${username}/posts`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) notFound();
            throw new Error('Failed to fetch user data');
        }
        data = await res.json();
    } catch (error) {
        console.error(error);
        notFound();
    }

    const { user, posts } = data.data;

    return (
        <div className="container py-12">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mb-16 animate-fadeIn">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white dark:border-black shadow-xl ring-2 ring-violet-100 dark:ring-violet-900">
                    {user.avatar ? (
                        <Image src={user.avatar} alt={user.username} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-4xl text-white font-bold">
                            {user.username[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">@{user.username}</h1>
                {user.bio && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                        {user.bio}
                    </p>
                )}
            </div>

            {/* Posts List */}
            <div className="space-y-12">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold border-b-2 border-violet-500 pb-1">Latest Stories</h2>
                    <div className="flex-grow border-b border-gray-200 dark:border-gray-800"></div>
                </div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <PostCard key={post.id} post={{ ...post, user }} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                        <p className="text-xl text-gray-500">No stories published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
