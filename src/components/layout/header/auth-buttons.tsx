"use client";

import { Button } from "@/components/ui/button";
import PrimaryActionButton from "@/components/primary-action-button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AuthButtonsProps {
	className?: string;
	buttonClassName?: string;
}

export const AuthButtons = ({
	className,
	buttonClassName,
}: AuthButtonsProps) => {
	const router = useRouter();

	const handleAuth = (mode: "login" | "signup") => {
		router.push(`/auth?mode=${mode}`);
	};

	return (
		<div className={cn("flex items-center gap-4", className)}>
			<Button
				variant="ghost"
				className={cn(
					"text-gray-900 hover:text-primary-600 font-medium",
					buttonClassName,
				)}
				onClick={() => handleAuth("login")}
			>
				Sign In
			</Button>

			<PrimaryActionButton onClick={() => handleAuth("signup")}>
				Apply
			</PrimaryActionButton>
		</div>
	);
};
