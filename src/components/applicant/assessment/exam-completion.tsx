import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";

interface ExamCompletionProps {
	title?: string;
	message?: string;
	subtitle?: string;
	buttonText?: string;
	onButtonClick?: () => void;
	imageUrl?: string;
}

/**
 * Component displayed when an exam is completed
 */
const ExamCompletion: React.FC<ExamCompletionProps> = ({
	title = "Exam Completed",
	message = "You have successfully completed the exam. Thank you for your time and effort.",
	subtitle = "Your results will be available soon",
	buttonText = "Back To Dashboard",
	onButtonClick,
	imageUrl = "/images/exam-complete.png",
}) => {
	const router = useRouter();

	const handleButtonClick = () => {
		if (onButtonClick) {
			onButtonClick();
		} else {
			router.push("/applicant/dashboard");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center text-center py-16 px-4">
			<Image
				src={imageUrl}
				alt="Exam Completed"
				width={400}
				height={300}
				className="mb-8"
			/>

			<div className="max-w-xl mx-auto">
				<h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>

				{message.split("\n").map((line, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<p key={i} className="text-lg mb-2">
						{line}
					</p>
				))}

				<p className="text-primary-base mt-6 mb-8 font-medium">{subtitle}</p>

				<Button
					onClick={handleButtonClick}
					className="bg-primary-base hover:bg-primary-base text-white flex items-center mx-auto px-8 py-5 rounded-lg"
				>
					{buttonText}
					<MoveRight className="ml-2" size={16} />
				</Button>
			</div>
		</div>
	);
};

export default ExamCompletion;
