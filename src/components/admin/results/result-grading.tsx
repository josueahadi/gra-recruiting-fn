/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type React from "react";
import { useState } from "react";

interface ResultGradingProps {
	isOpen: boolean;
	onClose: () => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onSubmit: (values: any) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	applicant: any;
}

const MOCK_EXAM_DATA = {
	questions: [
		{
			id: "q1",
			text: "What is the most important aspect of a well-structured resume?",
			type: "multiple-choice",
			applicantAnswer: "Clear formatting and organization",
			correctAnswer: "Clear formatting and organization",
			options: [
				"Clear formatting and organization",
				"Including all past jobs",
				"Using advanced vocabulary",
				"Adding personal hobbies",
			],
		},
		{
			id: "q2",
			text: "Which of the following is NOT a recommended practice for technical interviews?",
			type: "multiple-choice",
			applicantAnswer: "Memorizing answers to common questions",
			correctAnswer: "Memorizing answers to common questions",
			options: [
				"Researching the company",
				"Practicing coding problems",
				"Memorizing answers to common questions",
				"Preparing questions for the interviewer",
			],
		},
		{
			id: "q3",
			text: "Explain the difference between synchronous and asynchronous programming.",
			type: "essay",
			applicantAnswer:
				"Synchronous programming executes tasks sequentially, blocking until each operation completes before moving to the next one. Asynchronous programming allows operations to be executed independently without blocking the main thread, enabling better performance and responsiveness in applications.",
			maxScore: 10,
		},
	],
};

const formSchema = z.object({
	essays: z.array(
		z.object({
			id: z.string(),
			score: z.number().min(0),
			feedback: z.string().min(1, "Feedback is required"),
		}),
	),
	finalScore: z.number().min(0).max(100),
	status: z.string(),
	overallFeedback: z.string().optional(),
});

const ResultGrading: React.FC<ResultGradingProps> = ({
	isOpen,
	onClose,
	onSubmit,
	applicant,
}) => {
	const [isAutoGrading, setIsAutoGrading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			essays: MOCK_EXAM_DATA.questions
				.filter((q) => q.type === "essay")
				.map((q) => ({
					id: q.id,
					score: 0,
					feedback: "",
				})),
			finalScore: 0,
			status: "success",
			overallFeedback: "",
		},
	});

	const handleAutoGrade = () => {
		setIsAutoGrading(true);

		setTimeout(() => {
			const aiGradedEssays = [
				{
					id: "q3",
					score: 9,
					feedback: "Excellent explanation with good practical context.",
				},
			];

			const multipleChoiceQuestions = MOCK_EXAM_DATA.questions.filter(
				(q) => q.type === "multiple-choice",
			);

			const multipleChoiceScore = multipleChoiceQuestions.reduce(
				(score, q) => score + (q.applicantAnswer === q.correctAnswer ? 1 : 0),
				0,
			);

			const essayScore = aiGradedEssays.reduce(
				(score, essay) => score + essay.score,
				0,
			);
			const totalPossibleScore = multipleChoiceQuestions.length + 10;
			const finalScore = Math.round(
				((multipleChoiceScore + essayScore) / totalPossibleScore) * 100,
			);

			form.setValue("essays", aiGradedEssays);
			form.setValue("finalScore", finalScore);
			form.setValue(
				"overallFeedback",
				"The applicant demonstrated good understanding of the concepts tested.",
			);

			setIsAutoGrading(false);
		}, 1500);
	};

	const handleSubmitForm = (values: z.infer<typeof formSchema>) => {
		onSubmit({
			applicantId: applicant.id,
			...values,
		});
	};

	const essayQuestions = MOCK_EXAM_DATA.questions.filter(
		(q) => q.type === "essay",
	);

	const multipleChoiceQuestions = MOCK_EXAM_DATA.questions.filter(
		(q) => q.type === "multiple-choice",
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Grade Exam - {applicant.applicantName}</span>
						<Button
							variant="outline"
							onClick={handleAutoGrade}
							disabled={isAutoGrading}
						>
							{isAutoGrading ? "Grading..." : "Auto-Grade with AI"}
						</Button>
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmitForm)}
						className="space-y-6"
					>
						{/* Multiple Choice Questions Section */}
						{multipleChoiceQuestions.length > 0 && (
							<div>
								<h3 className="text-lg font-medium mb-3">
									Multiple Choice Questions
								</h3>
								<div className="space-y-4">
									{multipleChoiceQuestions.map((question) => (
										<div
											key={question.id}
											className="border border-gray-200 rounded-md overflow-hidden"
										>
											<div className="bg-gray-50 p-3 border-b border-gray-200">
												<h4 className="font-medium">{question.text}</h4>
											</div>
											<div className="p-4">
												<div className="mb-3">
													<h5 className="text-sm text-gray-500 mb-1">
														Applicant Answer
													</h5>
													<div
														className={`p-3 rounded-md ${
															question.applicantAnswer ===
															question.correctAnswer
																? "bg-green-50 border border-green-200"
																: "bg-red-50 border border-red-200"
														}`}
													>
														<p>{question.applicantAnswer}</p>
													</div>
												</div>

												<div>
													<h5 className="text-sm text-gray-500 mb-1">
														Correct Answer
													</h5>
													<div className="p-3 bg-green-50 border border-green-200 rounded-md">
														<p>{question.correctAnswer}</p>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Essay Questions Section */}
						{essayQuestions.length > 0 && (
							<div>
								<h3 className="text-lg font-medium mb-3">Essay Questions</h3>
								<div className="space-y-6">
									{essayQuestions.map((question, index) => (
										<div
											key={question.id}
											className="border border-gray-200 rounded-md overflow-hidden"
										>
											<div className="bg-gray-50 p-3 border-b border-gray-200">
												<h4 className="font-medium">{question.text}</h4>
											</div>
											<div className="p-4">
												<div className="mb-4">
													<h5 className="text-sm text-gray-500 mb-1">
														Applicant Answer
													</h5>
													<div className="p-3 bg-gray-50 rounded-md">
														<p className="whitespace-pre-wrap">
															{question.applicantAnswer}
														</p>
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="md:col-span-2">
														<FormField
															control={form.control}
															name={`essays.${index}.feedback`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Feedback</FormLabel>
																	<FormControl>
																		<Textarea
																			{...field}
																			placeholder="Provide feedback on the answer..."
																			rows={4}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>

													<div>
														<FormField
															control={form.control}
															name={`essays.${index}.score`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Score (0-{question.maxScore})
																	</FormLabel>
																	<div className="flex items-center space-x-2">
																		<Slider
																			value={[field.value]}
																			max={question.maxScore}
																			step={1}
																			onValueChange={(value) =>
																				field.onChange(value[0])
																			}
																		/>
																		<span className="w-12 text-center font-medium">
																			{field.value}
																		</span>
																	</div>
																</FormItem>
															)}
														/>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Final Score and Overall Feedback */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
							<div className="md:col-span-2">
								<FormField
									control={form.control}
									name="overallFeedback"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Overall Feedback</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder="Provide overall feedback on the exam..."
													rows={4}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<div>
								<FormField
									control={form.control}
									name="finalScore"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Final Score (0-100)</FormLabel>
											<div className="flex items-center space-x-2">
												<Slider
													value={[field.value]}
													max={100}
													step={1}
													onValueChange={(value) => field.onChange(value[0])}
												/>
												<span className="w-12 text-center font-medium">
													{field.value}
												</span>
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem className="mt-4">
											<FormLabel>Final Status</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="success">Success</SelectItem>
													<SelectItem value="fail">Fail</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							</div>
						</div>

						<DialogFooter>
							<Button variant="outline" type="button" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit">Submit Grades</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ResultGrading;
