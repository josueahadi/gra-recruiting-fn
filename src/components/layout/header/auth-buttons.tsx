"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import type { AuthMode } from "@/components/auth/auth-modal";
import PrimaryActionButton from "@/components/primary-action-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AuthButtonsProps {
	className?: string;
	buttonClassName?: string;
}

export const AuthButtons = ({
	className,
	buttonClassName,
}: AuthButtonsProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [authMode, setAuthMode] = useState<AuthMode>("login");

	const handleAuth = (mode: AuthMode) => {
		setAuthMode(mode);
		setIsOpen(true);
	};

	return (
		<>
			<div className={cn("flex items-center gap-4 text-base", className)}>
				<Button
					variant="ghost"
					className={cn(
						"px-6 py-5 bg-sky-500 rounded-3xl text-white transition-colors duration-300 hover:bg-primary-base hover:text-white font-bold capitalize drop-shadow-md",
						buttonClassName,
					)}
					onClick={() => handleAuth("login")}
				>
					Login
				</Button>

				<PrimaryActionButton
					className={cn("uppercase", buttonClassName)}
					onClick={() => handleAuth("signup")}
				>
					Apply Now
				</PrimaryActionButton>
			</div>

			<AuthModal
				mode={authMode}
				open={isOpen}
				onOpenChange={setIsOpen}
				onSuccess={() => {
					setIsOpen(false);
					// Add any additional success handling
				}}
				onError={(error) => {
					console.error("Auth error:", error);
					// Add any additional error handling
				}}
			/>
		</>
	);
};
