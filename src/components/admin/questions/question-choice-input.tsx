"use client";

import type React from "react";
import TextEditor from "./text-editor";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionChoiceInputProps {
	id: number;
	value: string;
	isCorrect: boolean;
	onChange: (value: string) => void;
	onSelectCorrect: () => void;
}

const QuestionChoiceInput: React.FC<QuestionChoiceInputProps> = ({
	id,
	value,
	isCorrect,
	onChange,
	onSelectCorrect,
}) => {
	// Convert number to letter (1 -> A, 2 -> B, etc.)
	const choiceLabel = String.fromCharCode(64 + id);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<div className="flex items-center space-x-2">
					<RadioGroupItem
						value={id.toString()}
						id={`choice-${id}`}
						checked={isCorrect}
						onClick={onSelectCorrect}
					/>
					<Label htmlFor={`choice-${id}`} className="font-medium">
						Choice {choiceLabel}
					</Label>
				</div>
			</div>

			<TextEditor
				value={value}
				onChange={onChange}
				placeholder={`Enter choice ${choiceLabel} here...`}
				minHeight="100px"
			/>
		</div>
	);
};

export default QuestionChoiceInput;
