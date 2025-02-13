"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import type { AuthMode } from "@/components/auth/auth-modal";

interface PrimaryActionButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	href?: string;
	children: React.ReactNode;
	showAuthModal?: boolean;
	authMode?: AuthMode;
}

const PrimaryActionButton = ({
	className,
	href,
	children,
	showAuthModal = false,
	authMode = "signup",
	...props
}: PrimaryActionButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (showAuthModal) {
			e.preventDefault();
			setIsOpen(true);
		}
		props.onClick?.(e);
	};

	const baseStyles =
		"px-6 py-5 rounded-3xl bg-secondary-base text-white transition-colors duration-300 hover:bg-secondary-light hover:text-white font-bold";

	const button = href ? (
		<Button asChild className={cn(baseStyles, className)} {...props}>
			<Link href={href}>{children}</Link>
		</Button>
	) : (
		<Button
			className={cn(baseStyles, className)}
			{...props}
			onClick={handleClick}
		>
			{children}
		</Button>
	);

	return (
		<>
			{button}
			{showAuthModal && (
				<AuthModal
					mode={authMode}
					open={isOpen}
					onOpenChange={setIsOpen}
					onSuccess={() => {
						setIsOpen(false);
						// Add your success handling logic here
						console.log("Authentication successful");
					}}
					onError={(error) => {
						// Add your error handling logic here
						console.error("Authentication failed:", error);
					}}
				/>
			)}
		</>
	);
};

export default PrimaryActionButton;
