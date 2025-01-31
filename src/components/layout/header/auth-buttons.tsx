import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthButtonsProps {
	className?: string;
	buttonClassName?: string;
}

export const AuthButtons = ({
	className,
	buttonClassName,
}: AuthButtonsProps) => (
	<div className={cn("flex items-center gap-4 text-base", className)}>
		<Button
			variant="ghost"
			className={cn(
				"px-6 py-5 bg-primary-base rounded-3xl text-white transition-colors duration-300 hover:bg-primary-base hover:text-white font-bold capitalize drop-shadow-md",
				buttonClassName,
			)}
		>
			<Link href="/login">Login</Link>
		</Button>

		<Button
			className={cn(
				"px-6 py-5 rounded-3xl bg-secondary-base text-white transition-colors duration-300 hover:bg-secondary-light hover:text-white uppercase font-bold",
				buttonClassName,
			)}
		>
			<Link href="/apply">Apply Now</Link>
		</Button>
	</div>
);
