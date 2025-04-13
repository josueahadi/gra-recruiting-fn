"use client";

import React, { useState } from "react";
import AppLayoutWrapper from "@/components/layout/app-layout-wrapper";
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
import { Upload, ArrowLeft } from "lucide-react";
import { useQuestions } from "@/hooks/use-questions";
// import type { Question } from "@/types";

export default function AddQuestionPage() {
	const router = useRouter();
	// const [formData, setFormData] = useState<Partial<Question>>({
	// 	text: "",
	// 	excerpt: "",
	// 	section: "Multiple Choice",
	// 	type: "multiple-choice",
	// });
	const { toast } = useToast();
	const { createQuestion } = useQuestions();
	const [isPublishing, setIsPublishing] = useState(false);

	const [questionType, setQuestionType] = useState<string>("Problem Solving");
	const [questionText, setQuestionText] = useState("");

	const [choices, setChoices] = useState([
		{ id: "1", text: "", isCorrect: true },
		{ id: "2", text: "", isCorrect: false },
		{ id: "3", text: "", isCorrect: false },
		{ id: "4", text: "", isCorrect: false },
	]);

	const handleChoiceChange = (id: string, value: string) => {
		setChoices(
			choices.map((choice) =>
				choice.id === id ? { ...choice, text: value } : choice,
			),
		);
	};

	const handleCorrectAnswerChange = (id: string) => {
		setChoices(
			choices.map((choice) => ({
				...choice,
				isCorrect: choice.id === id,
			})),
		);
	};

	const handlePublish = async () => {
		if (!questionText.trim()) {
			toast({
				title: "Missing information",
				description: "Please enter a question text",
				variant: "destructive",
			});
			return;
		}

		if (questionType !== "Essay") {
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
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = questionText;
			const textContent = tempDiv.textContent || tempDiv.innerText || "";
			const excerpt =
				textContent.substring(0, 97) + (textContent.length > 97 ? "..." : "");

			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let questionData;

			if (questionType === "Essay") {
				questionData = {
					type: "essay" as const,
					section: "Essay",
					text: questionText,
					excerpt,
					difficulty: "Medium",
					active: true,
					maxScore: 10,
				};
			} else {
				questionData = {
					type: questionType.toLowerCase().replace(/\s+/g, "-"),
					section: "Multiple Choice",
					text: questionText,
					excerpt,
					difficulty: "Medium",
					active: true,
					choices,
				};
			}

			await createQuestion.mutateAsync(questionData);

			toast({
				title: "Success",
				description: "Question published successfully",
			});

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
		<AppLayoutWrapper>
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
							<Upload className="h-5 w-5 ml-2" />
						</Button>
					</div>

					<div className="space-y-6">
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

						{questionType !== "Essay" && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{choices.map((choice, index) => (
									<div key={choice.id}>
										<div className="flex items-center mb-2">
											<input
												type="radio"
												id={`choice-${choice.id}`}
												name="correctAnswer"
												checked={choice.isCorrect}
												onChange={() => handleCorrectAnswerChange(choice.id)}
												className="mr-2"
											/>
											<Label
												htmlFor={`choice-${choice.id}`}
												className="text-base font-semibold text-black"
											>
												Choice {index + 1}{" "}
												{choice.isCorrect && "(Correct Answer)"}
											</Label>
										</div>
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

						<div className="mt-8 flex justify-start">
							<Button
								onClick={() => router.push("/admin/questions")}
								variant="outline"
								className="flex items-center"
							>
								<ArrowLeft className="h-5 w-5 mr-2" />
								Back to Questions
							</Button>
						</div>
					</div>
				</div>
			</div>
		</AppLayoutWrapper>
	);
}
