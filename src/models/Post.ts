import mongoose, { Schema, Model } from 'mongoose';
import type { IPost } from '@/types';

const PostSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [1, 'Title cannot be empty'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        coverImage: {
            type: String,
            default: '',
        },
        isDraft: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
        userId: {
            type: String,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for better query performance
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ isDraft: 1, createdAt: -1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
