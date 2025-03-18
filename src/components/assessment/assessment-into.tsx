"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface AssessmentIntroProps {
	userName?: string;
	date?: string;
	startTime?: string;
	onStartExam: () => void;
}

/**
 * Component to display assessment introduction and instructions
 */
const AssessmentIntro: React.FC<AssessmentIntroProps> = ({
	userName = "John Doe",
	date = "27, March, 2026",
	startTime = "12:00 Pm",
	onStartExam,
}) => {
	return (
		<div className="py-8 px-4 md:p-12">
			<div className="text-center mb-12">
				<h1 className="text-3xl md:text-5xl font-bold mb-2">
					Grow Rwanda Recruitment Assessment
				</h1>
				<div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-2 mt-6 text-lg">
					<span>{userName}</span>
					<span>Date: {date}</span>
					<span>Started Time: {startTime}</span>
				</div>
			</div>

			<div className="max-w-3xl mx-auto text-center my-12">
				<p className="text-lg leading-relaxed">
					The Grow Rwanda Recruitment Assessment Is Designed To Evaluate
					Candidates Based On Their Knowledge And Reasoning Skills.
				</p>

				<h2 className="text-xl font-semibold my-8">
					The Exam Consists Of 2 Sections
				</h2>

				<div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
					<Card className="bg-[#4A90B9] text-white p-6 flex-1 shadow-md">
						<h3 className="text-xl font-medium mb-2">Section 1</h3>
						<p className="text-lg mb-4">Multiple Choice</p>
						<div className="flex justify-around">
							<div className="flex items-center">
								<div className="bg-yellow-400 rounded-full p-2 mr-2">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="h-5 w-5"
										stroke="currentColor"
									>
										<title>Timer</title>
										<circle cx="12" cy="12" r="7.5" strokeWidth="1.5" />
										<path
											d="M12 8v4l2.5 2.5"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</div>
								<span>20mins</span>
							</div>
							<div className="flex items-center">
								<div className="bg-yellow-400 rounded-full p-2 mr-2">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="h-5 w-5"
										stroke="currentColor"
									>
										<title>Timer</title>
										<circle cx="12" cy="12" r="9" strokeWidth="1.5" />
										<path
											d="M12 7v5h5"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span>20 Questions</span>
							</div>
						</div>
					</Card>

					<Card className="bg-[#4A90B9] text-white p-6 flex-1 shadow-md">
						<h3 className="text-xl font-medium mb-2">Section 2</h3>
						<p className="text-lg mb-4">Short Essay</p>
						<div className="flex justify-around">
							<div className="flex items-center">
								<div className="bg-yellow-400 rounded-full p-2 mr-2">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="h-5 w-5"
										stroke="currentColor"
									>
										<title>Timer</title>
										<circle cx="12" cy="12" r="7.5" strokeWidth="1.5" />
										<path
											d="M12 8v4l2.5 2.5"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</div>
								<span>10mins</span>
							</div>
							<div className="flex items-center">
								<div className="bg-yellow-400 rounded-full p-2 mr-2">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="h-5 w-5"
										stroke="currentColor"
									>
										<title>Timer</title>
										<circle cx="12" cy="12" r="9" strokeWidth="1.5" />
										<path
											d="M12 7v5h5"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span>5 Questions</span>
							</div>
						</div>
					</Card>
				</div>

				<Button
					onClick={onStartExam}
					className="bg-[#4A90B9] hover:bg-[#3A80A9] text-white py-6 px-12 text-lg rounded-full w-full md:w-auto"
				>
					Start Exam
				</Button>

				<div className="mt-10 bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start text-left">
					<AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
					<div>
						<p className="text-sm text-amber-800">
							Once A Section Begins, Candidates Cannot Go Back To Previous
							Questions.
							<br />
							The System Will Automatically Submit All Answers When Time Runs
							Out
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssessmentIntro;
