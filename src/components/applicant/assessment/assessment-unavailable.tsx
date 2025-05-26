import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AssessmentUnavailableProps {
	title?: string;
	message?: string;
	buttonText?: string;
	onButtonClick?: () => void;
	onRetry?: () => void;
}

const AssessmentUnavailable: React.FC<AssessmentUnavailableProps> = ({
	title = "Assessment Unavailable",
	message = "The assessment is currently unavailable due to insufficient questions. Please try again later.",
	buttonText = "Back To Dashboard",
	onButtonClick,
	onRetry,
}) => {
	const router = useRouter();
	const [isRetrying, setIsRetrying] = useState(false);

	const handleButtonClick = () => {
		if (onButtonClick) {
			onButtonClick();
		} else {
			router.push("/applicant/dashboard");
		}
	};

	const handleRetry = async () => {
		if (onRetry) {
			setIsRetrying(true);
			try {
				await onRetry();
			} finally {
				setIsRetrying(false);
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center text-center py-16 px-4">
			<div className="mb-8">
				<AlertCircle className="w-16 h-16 text-red-500" />
			</div>

			<div className="max-w-xl mx-auto">
				<h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
				<p className="text-lg mb-4 text-gray-600">{message}</p>
				<p className="text-sm mb-8 text-gray-500">
					You can try again in a few minutes. If the issue persists, please
					contact support.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						onClick={handleButtonClick}
						className="bg-primary-base hover:bg-primary-base text-white px-8 py-5 rounded-lg"
					>
						{buttonText}
					</Button>
					{onRetry && (
						<Button
							onClick={handleRetry}
							disabled={isRetrying}
							variant="outline"
							className="px-8 py-5 rounded-lg"
						>
							<RefreshCw
								className={`w-5 h-5 mr-2 ${isRetrying ? "animate-spin" : ""}`}
							/>
							{isRetrying ? "Checking..." : "Try Again"}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AssessmentUnavailable;
