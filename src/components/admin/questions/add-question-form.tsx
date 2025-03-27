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
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextEditor from "./text-editor";
import ChoiceInputs from "./choice-inputs";
import { useState } from "react";

// Define form schema based on question requirements
const formSchema = z.object({
	type: z.string(),
	question: z.string().min(1, "Question is required"),
	// Other fields will be added conditionally
});

export type QuestionFormValues = z.infer<typeof formSchema>;

interface AddQuestionFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: QuestionFormValues) => void;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
	isOpen,
	onClose,
	onSubmit,
}) => {
	const [questionType, setQuestionType] = useState<string>("multiple-choice");

	const form = useForm<QuestionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "multiple-choice",
			question: "",
		},
	});

	const handleSubmit = (values: QuestionFormValues) => {
		onSubmit(values);
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Add New Question</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question Type</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											setQuestionType(value);
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
											<SelectItem value="problem-solving">
												Problem Solving
											</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="question"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<TextEditor value={field.value} onChange={field.onChange} />
								</FormItem>
							)}
						/>

						{questionType === "multiple-choice" && (
							<ChoiceInputs control={form.control} />
						)}

						<div className="flex justify-end space-x-2">
							<Button variant="outline" onClick={onClose} type="button">
								Cancel
							</Button>
							<Button type="submit">Save Question</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddQuestionForm;
