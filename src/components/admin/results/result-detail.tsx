"use client";

import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type React from "react";
import type { TestResult } from "@/types/questions";

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
							{/* Replace with actual data source or remove if not needed */}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ResultDetail;
