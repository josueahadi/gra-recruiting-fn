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
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Link as LinkIcon,
	Image as ImageIcon,
	List,
	ListOrdered,
	Heading1,
	Heading2,
	Heading3,
	ChevronDown,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ToolbarButton = ({
	onClick,
	isActive = false,
	disabled = false,
	children,
	title,
}: {
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
	title?: string;
}) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		title={title}
		className={cn(
			"p-2 rounded hover:bg-gray-200 transition-colors",
			isActive && "bg-gray-200 text-primary-base",
			disabled && "opacity-50 cursor-not-allowed",
		)}
	>
		{children}
	</button>
);

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
	const fileInputRef = useRef<HTMLInputElement>(null);

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
		return <div className="h-52 w-full bg-gray-50 animate-pulse rounded-md" />;
	}

	const toggleBold = () => editor.chain().focus().toggleBold().run();
	const toggleItalic = () => editor.chain().focus().toggleItalic().run();
	const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
	const toggleBulletList = () =>
		editor.chain().focus().toggleBulletList().run();
	const toggleOrderedList = () =>
		editor.chain().focus().toggleOrderedList().run();

	const toggleH1 = () =>
		editor.chain().focus().toggleHeading({ level: 1 }).run();
	const toggleH2 = () =>
		editor.chain().focus().toggleHeading({ level: 2 }).run();
	const toggleH3 = () =>
		editor.chain().focus().toggleHeading({ level: 3 }).run();

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

	const handleImageUpload = () => {
		fileInputRef.current?.click();
	};

	const processImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			if (!event.target) return;
			const imageUrl = event.target.result as string;
			editor.chain().focus().setImage({ src: imageUrl }).run();

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
			{!readOnly && (
				<div className="bg-gray-50 p-2 border-b flex flex-wrap items-center gap-1">
					<ToolbarButton
						onClick={toggleBold}
						isActive={editor.isActive("bold")}
						title="Bold"
					>
						<Bold className="h-4 w-4" />
					</ToolbarButton>

					<ToolbarButton
						onClick={toggleItalic}
						isActive={editor.isActive("italic")}
						title="Italic"
					>
						<Italic className="h-4 w-4" />
					</ToolbarButton>

					<ToolbarButton
						onClick={toggleUnderline}
						isActive={editor.isActive("underline")}
						title="Underline"
					>
						<UnderlineIcon className="h-4 w-4" />
					</ToolbarButton>

					<span className="mx-1 h-6 w-px bg-gray-300" />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className={cn(
									"flex items-center p-2 rounded hover:bg-gray-200 transition-colors",
									(editor.isActive("heading", { level: 1 }) ||
										editor.isActive("heading", { level: 2 }) ||
										editor.isActive("heading", { level: 3 })) &&
										"bg-gray-200 text-[#4A90B9]",
								)}
							>
								{editor.isActive("heading", { level: 1 }) && (
									<Heading1 className="h-4 w-4 mr-1" />
								)}
								{editor.isActive("heading", { level: 2 }) && (
									<Heading2 className="h-4 w-4 mr-1" />
								)}
								{editor.isActive("heading", { level: 3 }) && (
									<Heading3 className="h-4 w-4 mr-1" />
								)}
								{!editor.isActive("heading") && (
									<span className="mr-1">Normal</span>
								)}
								<ChevronDown className="h-3 w-3" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem
								onClick={() => editor.chain().focus().setParagraph().run()}
							>
								Normal
							</DropdownMenuItem>
							<DropdownMenuItem onClick={toggleH1}>
								<Heading1 className="h-4 w-4 mr-2" /> Heading 1
							</DropdownMenuItem>
							<DropdownMenuItem onClick={toggleH2}>
								<Heading2 className="h-4 w-4 mr-2" /> Heading 2
							</DropdownMenuItem>
							<DropdownMenuItem onClick={toggleH3}>
								<Heading3 className="h-4 w-4 mr-2" /> Heading 3
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<span className="mx-1 h-6 w-px bg-gray-300" />

					<ToolbarButton
						onClick={toggleBulletList}
						isActive={editor.isActive("bulletList")}
						title="Bullet List"
					>
						<List className="h-4 w-4" />
					</ToolbarButton>

					<ToolbarButton
						onClick={toggleOrderedList}
						isActive={editor.isActive("orderedList")}
						title="Numbered List"
					>
						<ListOrdered className="h-4 w-4" />
					</ToolbarButton>

					<span className="mx-1 h-6 w-px bg-gray-300" />

					<ToolbarButton
						onClick={addLink}
						isActive={editor.isActive("link")}
						title="Add Link"
					>
						<LinkIcon className="h-4 w-4" />
					</ToolbarButton>

					{enableImageUpload && (
						<ToolbarButton onClick={handleImageUpload} title="Add Image">
							<ImageIcon className="h-4 w-4" />
						</ToolbarButton>
					)}
				</div>
			)}

			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				accept="image/*"
				onChange={processImageFile}
			/>

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

        .ProseMirror h1 {
          font-size: 1.75em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
      `}</style>
		</div>
	);
};

export default TextEditor;
