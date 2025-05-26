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
import { useResults } from "@/hooks/use-results";
import type { TestResult } from "@/types/questions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type React from "react";
import { useState } from "react";

interface ResultGradingProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: {
		applicantId: string;
		essays: Array<{
			id: string;
			score: number;
			feedback: string;
		}>;
		finalScore: number;
		status: string;
		overallFeedback?: string;
	}) => void;
	applicant: TestResult;
}

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
	const { triggerAIGrading } = useResults();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			essays: [],
			finalScore: 0,
			status: "success",
			overallFeedback: "",
		},
	});

	const handleAutoGrade = async () => {
		setIsAutoGrading(true);
		try {
			const result = await triggerAIGrading.mutateAsync(applicant.id);
			form.setValue("finalScore", result.score || 0);
			form.setValue("status", result.status);
			form.setValue("overallFeedback", result.feedback || "");
		} catch (error) {
			console.error("Error during auto-grading:", error);
		} finally {
			setIsAutoGrading(false);
		}
	};

	const handleSubmitForm = (values: z.infer<typeof formSchema>) => {
		onSubmit({
			applicantId: applicant.id,
			...values,
		});
	};

	const essayQuestions = applicant.questions.filter((q) => q.type === "essay");

	const multipleChoiceQuestions = applicant.questions.filter(
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
