import { Button } from "@/components/ui/button";
import { Mail, Clock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EmailVerificationPendingProps {
	email: string;
	onResendVerification?: () => void;
	onBackToSignup?: () => void;
	resendComingSoon?: boolean;
	cooldownTime?: number;
	linkExpiryTime?: number;
	isLoading?: boolean;
}

const EmailVerificationPending = ({
	email,
	onResendVerification,
	onBackToSignup,
	resendComingSoon = false,
	cooldownTime = 60,
	linkExpiryTime = 300,
	isLoading = false,
}: EmailVerificationPendingProps) => {
	// Helper to format seconds as mm:ss
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	return (
		<div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
			<div className="text-center mb-6">
				<div className="bg-blue-50 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-5">
					<Mail className="h-10 w-10 text-primary-base" />
				</div>
				<h1 className="text-2xl font-bold mt-4">Verify your email</h1>
				<p className="mt-2 text-gray-600">
					We&apos;ve sent a verification link to:
				</p>
				<p className="font-semibold text-blue-600 mt-1 break-all">
					{email || "..."}
				</p>
			</div>

			{/* <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
				<div className="flex">
					<AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
					<div className="text-sm text-amber-700">
						<p className="font-medium">Important</p>
						<p>
							You need to verify your email before signing in to your account
						</p>
					</div>
				</div>
			</div> */}

			<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
				<div className="flex items-center">
					<Clock className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
					<div className="text-amber-700">
						<p className="font-medium">
							Verification link expires in{" "}
							<span className="font-bold text-red-500">
								{formatTime(linkExpiryTime)}
							</span>
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<p className="text-sm text-gray-600">
					Please check your inbox and spam folder, then click the verification
					link to complete your account setup. Once verified, you&apos;ll be
					able to continue with your profile setup.
				</p>

				<div className="space-y-3 mt-6">
					<Button
						variant="outline"
						onClick={onResendVerification}
						className="w-full bg-primary-base text-white hover:text-white hover:bg-custom-skyBlue font-bold"
						disabled={isLoading || resendComingSoon}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending verification email...
							</>
						) : resendComingSoon ? (
							`Resend available in ${formatTime(cooldownTime)}`
						) : (
							"Resend Verification Email"
						)}
					</Button>
					<Button
						variant="ghost"
						onClick={onBackToSignup}
						className="w-full font-medium hover:bg-gray-100"
						disabled={isLoading}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Signup
					</Button>
				</div>
			</div>

			<div className="mt-8 text-center text-sm text-gray-500">
				<p>
					Already verified your email?{" "}
					<Link
						href="/auth?mode=login"
						className="text-primary-base hover:underline font-medium"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default EmailVerificationPending;
