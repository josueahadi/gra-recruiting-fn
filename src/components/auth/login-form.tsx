import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

interface LoginFormProps {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onOpenChange?: (open: boolean) => void;
	onModeChange: () => void;
}

const LoginForm = ({
	onSuccess,
	onError,
	onOpenChange,
	onModeChange,
}: LoginFormProps) => {
	const { isLoading, showPassword, setShowPassword, login, handleGoogleAuth } =
		useAuth({
			onSuccess,
			onError,
			onOpenChange,
		});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		await login({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});
	};

	return (
		<div className="flex !rounded-3xl overflow-hidden">
			<div className="w-1/3 bg-gradient-to-b from-[#D1D9D1] via-[#ECEAEA] to-[#ECEAEA] flex items-center justify-center">
				<Image
					width={500}
					height={400}
					src="/images/login-illustration.png"
					alt="Login illustration"
					className="w-full h-auto"
				/>
			</div>

			<div className="w-2/3 p-12 bg-gray-400/15">
				<div className="max-w-md mx-auto space-y-6">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
						<p className="mt-2 text-gray-600">
							Please Enter Your Details to login to your account
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<Input
							type="email"
							name="email"
							placeholder="Email Address"
							className="w-full h-12 rounded-xl border-gray-400 bg-white"
							required
							autoComplete="email"
						/>

						<div className="relative">
							<Input
								type={showPassword ? "text" : "password"}
								name="password"
								placeholder="Password"
								className="w-full h-12 rounded-xl border-gray-400 bg-white pr-10"
								required
								autoComplete="current-password"
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>

						<Button
							type="submit"
							className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
							disabled={isLoading}
						>
							Sign In
						</Button>
					</form>

					<div className="flex items-center">
						<div className="flex-grow border-t border-gray-400/75" />
						<span className="mx-4 text-sm font-bold text-gray-700 uppercase">
							Or
						</span>
						<div className="flex-grow border-t border-gray-400/75" />
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full h-12 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 text-gray-700 font-medium"
						onClick={handleGoogleAuth}
					>
						<FcGoogle className="mr-2" />
						Sign in with Google
					</Button>

					<p className="text-center text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<button
							type="button"
							onClick={onModeChange}
							className="text-green-500 hover:text-green-600 font-semibold"
						>
							Sign up
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
