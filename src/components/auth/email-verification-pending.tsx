import { Button } from "@/components/ui/button";
import { Mail, AlertCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

interface EmailVerificationPendingProps {
	email: string;
	onResendVerification?: () => void;
	onBackToLogin?: () => void;
	resendComingSoon?: boolean;
	isLoading?: boolean;
}

const EmailVerificationPending = ({
	email,
	onResendVerification,
	onBackToLogin,
	resendComingSoon = false,
	isLoading = false,
}: EmailVerificationPendingProps) => {
	return (
		<div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
			<div className="text-center mb-6">
				<div className="bg-blue-50 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-5">
					<Mail className="h-10 w-10 text-primary-base" />
				</div>
				<h1 className="text-2xl font-bold mt-4">Verify your email</h1>
				<p className="mt-2 text-gray-600">We've sent a verification link to:</p>
				<p className="font-semibold text-blue-600 mt-1 break-all">
					{email || "..."}
				</p>
			</div>

			<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
				<div className="flex">
					<AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
					<div className="text-sm text-amber-700">
						<p className="font-medium">Important</p>
						<p>
							You need to verify your email before completing your profile
							setup.
						</p>
					</div>
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<div className="flex">
					<Clock className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
					<div className="text-sm text-blue-700">
						<p className="font-medium">
							Verification link expires in 5 minutes
						</p>
						<p>
							If you don't verify your email within 5 minutes, you'll need to
							request a new verification link.
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<p className="text-sm text-gray-600">
					Please check your inbox and spam folder, then click the verification
					link to complete your account setup. Once verified, you'll be able to
					continue with your profile setup.
				</p>

				<div className="space-y-3 mt-6">
					<Button
						variant="outline"
						onClick={onResendVerification}
						className="w-full font-medium"
						disabled={isLoading || resendComingSoon}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending verification email...
							</>
						) : (
							"Resend Verification Email"
						)}
					</Button>
					<Button
						variant="ghost"
						onClick={onBackToLogin}
						className="w-full font-medium hover:bg-gray-100"
						disabled={isLoading}
					>
						Back to Login
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
