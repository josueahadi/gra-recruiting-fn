"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PrimaryActionButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	href?: string;
	children: React.ReactNode;
}

const PrimaryActionButton = ({
	className,
	href,
	children,
	...props
}: PrimaryActionButtonProps) => {
	const router = useRouter();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (href) {
			e.preventDefault();
			router.push(href);
		}
		props.onClick?.(e);
	};

	const button = href ? (
		<Button
			asChild
			className={cn(
				"px-8 py-5 !rounded-50 bg-primary-base text-white transition-colors duration-300 hover:bg-primary-light hover:text-white font-bold text-base",
				className,
			)}
			{...props}
		>
			<Link href={href}>{children}</Link>
		</Button>
	) : (
		<Button
			className={cn(
				"px-8 py-5 !rounded-50 bg-primary-base text-white transition-colors duration-300 hover:bg-primary-light hover:text-white font-medium text-base",
				className,
			)}
			{...props}
			onClick={handleClick}
		>
			{children}
		</Button>
	);

	return button;
};

export default PrimaryActionButton;
