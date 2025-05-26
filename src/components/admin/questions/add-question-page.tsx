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
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft } from "lucide-react";
import { useQuestions } from "@/hooks/use-questions";
import { useCareers } from "@/hooks";
import type { QuestionSection, AddQuestionReqDto } from "@/types/questions";
import type { CareerResponse } from "@/types/profile";

export default function AddQuestionPage() {
	const router = useRouter();
	const { addQuestion, questionSections, getQuestionSectionLabel } =
		useQuestions();
	const { data: careers, isLoading: isLoadingCareers } = useCareers();
	const [isPublishing, setIsPublishing] = useState(false);

	const [questionType, setQuestionType] =
		useState<QuestionSection>("GENERAL_QUESTIONS");
	const [questionText, setQuestionText] = useState("");
	const [selectedCareer, setSelectedCareer] = useState<CareerResponse | null>(
		null,
	);

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
			toast.error("Please enter a question text");
			return;
		}

		if (!selectedCareer) {
			toast.error("Please select a career");
			return;
		}

		if (questionType !== "GENERAL_QUESTIONS") {
			const hasChoices = choices.some((choice) => choice.text.trim() !== "");
			if (!hasChoices) {
				toast.error("Please add at least one answer choice");
				return;
			}
		}

		setIsPublishing(true);

		try {
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = questionText;

			let questionData: AddQuestionReqDto;

			if (questionType === "GENERAL_QUESTIONS") {
				questionData = {
					section: questionType,
					careerId: selectedCareer.id,
					description: questionText,
					options: [], // Essay questions don't need options
				};
			} else {
				questionData = {
					section: questionType,
					careerId: selectedCareer.id,
					description: questionText,
					options: choices.map((choice) => ({
						optionText: choice.text,
						isCorrectAnswer: choice.isCorrect,
					})),
				};
			}

			await addQuestion(questionData);

			toast.success("Question published successfully");

			router.push("/admin/questions");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred";
			toast.error(`Failed to publish question: ${errorMessage}`);
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
								Career
							</Label>
							<Select
								value={selectedCareer?.id.toString()}
								onValueChange={(value) => {
									const career = careers?.find(
										(c) => c.id.toString() === value,
									);
									setSelectedCareer(career || null);
								}}
							>
								<SelectTrigger className="w-full border-gray-300">
									<SelectValue placeholder="Select a career" />
								</SelectTrigger>
								<SelectContent>
									{isLoadingCareers ? (
										<SelectItem value="loading" disabled>
											Loading careers...
										</SelectItem>
									) : (
										careers?.map((career) => (
											<SelectItem key={career.id} value={career.id.toString()}>
												{career.name}
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="block text-base font-semibold text-black mb-2">
								Question Type
							</Label>
							<Select
								value={questionType}
								onValueChange={(value) =>
									setQuestionType(value as QuestionSection)
								}
							>
								<SelectTrigger className="w-full border-gray-300">
									<SelectValue placeholder="Select question type" />
								</SelectTrigger>
								<SelectContent>
									{questionSections.map((section) => (
										<SelectItem key={section} value={section}>
											{getQuestionSectionLabel(section)}
										</SelectItem>
									))}
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

						{questionType !== "GENERAL_QUESTIONS" && (
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
