import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export const LoginFields = ({
	showPassword,
	setShowPassword,
}: {
	showPassword: boolean;
	setShowPassword: (show: boolean) => void;
}) => (
	<>
		<Input
			type="email"
			name="email"
			placeholder="Email Address"
			className="w-full h-12 rounded-xl border-gray-400 bg-white"
			autoComplete="email"
		/>

		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				name="password"
				placeholder="Password"
				className="w-full h-12 rounded-xl border-gray-400 bg-white pr-10"
				autoComplete="new-password"
			/>
			<button
				type="button"
				className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
			</button>
		</div>
	</>
);
