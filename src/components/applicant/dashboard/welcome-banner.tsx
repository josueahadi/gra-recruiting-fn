import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";

interface WelcomeBannerProps {
	userName?: string;
	primaryButtonText: string;
	primaryButtonLink?: string;
	showSecondaryButton?: boolean;
	secondaryButtonText?: string;
	imageUrl?: string;
	onPrimaryButtonClick?: () => void;
	onSecondaryButtonClick?: () => void;
	className?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
	userName = "John Doe",
	primaryButtonText = "Complete Your Profile",
	primaryButtonLink = "/applicant",
	showSecondaryButton = false,
	secondaryButtonText = "View Results",
	imageUrl = "/images/complete-profile.png",
	onPrimaryButtonClick,
	onSecondaryButtonClick,
	className,
}) => {
	const router = useRouter();

	const handlePrimaryButtonClick = () => {
		if (onPrimaryButtonClick) {
			onPrimaryButtonClick();
		} else if (primaryButtonLink) {
			router.push(primaryButtonLink);
		}
	};

	return (
		<div
			className={`bg-gradient-to-tr from-primary-dark to-custom-skyBlue rounded-lg text-white relative z-10 overflow-hidden  ${className}`}
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
					alt="Happy Applicant"
					width={332}
					height={300}
					className="z-10"
				/>

				{/* Text and buttons */}
				<div className="relative z-10 py-6 flex flex-col items-center text-center md:items-start md:text-left">
					<h2 className="text-lg">Hi, {userName}</h2>
					<h1 className="text-3xl font-semibold mt-2 mb-6">
						Welcome To Your
						<br />
						Applicant Dashboard
					</h1>

					<div className="flex flex-wrap gap-4">
						<Button
							variant="default"
							className="bg-white text-custom-skyBlue hover:bg-gray-100 flex items-center font-semibold"
							onClick={handlePrimaryButtonClick}
						>
							{primaryButtonText}
							<MoveRight className="w-6 h-6 ml-2" />
						</Button>

						{showSecondaryButton && (
							<Button
								variant="outline"
								className="bg-transparent border-white text-white hover:bg-white/10"
								onClick={onSecondaryButtonClick}
							>
								{secondaryButtonText}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WelcomeBanner;
