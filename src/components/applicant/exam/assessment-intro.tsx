import type React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";

interface SectionInfo {
	title: string;
	description: string;
	timeInMinutes: number;
	questionCount: number;
}

interface AssessmentIntroProps {
	title?: string;
	description?: string;
	sections?: SectionInfo[];
	warningText?: string[];
	buttonText?: string;
	onStartExam?: () => void;
}

/**
 * Assessment introduction component that displays exam information
 * and allows users to start the exam
 */
const AssessmentIntro: React.FC<AssessmentIntroProps> = ({
	title = "GROW RWANDA RECRUITMENT ASSESSMENT",
	description = "The Grow Rwanda Recruitment Assessment is designed to evaluate candidates based on their knowledge and reasoning skills. The exam consists of two sections:",
	sections = [
		{
			title: "section 1",
			description: "Multiple Choice",
			timeInMinutes: 20,
			questionCount: 20,
		},
		{
			title: "section 2",
			description: "Short Essay",
			timeInMinutes: 10,
			questionCount: 5,
		},
	],
	warningText = [
		"Once a section begins, candidates cannot go back to previous questions.",
		"The system will automatically submit all answers when time runs out.",
	],
	buttonText = "Start Exam",
	onStartExam,
}) => {
	const router = useRouter();

	const handleStartExam = () => {
		if (onStartExam) {
			onStartExam();
		} else {
			router.push("/applicant/exam/section/1");
		}
	};

	return (
		<div className="w-full flex flex-col items-center">
			<h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
				{title}
			</h1>

			<p className="mb-8 max-w-2xl mx-auto text-center">{description}</p>

			<h2 className="text-xl font-medium mb-6 text-center">
				The exam Consists Of {sections.length} Sections
			</h2>

			<div className="flex flex-col md:flex-row gap-6 mb-10 w-full max-w-3xl">
				{sections.map((section, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="bg-gradient-to-tr from-primary-dark to-primary-base text-white p-6 flex-1 rounded-xl shadow-md"
					>
						<h3 className="text-xl font-medium mb-2">{section.title}</h3>
						<p className="text-lg mb-4">{section.description}</p>
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
								<span>{section.timeInMinutes}mins</span>
							</div>
							<div className="flex items-center">
								<div className="bg-yellow-400 rounded-full p-2 mr-2">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="h-5 w-5"
										stroke="currentColor"
									>
										<title>Questions</title>
										<circle cx="12" cy="12" r="9" strokeWidth="1.5" />
										<path
											d="M12 7v5h5"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span>{section.questionCount} questions</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<Button
				onClick={handleStartExam}
				className="bg-primary-base hover:bg-primary-dark text-white py-4 px-8 text-lg rounded-md w-full max-w-lg flex items-center justify-center"
			>
				{buttonText}
				<MoveRight className="w-6 h-6 ml-2" />
			</Button>

			{warningText && warningText.length > 0 && (
				<div className="mt-10 bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start text-left max-w-3xl">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-amber-500 mr-3 mt-1 flex-shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Warning</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
						/>
					</svg>
					<div>
						{warningText.map((text, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<p key={index} className="text-sm text-amber-800 mb-1">
								{text}
							</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default AssessmentIntro;
