import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { AUTH_CONSTANTS } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";

export const ContactInfoFields = ({
	showPassword,
	setShowPassword,
}: {
	showPassword: boolean;
	setShowPassword: (show: boolean) => void;
}) => (
	<>
		<Input
			type="text"
			name="fullName"
			placeholder="Full Names"
			className="w-full h-12 rounded-xl border-gray-400 bg-white"
			autoComplete="name"
		/>

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

		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				name="confirm-password"
				placeholder="Confirm Password"
				className="w-full h-12 rounded-xl border-gray-400 bg-white pr-10"
				minLength={8}
				aria-label="Confirm Password"
			/>
			<button
				type="button"
				className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
			</button>
		</div>

		<div className="flex items-center space-x-2">
			<Checkbox id="terms" name="terms" />
			<label htmlFor="terms" className="text-sm text-gray-700">
				{AUTH_CONSTANTS.SIGNUP.terms}
			</label>
		</div>
	</>
);
