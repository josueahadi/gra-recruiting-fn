"use client";

import PrimaryActionButton from "@/components/primary-action-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface AuthButtonsProps {
	className?: string;
	buttonClassName?: string;
}

export const AuthButtons = ({
	className,
	buttonClassName,
}: AuthButtonsProps) => {
	const { handleAuth } = useAuth();
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

			<PrimaryActionButton
				className={cn(buttonClassName)}
				onClick={() => handleAuth("signup")}
			>
				Apply
			</PrimaryActionButton>
		</div>
	);
};
