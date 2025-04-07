"use client";

import React, { useState, useRef } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/admin/questions/text-editor";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function AddQuestionPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [questionType, setQuestionType] = useState<string>("Essay");
	const [isPublishing, setIsPublishing] = useState(false);

	// State for the question text and choices
	const [questionText, setQuestionText] = useState("");
	const [choices, setChoices] = useState([
		{ id: 1, text: "", isCorrect: true },
		{ id: 2, text: "", isCorrect: false },
		{ id: 3, text: "", isCorrect: false },
		{ id: 4, text: "", isCorrect: false },
	]);

	// File upload related refs
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChoiceChange = (id: number, value: string) => {
		setChoices(
			choices.map((choice) =>
				choice.id === id ? { ...choice, text: value } : choice,
			),
		);
	};

	const handlePublish = async () => {
		// Validate inputs
		if (!questionText.trim()) {
			toast({
				title: "Missing information",
				description: "Please enter a question text",
				variant: "destructive",
			});
			return;
		}

		if (questionType !== "Essay") {
			// For multiple choice questions, ensure at least one choice is entered
			const hasChoices = choices.some((choice) => choice.text.trim() !== "");
			if (!hasChoices) {
				toast({
					title: "Missing information",
					description: "Please add at least one answer choice",
					variant: "destructive",
				});
				return;
			}
		}

		setIsPublishing(true);

		try {
			// In a real implementation, this would be an API call
			// await addQuestion({ type: questionType, text: questionText, choices });

			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: "Success",
				description: "Question published successfully",
			});

			// Redirect to questions list
			router.push("/admin/questions");
		} catch (error) {
			toast({
				title: "Error",
				description: `Failed to publish question: ${error}. Please try again.`,
				variant: "destructive",
			});
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<AppLayout userType="admin">
			<div className="w-full max-w-6xl mx-auto">
				<div className="bg-white rounded-lg p-6 shadow-sm">
					<div className="flex justify-between items-center mb-8">
						<h1 className="text-2xl font-semibold text-primary-base">
							Add Question
						</h1>
						<Button
							onClick={handlePublish}
							disabled={isPublishing}
							className="bg-primary-base hover:bg-custom-skyBlue text-white text-base font-semibold rounded-md px-6 h-10 shadow-sm transition duration-200 ease-in-out"
						>
							{isPublishing ? "Publishing..." : "Publish"}
							<Upload className="!h-5 !w-5" />
						</Button>
					</div>

					<div className="space-y-6">
						{/* Question Type Selection */}
						<div>
							<Label className="block text-base font-semibold text-black mb-2">
								Question Type
							</Label>
							<Select
								value={questionType}
								onValueChange={(value) => setQuestionType(value)}
							>
								<SelectTrigger className="w-full border-gray-300">
									<SelectValue placeholder="Select question type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Essay">Essay</SelectItem>
									<SelectItem value="Problem Solving">
										Problem Solving
									</SelectItem>
									<SelectItem value="Multiple Choice">
										Multiple Choice
									</SelectItem>
									<SelectItem value="Computer Skills">
										Computer Skills
									</SelectItem>
									<SelectItem value="Math">Math</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Question Content */}
						<div>
							<Label className="block text-base font-semibold text-black mb-2">
								Question
							</Label>

							<TextEditor
								value={questionText}
								onChange={setQuestionText}
								placeholder="Enter your question here..."
								minHeight="200px"
								enableImageUpload={true}
							/>
						</div>

						{/* Answer Choices - Only show for non-essay question types */}
						{questionType !== "Essay" && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{choices.map((choice, index) => (
									<div key={choice.id}>
										<Label className="block text-base font-semibold text-black mb-2">
											Choice {index + 1}
										</Label>
										<TextEditor
											value={choice.text}
											onChange={(value) => handleChoiceChange(choice.id, value)}
											placeholder={`Enter choice ${index + 1} here...`}
											minHeight="100px"
											enableImageUpload={true}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Hidden file input for image uploads */}
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				accept="image/*"
				onChange={() => {}} // Will be handled by the TextEditor component
			/>
		</AppLayout>
	);
}
