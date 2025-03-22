import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface WelcomeBannerProps {
	userName: string;
	buttonText: string;
	buttonLink: string;
	imageUrl?: string;
	onButtonClick?: () => void;
	className?: string;
}

/**
 * A banner component that welcomes the user and provides a call-to-action
 */
const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
	userName = "John Doe",
	buttonText = "Complete Your Profile",
	buttonLink = "/applicant",
	imageUrl = "/images/complete-profile.png",
	onButtonClick,
	className,
}) => {
	const router = useRouter();

	const handleButtonClick = () => {
		if (onButtonClick) {
			onButtonClick();
		} else {
			router.push(buttonLink);
		}
	};

	return (
		<div
			className={`bg-gradient-to-tr from-primary-dark to-custom-skyBlue rounded-lg text-white relative z-10 overflow-hidden p-6 ${className}`}
		>
			{/* Background pattern */}
			<div
				className="absolute inset-0 z-0 opacity-100 pointer-events-none"
				style={{
					backgroundImage: "url('/images/growrwanda-pattern-01.svg')",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
				}}
			/>

			<div className="flex flex-col md:flex-row items-center">
				{/* Image */}
				<Image
					src={imageUrl}
					alt="Welcome"
					width={332}
					height={300}
					className="z-10"
				/>

				{/* Text and button */}
				<div className="relative z-10 py-6 flex flex-col items-center text-center md:items-start md:text-left">
					<h2 className="text-lg">Hi, {userName}</h2>
					<h1 className="text-3xl font-semibold mt-2 mb-6">
						Welcome To Your
						<br />
						Applicant Dashboard
					</h1>

					<Button
						variant="default"
						className="bg-white text-custom-skyBlue hover:bg-gray-100 flex items-center font-semibold"
						onClick={handleButtonClick}
					>
						{buttonText}
						<MoveRight className="w-6 h-6 ml-2" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default WelcomeBanner;
