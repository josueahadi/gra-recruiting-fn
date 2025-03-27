"use client";

import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ResultDetailProps {
	isOpen: boolean;
	onClose: () => void;
	result: any;
}

const ResultDetail: React.FC<ResultDetailProps> = ({
	isOpen,
	onClose,
	result,
}) => {
	// Mock exam questions and answers
	const examData = {
		questions: [
			{
				id: "q1",
				text: "What is the most important aspect of a well-structured resume?",
				type: "multiple-choice",
				applicantAnswer: "Clear formatting and organization",
				correctAnswer: "Clear formatting and organization",
				isCorrect: true,
			},
			{
				id: "q2",
				text: "Which of the following is NOT a recommended practice for technical interviews?",
				type: "multiple-choice",
				applicantAnswer: "Memorizing answers to common questions",
				correctAnswer: "Memorizing answers to common questions",
				isCorrect: true,
			},
			{
				id: "q3",
				text: "Explain the difference between synchronous and asynchronous programming.",
				type: "essay",
				applicantAnswer:
					"Synchronous programming executes tasks sequentially, blocking until each operation completes before moving to the next one. Asynchronous programming allows operations to be executed independently without blocking the main thread, enabling better performance and responsiveness in applications.",
				score: 9,
				maxScore: 10,
				feedback: "Excellent explanation with good practical context.",
			},
		],
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Exam Result Detail</span>
						<Badge
							className={
								result.status === "success"
									? "bg-green-100 text-green-800"
									: result.status === "fail"
										? "bg-red-100 text-red-800"
										: "bg-yellow-100 text-yellow-800"
							}
						>
							{result.status === "success"
								? "Success"
								: result.status === "fail"
									? "Failed"
									: "Waiting"}
						</Badge>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
						<div>
							<h3 className="font-medium text-lg">{result.applicantName}</h3>
							<p className="text-gray-500">{result.email}</p>
						</div>
						{result.score !== null && (
							<div className="text-center">
								<div className="text-2xl font-bold">{result.score}</div>
								<div className="text-sm text-gray-500">Score</div>
							</div>
						)}
					</div>

					<div>
						<h3 className="text-lg font-medium mb-3">Exam Responses</h3>
						<div className="space-y-4">
							{examData.questions.map((question) => (
								<div
									key={question.id}
									className="border border-gray-200 rounded-md overflow-hidden"
								>
									<div className="bg-gray-50 p-3 border-b border-gray-200">
										<div className="flex justify-between">
											<h4 className="font-medium">{question.text}</h4>
											<Badge variant="outline">{question.type}</Badge>
										</div>
									</div>
									<div className="p-4">
										<div className="mb-3">
											<h5 className="text-sm text-gray-500 mb-1">
												Applicant Answer
											</h5>
											<div className="p-3 bg-gray-50 rounded-md">
												<p className="whitespace-pre-wrap">
													{question.applicantAnswer}
												</p>
											</div>
										</div>

										{question.type === "multiple-choice" && (
											<div>
												<h5 className="text-sm text-gray-500 mb-1">
													Correct Answer
												</h5>
												<div className="p-3 bg-gray-50 rounded-md">
													<p>{question.correctAnswer}</p>
												</div>
											</div>
										)}

										{question.type === "essay" && (
											<div className="flex justify-between items-center">
												<div className="flex-1">
													<h5 className="text-sm text-gray-500 mb-1">
														Feedback
													</h5>
													<div className="p-3 bg-gray-50 rounded-md">
														<p>{question.feedback}</p>
													</div>
												</div>
												<div className="ml-4 text-center">
													<div className="text-xl font-bold">
														{question.score}/{question.maxScore}
													</div>
													<div className="text-xs text-gray-500">Score</div>
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ResultDetail;
