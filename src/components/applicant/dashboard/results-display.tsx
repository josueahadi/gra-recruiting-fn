import React from "react";
import { cn } from "@/lib/utils";

interface SectionResult {
	sectionTitle: string;
	sectionDescription: string;
	score: number | null;
	completed: boolean;
}

interface ResultsDisplayProps {
	sectionResults: SectionResult[];
	className?: string;
}

/**
 * Component to display assessment results
 */
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
	sectionResults,
	className,
}) => {
	// SVG circle calculations
	const radius = 70;
	const circumference = 2 * Math.PI * radius;

	return (
		<div className={cn("bg-white rounded-lg p-8 w-full", className)}>
			<h2 className="text-3xl font-bold mb-12">Score</h2>

			<div className="flex flex-wrap">
				{sectionResults.map((result, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="w-full md:w-1/2 flex flex-col items-center mb-8 md:mb-0"
					>
						{result.completed ? (
							/* Completed section with score */
							<div className="relative w-40 h-40">
								<svg className="w-full h-full" viewBox="0 0 160 160">
									<title>Section Score</title>
									<circle
										cx="80"
										cy="80"
										r={radius}
										fill="none"
										stroke="#F3F4F6"
										strokeWidth="12"
									/>
									{result.score !== null && (
										<circle
											cx="80"
											cy="80"
											r={radius}
											fill="none"
											stroke={
												result.score >= 70
													? "#10B981"
													: result.score >= 50
														? "#F59E0B"
														: "#EF4444"
											}
											strokeWidth="12"
											strokeDasharray={circumference}
											strokeDashoffset={
												circumference - (result.score / 100) * circumference
											}
											transform="rotate(-90 80 80)"
											strokeLinecap="round"
										/>
									)}
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<span
										className="text-4xl font-bold"
										style={{
											color:
												result.score >= 70
													? "#10B981"
													: result.score >= 50
														? "#F59E0B"
														: "#EF4444",
										}}
									>
										{result.score}%
									</span>
								</div>
							</div>
						) : (
							/* Not completed section */
							<div className="flex flex-col items-center justify-center bg-amber-50 py-8 rounded-lg w-full max-w-xs h-40">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 text-amber-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Waiting Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
									/>
								</svg>
							</div>
						)}

						<h3 className="text-xl mt-4">
							Section {result.sectionTitle} - {result.sectionDescription}
						</h3>

						{!result.completed && (
							<p className="text-center mt-2 text-amber-700">
								Come back later for Section {result.sectionTitle} score
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default ResultsDisplay;
