import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(
            /^[a-z0-9_-]+$/,
            'Username can only contain lowercase letters, numbers, hyphens, and underscores'
        ),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

export const createPostSchema = z.object({
    title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(200, 'Title cannot exceed 200 characters'),
    content: z.string().min(1, 'Content cannot be empty'),
    coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
    isDraft: z.boolean().optional().default(false),
});

export const updatePostSchema = z.object({
    title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(200, 'Title cannot exceed 200 characters')
        .optional(),
    content: z.string().min(1, 'Content cannot be empty').optional(),
    coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
    isDraft: z.boolean().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
