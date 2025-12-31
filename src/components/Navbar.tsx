"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
            <div className="container h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Postify
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/explore"
                        className={`text-sm font-medium transition-colors hover:text-violet-600 ${isActive('/explore') ? 'text-violet-600' : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        Explore
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                className={`text-sm font-medium transition-colors hover:text-violet-600 ${isActive('/dashboard') ? 'text-violet-600' : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={`/${user?.username}`}
                                className={`text-sm font-medium transition-colors hover:text-violet-600 ${pathname === `/${user?.username}` ? 'text-violet-600' : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                My Blog
                            </Link>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.username}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-violet-600 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20"
                            >
                                Sign up
                            </Link>
                        </>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-lg animate-fadeIn">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/explore"
                            className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explore
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={`/${user?.username}`}
                                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Blog
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 bg-violet-600 text-white rounded-lg text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
                        >
                            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
