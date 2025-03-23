import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";

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
	message = "You have successfully completed the exam.\nThank you for your time and effort.",
	subtitle = "Your results will be available soon",
	buttonText = "Back To Dashboard",
	onButtonClick,
	imageUrl = "/images/exam-complete.svg",
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
					<p key={i} className="text-lg mb-2">
						{line}
					</p>
				))}

				<p className="text-[#4A90B9] mt-6 mb-8">{subtitle}</p>

				<Button
					onClick={handleButtonClick}
					className="bg-[#4A90B9] hover:bg-[#3A80A9] text-white flex items-center mx-auto px-8 py-2 rounded-md"
				>
					{buttonText}
					<MoveRight className="ml-2" size={16} />
				</Button>
			</div>
		</div>
	);
};

export default ExamCompletion;
