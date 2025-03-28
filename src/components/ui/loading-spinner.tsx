import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
	className?: string;
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
	return (
		<Loader2 className={cn("h-5 w-5 animate-spin text-gray-500", className)} />
	);
};
