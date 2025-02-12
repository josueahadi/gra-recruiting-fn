"use client";

import RegisterForm from "@/components/auth/register-form";
import ErrorBoundary from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface PrimaryActionButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	href?: string;
	children: React.ReactNode;
	showRegisterModal?: boolean;
}

const PrimaryActionButton = ({
	className,
	href,
	children,
	showRegisterModal = false,
	...props
}: PrimaryActionButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const baseStyles =
		"px-6 py-5 rounded-3xl bg-secondary-base text-white transition-colors duration-300 hover:bg-secondary-light hover:text-white font-bold";

	const button = href ? (
		<Button asChild className={cn(baseStyles, className)} {...props}>
			<Link href={href}>{children}</Link>
		</Button>
	) : (
		<Button className={cn(baseStyles, className)} {...props}>
			{children}
		</Button>
	);

	if (showRegisterModal) {
		return (
			<ErrorBoundary>
				<RegisterForm
					trigger={button}
					open={isOpen}
					onOpenChange={setIsOpen}
					onSuccess={() => {
						// Add your success handling logic here
						console.log("Registration successful");
					}}
					onError={(error) => {
						// Add your error handling logic here
						console.error("Registration failed:", error);
					}}
				/>
			</ErrorBoundary>
		);
	}

	return button;
};

export default PrimaryActionButton;
