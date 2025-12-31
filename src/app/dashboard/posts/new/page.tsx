"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import ImageUploader from '@/components/ImageUploader';

export default function NewPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isDraft, setIsDraft] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setLoading(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    coverImage,
                    isDraft,
                }),
            });

            if (!res.ok) throw new Error('Failed to create post');

            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to publish post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-4xl py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Write a Story</h1>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => { setIsDraft(true); handleSubmit(e); }}
                        disabled={loading || !title || !content}
                        className="btn btn-secondary"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={(e) => { setIsDraft(false); handleSubmit(e); }}
                        disabled={loading || !title || !content}
                        className="btn btn-primary"
                    >
                        {loading ? 'Publishing...' : 'Publish'}
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
                    autoFocus
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
