"use client";

import { useState } from "react";
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
import { uploadFileToFirebase } from "@/lib/upload-file";

type Choice = {
	id: string;
	text: string;
	isCorrect: boolean;
	imageUrl: string | undefined;
};

interface FieldErrors {
	career?: string;
	questionType?: string;
	questionText?: string;
	questionImageUrl?: string;
	choices?: {
		[id: string]: {
			text?: string;
			imageUrl?: string;
		};
	};
}

interface BackendError {
	response?: {
		data?: {
			errors?: Record<string, string[]>;
		};
	};
	message?: string;
}

type BackendErrorField =
	| keyof FieldErrors
	| `options.${number}.${"text" | "imageUrl"}`;

export default function AddQuestionPage() {
	const router = useRouter();
	const {
		addQuestion,
		questionSections,
		getQuestionSectionLabel,
		// uploadQuestionImage,
		// uploadOptionImage,
	} = useQuestions();
	const { data: careers, isLoading: isLoadingCareers } = useCareers();
	const [isPublishing, setIsPublishing] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	const [questionType, setQuestionType] =
		useState<QuestionSection>("GENERAL_QUESTIONS");
	const [questionText, setQuestionText] = useState("");
	const [questionImageUrl, setQuestionImageUrl] = useState<string>("");
	const [selectedCareer, setSelectedCareer] = useState<CareerResponse | null>(
		null,
	);

	const [choices, setChoices] = useState<Choice[]>([
		{ id: "1", text: "", isCorrect: true, imageUrl: "" },
		{ id: "2", text: "", isCorrect: false, imageUrl: "" },
		{ id: "3", text: "", isCorrect: false, imageUrl: "" },
		{ id: "4", text: "", isCorrect: false, imageUrl: "" },
	]);

	const validateFields = (): boolean => {
		const errors: FieldErrors = {};
		let isValid = true;

		// Validate career selection
		if (!selectedCareer) {
			errors.career = "Please select a career";
			isValid = false;
		}

		// Validate question type
		if (!questionType) {
			errors.questionType = "Please select a question type";
			isValid = false;
		}

		// Validate question text
		if (!questionText.trim()) {
			errors.questionText = "Please enter a question";
			isValid = false;
		}

		// Validate question image URL if provided
		if (questionImageUrl.trim() && !isValidImageUrl(questionImageUrl)) {
			errors.questionImageUrl = "Please enter a valid image URL";
			isValid = false;
		}

		// Validate choices for multiple choice questions
		if (questionType !== "GENERAL_QUESTIONS") {
			const choiceErrors: FieldErrors["choices"] = {};
			let hasValidChoice = false;

			choices.forEach((choice) => {
				const choiceError: { text?: string; imageUrl?: string } = {};

				// Check if choice has either text or image
				if (!choice.text.trim() && !choice.imageUrl?.trim()) {
					choiceError.text = "Choice must have either text or image";
					isValid = false;
				}

				// Validate image URL if provided
				if (choice.imageUrl?.trim() && !isValidImageUrl(choice.imageUrl)) {
					choiceError.imageUrl = "Please enter a valid image URL";
					isValid = false;
				}

				if (choice.text.trim() || choice.imageUrl?.trim()) {
					hasValidChoice = true;
				}

				if (Object.keys(choiceError).length > 0) {
					choiceErrors[choice.id] = choiceError;
				}
			});

			if (!hasValidChoice) {
				errors.choices = {
					"1": { text: "At least one choice must be provided" },
				};
				isValid = false;
			} else if (Object.keys(choiceErrors).length > 0) {
				errors.choices = choiceErrors;
			}
		}

		setFieldErrors(errors);
		return isValid;
	};

	const isValidImageUrl = (url: string): boolean => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleChoiceChange = (id: string, value: string) => {
		setChoices(
			choices.map((choice) =>
				choice.id === id ? { ...choice, text: value } : choice,
			),
		);
		// Clear error for this choice when user makes changes
		if (fieldErrors.choices?.[id]) {
			setFieldErrors({
				...fieldErrors,
				choices: {
					...fieldErrors.choices,
					[id]: { ...fieldErrors.choices[id], text: undefined },
				},
			});
		}
	};

	const handleCorrectAnswerChange = (id: string) => {
		setChoices(
			choices.map((choice) => ({
				...choice,
				isCorrect: choice.id === id,
			})),
		);
	};

	const handleQuestionImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const path = `questions/${Date.now()}-${file.name}`;
			const url = await uploadFileToFirebase(file, path);
			setQuestionImageUrl(url);
		} catch {
			toast.error("Failed to upload question image");
		}
	};

	const handleChoiceImageUpload = async (
		id: string,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const path = `choices/${Date.now()}-${file.name}`;
			const url = await uploadFileToFirebase(file, path);
			setChoices(
				choices.map((c) => (c.id === id ? { ...c, imageUrl: url } : c)),
			);
		} catch {
			toast.error("Failed to upload choice image");
		}
	};

	const handlePublish = async () => {
		if (!validateFields()) {
			toast.error("Please fix the errors before publishing");
			return;
		}

		if (!selectedCareer) {
			toast.error("Please select a career");
			return;
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
					...(questionImageUrl.trim() && { imageUrl: questionImageUrl.trim() }),
					options: [],
				};
			} else {
				questionData = {
					section: questionType,
					careerId: selectedCareer.id,
					description: questionText,
					...(questionImageUrl.trim() && { imageUrl: questionImageUrl.trim() }),
					options: choices
						.filter(
							(choice) =>
								choice.text.trim() !== "" || choice.imageUrl?.trim() !== "",
						)
						.map((choice) => ({
							optionText: choice.text.trim(),
							...(choice.imageUrl?.trim() && {
								optionImageUrl: choice.imageUrl.trim(),
							}),
							isCorrectAnswer: choice.isCorrect,
						})),
				};
			}

			await addQuestion(questionData);
			toast.success("Question published successfully");
			router.push("/admin/questions");
		} catch (error: unknown) {
			const backendError = error as BackendError;
			// Handle backend validation errors
			if (backendError.response?.data?.errors) {
				const backendErrors = backendError.response.data.errors;
				const newFieldErrors: FieldErrors = {};

				// Map backend errors to field errors
				Object.entries(backendErrors).forEach(([field, messages]) => {
					const typedField = field as BackendErrorField;
					if (typedField.startsWith("options.")) {
						const [, index, subfield] = typedField.split(".");
						if (!newFieldErrors.choices) {
							newFieldErrors.choices = {};
						}
						const choiceIndex = Number.parseInt(index, 10);
						if (!newFieldErrors.choices[choices[choiceIndex].id]) {
							newFieldErrors.choices[choices[choiceIndex].id] = {};
						}
						const subfieldType = subfield as "text" | "imageUrl";
						newFieldErrors.choices[choices[choiceIndex].id][subfieldType] =
							messages[0];
					} else {
						const fieldKey = typedField as keyof Omit<FieldErrors, "choices">;
						newFieldErrors[fieldKey] = messages[0];
					}
				});

				setFieldErrors(newFieldErrors);
			} else {
				toast.error(backendError.message || "Failed to publish question");
			}
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
									if (fieldErrors.career) {
										setFieldErrors({ ...fieldErrors, career: undefined });
									}
								}}
							>
								<SelectTrigger
									className={`w-full border-gray-300 ${fieldErrors.career ? "border-red-500" : ""}`}
								>
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
							{fieldErrors.career && (
								<p className="text-red-500 text-sm mt-1">
									{fieldErrors.career}
								</p>
							)}
						</div>

						<div>
							<Label className="block text-base font-semibold text-black mb-2">
								Question Type
							</Label>
							<Select
								value={questionType}
								onValueChange={(value) => {
									setQuestionType(value as QuestionSection);
									if (fieldErrors.questionType) {
										setFieldErrors({ ...fieldErrors, questionType: undefined });
									}
								}}
							>
								<SelectTrigger
									className={`w-full border-gray-300 ${fieldErrors.questionType ? "border-red-500" : ""}`}
								>
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
							{fieldErrors.questionType && (
								<p className="text-red-500 text-sm mt-1">
									{fieldErrors.questionType}
								</p>
							)}
						</div>

						<div>
							<Label className="block text-base font-semibold text-black mb-2">
								Question
							</Label>

							<div
								className={
									fieldErrors.questionText
										? "border border-red-500 rounded-md"
										: ""
								}
							>
								<TextEditor
									value={questionText}
									onChange={(value) => {
										setQuestionText(value);
										if (fieldErrors.questionText) {
											setFieldErrors({
												...fieldErrors,
												questionText: undefined,
											});
										}
									}}
									placeholder="Enter your question here..."
									minHeight="200px"
									enableImageUpload={true}
								/>
							</div>
							{fieldErrors.questionText && (
								<p className="text-red-500 text-sm mt-1">
									{fieldErrors.questionText}
								</p>
							)}

							<div className="mt-4">
								<Label className="block text-sm font-medium text-gray-700 mb-2">
									Question Image (Optional)
								</Label>
								<input
									type="file"
									accept="image/*"
									onChange={handleQuestionImageUpload}
									className="w-full"
								/>
								{questionImageUrl && (
									<img
										src={questionImageUrl}
										alt="Question"
										className="mt-2 max-h-32"
									/>
								)}
							</div>
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
										<div
											className={
												fieldErrors.choices?.[choice.id]?.text
													? "border border-red-500 rounded-md"
													: ""
											}
										>
											<TextEditor
												value={choice.text}
												onChange={(value) =>
													handleChoiceChange(choice.id, value)
												}
												placeholder={`Enter choice ${index + 1} here...`}
												minHeight="100px"
												enableImageUpload={true}
											/>
										</div>
										{fieldErrors.choices?.[choice.id]?.text && (
											<p className="text-red-500 text-sm mt-1">
												{fieldErrors.choices[choice.id].text}
											</p>
										)}
										<div className="mt-2">
											<Label className="block text-sm font-medium text-gray-700 mb-2">
												Choice Image (Optional)
											</Label>
											<input
												type="file"
												accept="image/*"
												onChange={(e) => handleChoiceImageUpload(choice.id, e)}
												className="w-full"
											/>
											{choice.imageUrl && (
												<img
													src={choice.imageUrl}
													alt={`Choice ${index + 1}`}
													className="mt-2 max-h-24"
												/>
											)}
										</div>
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
