"use client";

import PrimaryCTAButton from "@/components/common/primary-cta-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

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
			<PrimaryCTAButton
				className={cn(buttonClassName)}
				onClick={() => handleAuth("signup")}
			>
				Apply
			</PrimaryCTAButton>
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
		</div>
	);
};
