import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getCurrentUser } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
    // Avatar uploader - for profile pictures
    avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const user = await getCurrentUser();
            if (!user) throw new Error("Unauthorized");
            return { userId: user.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Avatar upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId, url: file.url };
        }),

    // Cover image uploader - for post cover images
    coverImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(async () => {
            const user = await getCurrentUser();
            if (!user) throw new Error("Unauthorized");
            return { userId: user.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Cover image upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
