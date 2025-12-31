"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import ImageUploader from '@/components/ImageUploader';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isDraft, setIsDraft] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/${id}`);
                const data = await res.json();

                if (data.success) {
                    const { post } = data.data;
                    setTitle(post.title);
                    setContent(post.content);
                    setCoverImage(post.coverImage || '');
                    setIsDraft(post.isDraft);
                } else {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Failed to fetch post', error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent, draftStatus: boolean) => {
        e.preventDefault();
        if (!title || !content) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    coverImage,
                    isDraft: draftStatus,
                }),
            });

            if (!res.ok) throw new Error('Failed to update post');

            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to update post');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete post');
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to delete post');
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
    }

    return (
        <div className="container max-w-4xl py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Story</h1>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={saving}
                    >
                        Delete
                    </button>
                    <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 mx-2"></div>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn btn-ghost"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={saving || !title || !content}
                        className={`btn ${isDraft ? 'btn-secondary shadow-inner bg-gray-100 dark:bg-gray-800' : 'btn-ghost'}`}
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, false)}
                        disabled={saving || !title || !content}
                        className="btn btn-primary"
                    >
                        {saving ? 'Saving...' : 'Publish Changes'}
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Cover Image */}
                <div className="space-y-2">
                    <label className="label">Cover Image</label>
                    <ImageUploader
                        endpoint="coverImageUploader"
                        value={coverImage}
                        onChange={setCoverImage}
                        className="bg-gray-50 dark:bg-gray-900"
                    />
                </div>

                {/* Title */}
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Editor */}
                <PostEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Tell your story..."
                    className="min-h-[400px]"
                />
            </div>
        </div>
    );
}
