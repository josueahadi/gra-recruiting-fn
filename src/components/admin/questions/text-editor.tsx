"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";
import { useRef, useState } from "react";

interface TextEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	placeholder?: string;
	minRows?: number;
}

const TextEditor: React.FC<TextEditorProps> = ({
	value,
	onChange,
	className,
	placeholder = "Enter your text...",
	minRows = 4,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);

	const applyStyle = (style: string) => {
		if (!textareaRef.current) return;

		const textarea = textareaRef.current;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = value.substring(start, end);

		let prefix = "";
		let suffix = "";

		switch (style) {
			case "bold":
				prefix = "**";
				suffix = "**";
				setIsBold(!isBold);
				break;
			case "italic":
				prefix = "_";
				suffix = "_";
				setIsItalic(!isItalic);
				break;
			case "underline":
				prefix = "__";
				suffix = "__";
				setIsUnderline(!isUnderline);
				break;
		}

		const newText =
			value.substring(0, start) +
			prefix +
			selectedText +
			suffix +
			value.substring(end);

		onChange(newText);

		// Set cursor position after the inserted text
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(start + prefix.length, end + prefix.length);
		}, 0);
	};

	const handleLink = () => {
		if (!textareaRef.current) return;

		const textarea = textareaRef.current;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = value.substring(start, end);

		const linkText = selectedText || "link text";
		const linkUrl = "https://example.com";

		const newText = `${value.substring(0, start)}[${linkText}](${linkUrl})${value.substring(end)}`;

		onChange(newText);
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => applyStyle("bold")}
					className={cn(isBold && "bg-gray-200")}
				>
					<span className="font-bold">B</span>
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => applyStyle("italic")}
					className={cn(isItalic && "bg-gray-200")}
				>
					<span className="italic">I</span>
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => applyStyle("underline")}
					className={cn(isUnderline && "bg-gray-200")}
				>
					<span className="underline">U</span>
				</Button>
				<Button type="button" variant="ghost" size="icon" onClick={handleLink}>
					<span className="underline text-blue-500">L</span>
				</Button>
			</div>

			<textarea
				ref={textareaRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={cn(
					"w-full min-h-[100px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-base",
					className,
				)}
				placeholder={placeholder}
				rows={minRows}
			/>
		</div>
	);
};

export default TextEditor;
