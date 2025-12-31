import mongoose from 'mongoose';

declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

export interface IUser {
    _id: string;
    email: string;
    password: string;
    username: string;
    bio?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPost {
    _id: string;
    title: string;
    content: string;
    coverImage?: string;
    isDraft: boolean;
    views: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        bio?: string;
        avatar?: string;
    };
    token?: string;
}
