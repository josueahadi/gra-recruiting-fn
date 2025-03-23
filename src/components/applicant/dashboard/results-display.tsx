import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

interface SectionResult {
	section: string;
	sectionTitle: string;
	sectionDescription?: string;
	score: number | null;
	completed: boolean;
}

interface ResultsDisplayProps {
	sectionResults: SectionResult[];
	assessmentCompleted?: boolean;
	detailedResultsPath?: string;
	className?: string;
}

/**
 * Component to display assessment results
 */
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
	sectionResults,
	assessmentCompleted = false,
	detailedResultsPath = "/applicant/results",
	className,
}) => {
	const router = useRouter();

	// SVG circle calculations
	const radius = 70;
	const circumference = 2 * Math.PI * radius;

	const handleViewDetailsClick = () => {
		router.push(detailedResultsPath);
	};

	return (
		<div className={cn("bg-white rounded-lg p-8 w-full", className)}>
			<h2 className="text-3xl font-bold mb-12">Assessment Results</h2>

			<div className="flex flex-wrap">
				{sectionResults.map((result, index) => (
					<div
						key={`section-${result.section}-${index}`}
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
							<div className="flex flex-col items-center justify-center bg-amber-50 py-8 px-4 rounded-lg w-full max-w-sm">
								<TriangleAlert className="w-12 h-12 text-[#F59E0B]" />
								<p className="text-xl text-center mt-4 text-gray-700">
									{sectionResults.some((item) => item.completed)
										? `Come back later for ${result.sectionTitle} score`
										: `Complete ${result.sectionTitle} first`}
								</p>
							</div>
						)}

						<h3 className="text-xl mt-4">
							{result.sectionTitle} -{" "}
							{result.sectionDescription ||
								(result.section === "one" ? "Multiple Choice" : "Short Essay")}
						</h3>

						{!result.completed && (
							<p className="text-center mt-2 text-gray-500">
								{result.section === "one"
									? "Not yet completed"
									: "Results pending"}
							</p>
						)}
					</div>
				))}
			</div>

			{assessmentCompleted && (
				<div className="mt-8 text-center">
					<Button
						className="bg-primary-base hover:bg-primary-base flex items-center mx-auto px-6 py-4 text-base font-semibold"
						onClick={handleViewDetailsClick}
					>
						View Detailed Results
						<MoveRight className="w-6 h-6 ml-2" />
					</Button>
				</div>
			)}
		</div>
	);
};

export default ResultsDisplay;
