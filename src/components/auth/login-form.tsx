import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "./google-auth-button";
import Image from "next/image";
import Link from "next/link";
import { AUTH_CONSTANTS, authStyles } from "@/constants";

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
		<div className={authStyles.wrapper}>
			<div className={authStyles.imageSection}>
				<Image
					width={500}
					height={500}
					src="/images/freepik-11-2000.webp"
					alt="Login illustration"
					className={authStyles.image}
				/>
			</div>

			<div className={authStyles.formSection}>
				<div className={authStyles.formWrapper}>
					<div className={authStyles.header}>
						<h1 className={authStyles.headerTitle}>Welcome Back</h1>
						<p className={authStyles.headerSubtitle}>
							{AUTH_CONSTANTS.LOGIN.title}
						</p>
					</div>

					<form onSubmit={handleSubmit} className={authStyles.form}>
						<Input
							type="email"
							name="email"
							placeholder="Email Address"
							className={authStyles.input}
							required
							autoComplete="email"
						/>

						<div className="relative">
							<Input
								type={showPassword ? "text" : "password"}
								name="password"
								placeholder="Password"
								className={authStyles.inputWithIcon}
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

						<div className="flex justify-end">
							<Link
								href="/forgot-password"
								className="text-sm text-gray-600 hover:text-sky-500"
							>
								Forgot Password?
							</Link>
						</div>

						<Button
							type="submit"
							className={authStyles.button}
							disabled={isLoading}
						>
							Sign In
						</Button>
					</form>

					<div className={authStyles.divider}>
						<div className={authStyles.dividerLine} />
						<span className={authStyles.dividerText}>Or</span>
						<div className={authStyles.dividerLine} />
					</div>

					<GoogleAuthButton onClick={handleGoogleAuth} />

					<p className={authStyles.modeToggle}>
						Don&apos;t have an account?{" "}
						<button
							type="button"
							onClick={onModeChange}
							className={authStyles.modeToggleButton}
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
