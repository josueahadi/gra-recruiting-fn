"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Trash2 } from "lucide-react";
import type React from "react";

interface Choice {
	text: string;
	isCorrect: boolean;
}

interface QuestionDetailProps {
	isOpen: boolean;
	onClose: () => void;
	question: {
		id: string;
		text: string;
		type: string;
		section: string;
		choices?: Choice[];
	} | null;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
	isOpen,
	onClose,
	question,
	onEdit,
	onDelete,
}) => {
	if (!question) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Question Detail</span>
						<Badge variant="outline" className="ml-2">
							{question.type}
						</Badge>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<div>
						<h3 className="text-sm font-medium text-gray-500 mb-1">
							Question ID
						</h3>
						<p className="text-lg">{question.id}</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 mb-1">Question</h3>
						<div className="p-4 bg-gray-50 rounded-md">
							<p className="whitespace-pre-wrap">{question.text}</p>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 mb-1">Section</h3>
						<p>{question.section}</p>
					</div>

					{question.choices && question.choices.length > 0 && (
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Choices
							</h3>
							<div className="space-y-2">
								{question.choices.map((choice, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={index}
										className={`p-3 rounded-md ${
											choice.isCorrect
												? "bg-green-50 border border-green-200"
												: "bg-gray-50"
										}`}
									>
										<div className="flex items-start">
											<div
												className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
													choice.isCorrect
														? "bg-green-500 text-white"
														: "bg-gray-200"
												}`}
											>
												{String.fromCharCode(65 + index)}
											</div>
											<p className="flex-1">{choice.text}</p>
											{choice.isCorrect && (
												<Badge className="bg-green-500">Correct</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex justify-end space-x-2">
						<Button
							variant="outline"
							onClick={() => onEdit(question.id)}
							className="flex items-center"
						>
							<FileEdit className="h-4 w-4 mr-2" />
							Edit
						</Button>
						<Button
							variant="destructive"
							onClick={() => onDelete(question.id)}
							className="flex items-center"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default QuestionDetail;
