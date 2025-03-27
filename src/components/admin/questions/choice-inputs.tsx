"use client";

import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, type Control } from "react-hook-form";
import { QuestionFormValues } from "./add-question-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ChoiceInputsProps {
	control: Control<any>;
}

const ChoiceInputs: React.FC<ChoiceInputsProps> = ({ control }) => {
	// Use field array to manage dynamic inputs for choices
	const { fields, append, remove } = useFieldArray({
		control,
		name: "choices",
	});

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<FormLabel className="text-base">Answer Choices</FormLabel>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => append({ text: "", isCorrect: false })}
					className="h-8"
				>
					<PlusCircle className="h-4 w-4 mr-2" />
					Add Choice
				</Button>
			</div>

			<FormField
				control={control}
				name="correctAnswer"
				render={({ field }) => (
					<RadioGroup
						onValueChange={field.onChange}
						defaultValue={field.value}
						className="space-y-4"
					>
						{fields.map((item, index) => (
							<div
								key={item.id}
								className="flex items-start space-x-2 bg-gray-50 p-3 rounded-md"
							>
								<RadioGroupItem
									value={index.toString()}
									id={`choice-${index}`}
								/>

								<div className="flex-1 space-y-1">
									<FormField
										control={control}
										name={`choices.${index}.text`}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														placeholder={`Choice ${index + 1}`}
														className="border-gray-300"
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => remove(index)}
									className="text-red-500 hover:text-red-700 hover:bg-red-50"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
					</RadioGroup>
				)}
			/>

			{fields.length === 0 && (
				<div className="text-center p-4 border border-dashed border-gray-300 rounded-md">
					<p className="text-gray-500">Add at least one choice</p>
				</div>
			)}
		</div>
	);
};

export default ChoiceInputs;
