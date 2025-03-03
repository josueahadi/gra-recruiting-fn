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
					"text-primary-base border-2 border-primary-base !rounded-50 px-8 py-5 hover:text-primary-base font-bold text-base",
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
