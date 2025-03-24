import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";

interface ProfileBlockMessageProps {
	title?: string;
	buttonText?: string;
	showImage?: boolean;
	className?: string;
}

/**
 * A reusable component that displays a message to complete profile
 * Used both in dashboard and when trying to access the exam before profile completion
 */
const ProfileBlockMessage: React.FC<ProfileBlockMessageProps> = ({
	title = "First complete your profile to unlock the assessment",
	buttonText = "Complete Your Profile",
	showImage = true,
	className = "",
}) => {
	const router = useRouter();

	const handleCompleteProfileClick = () => {
		router.push("/applicant");
	};

	return (
		<div
			className={`bg-white rounded-lg p-8 flex flex-col items-center justify-center text-center ${className}`}
		>
			{showImage && (
				<Image
					src="/images/profile-checklist.svg"
					alt="Complete Profile"
					className="mb-6"
					width={207}
					height={126}
				/>
			)}

			<h3 className="text-lg font-semibold mb-4 md:text-xl">
				{title || "First complete your profile to unlock the assessment"}
			</h3>

			<Button
				className="mt-4 bg-primary-base hover:bg-primary-base flex items-center p-6 text-base font-semibold"
				onClick={handleCompleteProfileClick}
			>
				{buttonText}
				<MoveRight className="w-6 h-6 ml-2" />
			</Button>
		</div>
	);
};

export default ProfileBlockMessage;
