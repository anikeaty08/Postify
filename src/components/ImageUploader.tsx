"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import { useState } from "react";

interface ImageUploaderProps {
    endpoint: keyof OurFileRouter;
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export default function ImageUploader({ endpoint, value, onChange, className = "" }: ImageUploaderProps) {
    const [isHovering, setIsHovering] = useState(false);

    if (value) {
        return (
            <div
                className={`relative aspect-video w-full rounded-lg overflow-hidden group ${className}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <Image src={value} alt="Uploaded image" fill className="object-cover" />

                {isHovering && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
                        <button
                            onClick={() => onChange("")}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            <UploadDropzone<OurFileRouter, typeof endpoint>
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                        onChange(res[0].url);
                    }
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                    container: {
                        border: '2px dashed var(--border)',
                        borderRadius: '0.5rem',
                        background: 'var(--surface)',
                    },
                    label: {
                        color: 'var(--muted)',
                    },
                    button: {
                        background: 'var(--primary-600)',
                        color: 'white',
                    },
                }}
            />
        </div>
    );
}
