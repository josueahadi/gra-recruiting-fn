"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailVerificationPending from "@/components/auth/email-verification-pending";
import { showToast } from "@/services/toast";
import { useAuth } from "@/hooks/use-auth";

const VerificationPendingPage = () => {
	const router = useRouter();
	const { resendVerification } = useAuth();
	const [email, setEmail] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(false);

	useEffect(() => {
		const emailFromStorage = localStorage.getItem("pendingVerificationEmail");

		if (!emailFromStorage) {
			showToast({
				title: "No email found",
				description:
					"We couldn't find an email to verify. Please try signing up again.",
				variant: "error",
			});

			setTimeout(() => {
				router.push("/auth?mode=signup");
			}, 1500);
			return;
		}

		setEmail(emailFromStorage);
	}, [router]);

	const handleResendVerification = async () => {
		if (!email || resendCooldown) return;

		setIsLoading(true);

		try {
			await resendVerification(email);

			showToast({
				title: "Verification email sent!",
				description: "Please check your inbox for the new verification link.",
				variant: "success",
			});

			// Set cooldown to prevent spam
			setResendCooldown(true);
			setTimeout(() => {
				setResendCooldown(false);
			}, 60000);
		} catch (error) {
			showToast({
				title: "Failed to resend",
				description:
					"We couldn't resend the verification email. Please try again later.",
				variant: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToLogin = () => {
		router.push("/auth?mode=login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
			<EmailVerificationPending
				email={email}
				onResendVerification={handleResendVerification}
				onBackToLogin={handleBackToLogin}
				resendComingSoon={resendCooldown}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default VerificationPendingPage;
