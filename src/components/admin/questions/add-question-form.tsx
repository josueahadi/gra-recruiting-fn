"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextEditor from "./text-editor"; // Import the Tiptap editor
import ChoiceInputs from "./choice-inputs";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define form schema with more validation
const formSchema = z.object({
	type: z.string({
		required_error: "Please select a question type",
	}),
	section: z.string().default("Multiple Choice"),
	difficulty: z.string().default("Medium"),
	question: z.string().min(1, "Question text is required"),
	excerpt: z
		.string()
		.max(100, "Excerpt should be less than 100 characters")
		.optional(),
	choices: z
		.array(
			z.object({
				id: z.string().optional(),
				text: z.string().min(1, "Choice text is required"),
				isCorrect: z.boolean().default(false),
			}),
		)
		.optional(),
	correctAnswer: z.string().optional(),
	maxScore: z.number().min(1).max(100).default(10).optional(),
	active: z.boolean().default(true),
	imageUrl: z.string().optional(),
});

export type QuestionFormValues = z.infer<typeof formSchema>;

interface AddQuestionFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: QuestionFormValues) => void;
	initialData?: Partial<QuestionFormValues>;
	isEditing?: boolean;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	isEditing = false,
}) => {
	const [activeTab, setActiveTab] = useState<string>("basic");

	// Initialize form with default values or provided initial data
	const form = useForm<QuestionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: initialData?.type || "multiple-choice",
			section: initialData?.section || "Multiple Choice",
			difficulty: initialData?.difficulty || "Medium",
			question: initialData?.question || "",
			excerpt: initialData?.excerpt || "",
			choices: initialData?.choices || [
				{ id: "1", text: "", isCorrect: true },
				{ id: "2", text: "", isCorrect: false },
				{ id: "3", text: "", isCorrect: false },
				{ id: "4", text: "", isCorrect: false },
			],
			correctAnswer: initialData?.correctAnswer || "0",
			maxScore: initialData?.maxScore || 10,
			active: initialData?.active !== undefined ? initialData.active : true,
			imageUrl: initialData?.imageUrl || "",
		},
	});

	// Watch for type changes to dynamically update form
	const questionType = form.watch("type");

	const handleSubmit = (values: QuestionFormValues) => {
		// Generate excerpt from question text if not provided
		if (!values.excerpt) {
			// Strip HTML tags for the excerpt
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = values.question;
			const textContent = tempDiv.textContent || tempDiv.innerText || "";
			values.excerpt =
				textContent.substring(0, 97) + (textContent.length > 97 ? "..." : "");
		}

		onSubmit(values);
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Question" : "Add New Question"}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<Tabs
							defaultValue="basic"
							value={activeTab}
							onValueChange={setActiveTab}
						>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="basic">Basic Information</TabsTrigger>
								<TabsTrigger value="content">
									{questionType === "essay"
										? "Essay Settings"
										: "Answer Choices"}
								</TabsTrigger>
							</TabsList>

							<TabsContent value="basic" className="space-y-4 pt-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Question Type</FormLabel>
												<Select
													onValueChange={(value) => {
														field.onChange(value);
														// Reset choices if changing to essay
														if (value === "essay") {
															form.setValue("choices", undefined);
															form.setValue("section", "Essay");
														} else {
															// Add default choices if changing to multiple choice
															if (!form.getValues("choices")) {
																form.setValue("choices", [
																	{ id: "1", text: "", isCorrect: true },
																	{ id: "2", text: "", isCorrect: false },
																	{ id: "3", text: "", isCorrect: false },
																	{ id: "4", text: "", isCorrect: false },
																]);
															}
															form.setValue("section", "Multiple Choice");
														}
													}}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select question type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="multiple-choice">
															Multiple Choice
														</SelectItem>
														<SelectItem value="essay">Essay</SelectItem>
														<SelectItem value="Problem Solving">
															Problem Solving
														</SelectItem>
														<SelectItem value="Computer Skills">
															Computer Skills
														</SelectItem>
														<SelectItem value="Math">Math</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="difficulty"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Difficulty Level</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select difficulty" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Easy">Easy</SelectItem>
														<SelectItem value="Medium">Medium</SelectItem>
														<SelectItem value="Hard">Hard</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="question"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Question Text</FormLabel>
											<FormControl>
												<TextEditor
													value={field.value}
													onChange={field.onChange}
													minHeight="200px"
													placeholder="Enter your question here..."
												/>
											</FormControl>
											<FormDescription>
												You can use formatting tools to enhance your question.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="excerpt"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Question Excerpt</FormLabel>
											<FormControl>
												<Input
													placeholder="Brief summary of the question (for display in lists)"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												This will be shown in the question list. If left empty,
												it will be generated from the question text.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Question Image URL (Optional)</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter image URL if needed"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Optional image to display with the question
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="active"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
											<div className="space-y-0.5">
												<FormLabel>Active Status</FormLabel>
												<FormDescription>
													Enable this question to be included in assessments
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>

							<TabsContent value="content" className="space-y-4 pt-4">
								{questionType === "essay" ? (
									<FormField
										control={form.control}
										name="maxScore"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Maximum Score</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="1"
														max="100"
														value={field.value}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
													/>
												</FormControl>
												<FormDescription>
													The maximum points that can be awarded for this essay
													question.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								) : (
									<ChoiceInputs control={form.control} />
								)}
							</TabsContent>
						</Tabs>

						<div className="flex justify-end space-x-2 pt-4">
							<Button variant="outline" onClick={onClose} type="button">
								Cancel
							</Button>
							<Button type="submit">
								{isEditing ? "Update Question" : "Save Question"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddQuestionForm;
