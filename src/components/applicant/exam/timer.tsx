import type React from "react";
import { useState, useEffect } from "react";

interface TimerProps {
	initialTimeInMinutes: number;
	onTimeUp?: () => void;
	className?: string;
}

/**
 * Countdown timer component for exam sections
 */
const Timer: React.FC<TimerProps> = ({
	initialTimeInMinutes,
	onTimeUp,
	className = "",
}) => {
	const [timeLeft, setTimeLeft] = useState(initialTimeInMinutes * 60);
	const [isWarning, setIsWarning] = useState(false);

	useEffect(() => {
		// Set up the timer
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer);
					if (onTimeUp) onTimeUp();
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		// Clean up on unmount
		return () => clearInterval(timer);
	}, [onTimeUp]);

	// Check if we should show warning (less than 5 minutes left)
	useEffect(() => {
		if (timeLeft <= 300) {
			setIsWarning(true);
		}
	}, [timeLeft]);

	// Format time as MM:SS
	const formatTime = () => {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:00`;
	};

	return (
		<div className={`${className} text-center`}>
			<div className="bg-mint-50 p-4 rounded-md">
				<h2
					className={`text-3xl font-bold ${isWarning ? "text-red-500" : "text-primary-600"}`}
				>
					{formatTime()}
				</h2>
			</div>
		</div>
	);
};

export default Timer;
