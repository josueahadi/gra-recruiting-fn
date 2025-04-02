"use client";

import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type React from "react";
import { type TestResult, MOCK_EXAM_DATA } from "@/hooks/use-results";

interface ResultDetailProps {
	isOpen: boolean;
	onClose: () => void;
	result: TestResult;
}

const ResultDetail: React.FC<ResultDetailProps> = ({
	isOpen,
	onClose,
	result,
}) => {
	// Use the exam data from the hook
	const examData = MOCK_EXAM_DATA;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Exam Result Detail</span>
						<Badge
							className={
								result.status === "success"
									? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
									: result.status === "fail"
										? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800hover:"
										: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
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

					{/* Show graded by information if available */}
					{result.gradedBy && (
						<div className="bg-gray-50 p-4 rounded-md">
							<div className="flex justify-between">
								<div>
									<h3 className="font-medium">Graded By</h3>
									<p className="text-gray-600">{result.gradedBy}</p>
								</div>
								{result.gradedAt && (
									<div className="text-right">
										<h3 className="font-medium">Graded On</h3>
										<p className="text-gray-600">{result.gradedAt}</p>
									</div>
								)}
							</div>
							{result.feedback && (
								<div className="mt-4">
									<h3 className="font-medium">Feedback</h3>
									<p className="mt-1 p-3 bg-white rounded border border-gray-200">
										{result.feedback}
									</p>
								</div>
							)}
						</div>
					)}

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
