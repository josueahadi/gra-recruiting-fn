"use client";

import { cn } from "@/lib/utils";

interface BackgroundPatternProps {
	className?: string;
	imagePath?: string;
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
	className,
	imagePath = "/images/growrwanda-pattern-01-vertical.svg",
}) => {
	return (
		<div
			className={cn(
				"fixed inset-0 z-0 opacity-100 pointer-events-none",
				className,
			)}
			style={{
				backgroundImage: `url('${imagePath}')`,
				backgroundSize: "contain",
				backgroundRepeat: "repeat",
			}}
			aria-hidden="true"
		/>
	);
};

export default BackgroundPattern;
