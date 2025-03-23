import type React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CircleHelp, MoveRight, Timer, TriangleAlert } from "lucide-react";

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

			<div className="flex flex-col md:flex-row gap-6 mb-10 w-full max-w-2xl">
				{sections.map((section, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="bg-gradient-to-tr from-primary-dark to-custom-skyBlue text-white p-6 flex-1 rounded-xl shadow-md text-center"
					>
						<h3 className="text-2xl font-semibold mb-2 capitalize">
							{section.title}
						</h3>
						<p className="text-lg mb-4">{section.description}</p>
						<div className="flex justify-center gap-4 text-sm">
							<div className="flex items-center">
								<CircleHelp className="w-6 h-6 mr-2 text-accent-base" />
								<span>{section.questionCount} questions</span>
							</div>
							<div className="flex items-center ">
								<Timer className="w-6 h-6 mr-2 text-accent-base" />
								<span>{section.timeInMinutes}mins</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<Button
				onClick={handleStartExam}
				className="bg-primary-base hover:bg-primary-base text-white py-6 px-8 text-lg rounded-lg w-full max-w-xl flex items-center justify-center font-medium"
			>
				{buttonText}
				<MoveRight className="w-6 h-6 ml-2" />
			</Button>

			{warningText && warningText.length > 0 && (
				<div className="mt-10 bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start text-left max-w-3xl">
					<TriangleAlert className="w-6 h-6 text-accent-base mr-4" />
					<div>
						{warningText.map((text, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<p key={index} className="text-sm text-black mb-1">
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
