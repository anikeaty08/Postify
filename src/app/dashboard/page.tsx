"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import { useRouter } from 'next/navigation';

interface Post {
    id: string;
    title: string;
    content: string;
    coverImage?: string;
    isDraft: boolean;
    views: number;
    createdAt: string;
    userId: string;
}

export default function DashboardPage() {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        async function fetchPosts() {
            if (!user) return;

            try {
                const res = await fetch(`/api/posts?userId=${user.id}`);
                const data = await res.json();

                if (data.success) {
                    setPosts(data.data.posts);
                }
            } catch (error) {
                console.error('Failed to fetch posts', error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchPosts();
        }
    }, [user]);

    if (authLoading || (!posts.length && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const publishedPosts = posts.filter(p => !p.isDraft);
    const draftPosts = posts.filter(p => p.isDraft);

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-500">Manage your stories and check your stats</p>
                </div>

                <div className="flex gap-4">
                    <Link
                        href="/dashboard/settings"
                        className="btn btn-secondary"
                    >
                        Edit Profile
                    </Link>
                    <Link
                        href="/dashboard/posts/new"
                        className="btn btn-primary"
                    >
                        Write New Story
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatsCard label="Total Views" value={posts.reduce((acc, curr) => acc + curr.views, 0).toString()} icon="👀" />
                <StatsCard label="Published Stories" value={publishedPosts.length.toString()} icon="📝" />
                <StatsCard label="Drafts" value={draftPosts.length.toString()} icon="📄" />
            </div>

            {/* Tabs / Sections */}
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Published Stories
                        <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {publishedPosts.length}
                        </span>
                    </h2>
                    {publishedPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {publishedPosts.map(post => (
                                <div key={post.id} className="relative group">
                                    <PostCard post={post} />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <Link
                                            href={`/dashboard/posts/${post.id}/edit`}
                                            className="p-2 bg-white dark:bg-black rounded-full shadow-lg hover:text-violet-600 transition-colors"
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-gray-500 mb-4">You haven't published any stories yet.</p>
                            <Link href="/dashboard/posts/new" className="text-violet-600 hover:underline font-medium">Start writing your first post</Link>
                        </div>
                    )}
                </section>

                {draftPosts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            Drafts
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                {draftPosts.length}
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {draftPosts.map(post => (
                                <div key={post.id} className="relative group">
                                    <PostCard post={post} />
                                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                                        DRAFT
                                    </div>
                                    <div className="absolute top-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/dashboard/posts/${post.id}/edit`}
                                            className="p-2 bg-white dark:bg-black rounded-full shadow-lg hover:text-violet-600 transition-colors block"
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

function StatsCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">{label}</span>
                <span className="text-2xl">{icon}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        </div>
    );
}
