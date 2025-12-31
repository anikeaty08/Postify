"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ImageUploader from '@/components/ImageUploader';

export default function SettingsPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bio,
                    avatar,
                }),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            // Refresh user context to show new avatar/bio immediately
            await refreshUser();

            alert('Profile updated successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
                    <p className="text-gray-500">Customize how you appear on Postify</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="btn btn-ghost"
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">

                {/* Avatar */}
                <div className="space-y-4">
                    <label className="label">Profile Picture</label>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 relative flex-shrink-0">
                            {avatar ? (
                                <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-4xl text-white font-bold">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-grow w-full">
                            <ImageUploader
                                endpoint="avatarUploader"
                                onChange={setAvatar}
                                className="bg-gray-50 dark:bg-black/50"
                            />
                            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, max 4MB.</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>

                {/* Username (Read only) */}
                <div>
                    <label className="label">Username</label>
                    <input
                        type="text"
                        value={user?.username}
                        disabled
                        className="input opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username determines your public URL and cannot be changed.</p>
                </div>

                {/* Email (Read only) */}
                <div>
                    <label className="label">Email Address</label>
                    <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="input opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="label">Bio</label>
                    <textarea
                        className="input textarea"
                        placeholder="Tell the world a little bit about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={500}
                    ></textarea>
                    <div className="flex justify-end mt-1">
                        <span className={`text-xs ${bio.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                            {bio.length}/500
                        </span>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full md:w-auto"
                    >
                        {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </div>

            </form>
        </div>
    );
}
