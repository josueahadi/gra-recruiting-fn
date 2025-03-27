import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type React from "react";

interface SocialInputFieldProps {
	name: string;
	icon: React.ReactNode;
	placeholder: string;
	className?: string;
}

const SocialInputField = ({
	name,
	icon,
	placeholder,
	className,
}: SocialInputFieldProps) => {
	return (
		<div className="relative">
			<div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
			<Input
				type="url"
				name={name}
				placeholder={placeholder}
				className={cn(
					"w-full h-12 rounded-xl border-gray-400 bg-white pl-10",
					className,
				)}
			/>
		</div>
	);
};

export default SocialInputField;
