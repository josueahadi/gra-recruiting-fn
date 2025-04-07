"use client";

import type React from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

// Define a toolbar button component
const ToolbarButton = ({
	onClick,
	isActive = false,
	disabled = false,
	children,
}: {
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
}) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={cn(
			"p-2 rounded hover:bg-gray-200 transition-colors",
			isActive && "bg-gray-200 text-[#4A90B9]",
			disabled && "opacity-50 cursor-not-allowed",
		)}
	>
		{children}
	</button>
);

// Main text editor component
interface TextEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	placeholder?: string;
	minHeight?: string;
	readOnly?: boolean;
	enableImageUpload?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
	value,
	onChange,
	className,
	placeholder = "Enter your text...",
	minHeight = "200px",
	readOnly = false,
	enableImageUpload = false,
}) => {
	// Reference for file input
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Initialize the Tiptap editor
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link.configure({
				openOnClick: false,
				linkOnPaste: true,
			}),
			Image,
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value,
		editable: !readOnly,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) {
		return (
			<div className="h-52 w-full bg-gray-50 animate-pulse rounded-md"></div>
		);
	}

	// Helper functions for toolbar actions
	const toggleBold = () => editor.chain().focus().toggleBold().run();
	const toggleItalic = () => editor.chain().focus().toggleItalic().run();
	const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
	const toggleBulletList = () =>
		editor.chain().focus().toggleBulletList().run();
	const toggleOrderedList = () =>
		editor.chain().focus().toggleOrderedList().run();

	const addLink = () => {
		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL", previousUrl);

		if (url === null) {
			return;
		}

		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	};

	// Function to handle image upload
	const handleImageUpload = () => {
		fileInputRef.current?.click();
	};

	// Function to process the selected image file
	const processImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Create a preview URL for the image
		const reader = new FileReader();
		reader.onload = (event) => {
			if (!event.target) return;

			// In a real application, you would upload the file to a server here
			// and use the returned URL. For now, we're using the data URL.
			const imageUrl = event.target.result as string;
			editor.chain().focus().setImage({ src: imageUrl }).run();

			// Reset the file input so the same file can be selected again
			e.target.value = "";
		};
		reader.readAsDataURL(file);
	};

	return (
		<div
			className={cn(
				"editor-container border rounded-md overflow-hidden",
				className,
			)}
		>
			{/* Editor toolbar */}
			{!readOnly && (
				<div className="bg-gray-50 p-2 border-b flex flex-wrap items-center gap-1">
					<ToolbarButton
						onClick={toggleBold}
						isActive={editor.isActive("bold")}
					>
						<span className="font-bold">B</span>
					</ToolbarButton>

					<ToolbarButton
						onClick={toggleItalic}
						isActive={editor.isActive("italic")}
					>
						<span className="italic">I</span>
					</ToolbarButton>

					<ToolbarButton
						onClick={toggleUnderline}
						isActive={editor.isActive("underline")}
					>
						<span className="underline">U</span>
					</ToolbarButton>

					<ToolbarButton
						onClick={toggleBulletList}
						isActive={editor.isActive("bulletList")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>List</title>
							<line x1="8" y1="6" x2="21" y2="6"></line>
							<line x1="8" y1="12" x2="21" y2="12"></line>
							<line x1="8" y1="18" x2="21" y2="18"></line>
							<line x1="3" y1="6" x2="3.01" y2="6"></line>
							<line x1="3" y1="12" x2="3.01" y2="12"></line>
							<line x1="3" y1="18" x2="3.01" y2="18"></line>
						</svg>
					</ToolbarButton>

					<ToolbarButton onClick={addLink} isActive={editor.isActive("link")}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Link</title>
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
						</svg>
					</ToolbarButton>

					<ToolbarButton onClick={handleImageUpload}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Image</title>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<circle cx="8.5" cy="8.5" r="1.5"></circle>
							<polyline points="21 15 16 10 5 21"></polyline>
						</svg>
					</ToolbarButton>
				</div>
			)}

			{/* Hidden file input for image uploads */}
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				accept="image/*"
				onChange={processImageFile}
			/>

			{/* Editor content area */}
			<EditorContent
				editor={editor}
				className={cn(
					"prose prose-sm max-w-none",
					readOnly ? "pointer-events-none" : "",
				)}
				style={{
					minHeight,
				}}
			/>

			{/* Custom styling */}
			<style jsx global>{`
        .ProseMirror {
          padding: 1rem;
          min-height: ${minHeight};
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        
        .ProseMirror a {
          color: #4A90B9;
          text-decoration: underline;
        }
      `}</style>
		</div>
	);
};

export default TextEditor;
