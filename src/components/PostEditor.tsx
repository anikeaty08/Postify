"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

interface PostEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function PostEditor({ value, onChange, placeholder, className }: PostEditorProps) {
    // Dynamically import ReactQuill to avoid SSR issues (document is not defined)
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'clean'],
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link', 'image'
    ];

    return (
        <div className={`rich-text-editor ${className}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg overflow-hidden"
            />
            <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: var(--surface);
          border-color: var(--border) !important;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-family: inherit !important;
          font-size: 1.1em !important;
          min-height: 200px;
          border-color: var(--border) !important;
        }
        .ql-editor.ql-blank::before {
          color: var(--muted) !important;
          font-style: normal !important;
        }
      `}</style>
        </div>
    );
}
