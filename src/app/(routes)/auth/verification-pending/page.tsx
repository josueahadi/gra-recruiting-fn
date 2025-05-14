"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/ui/brand";
import { useAuth } from "@/hooks/use-auth";
import { showToast } from "@/services/toast";
import EmailVerificationPending from "@/components/auth/email-verification-pending";

export default function VerificationPendingPage() {
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [resendCooldown, setResendCooldown] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [cooldownTime, setCooldownTime] = useState(60);
	const [linkExpiryTime, setLinkExpiryTime] = useState(300); // 5 minutes
	const { resendVerification } = useAuth();
	const expiryIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		try {
			const storedEmail = localStorage.getItem("pendingVerificationEmail");
			if (storedEmail) {
				setEmail(storedEmail);
			} else {
				// If no email found, redirect to login
				router.push("/auth?mode=login");
			}

			// Handle verification sent time
			const sentAt = localStorage.getItem("verificationSentAt");
			if (!sentAt) {
				const now = Date.now();
				localStorage.setItem("verificationSentAt", now.toString());
				setLinkExpiryTime(300);
			} else {
				const elapsed = Math.floor(
					(Date.now() - Number.parseInt(sentAt, 10)) / 1000,
				);
				setLinkExpiryTime(Math.max(0, 300 - elapsed));
			}
		} catch (error) {
			console.error("Error retrieving email or sent time from storage:", error);
		}
	}, [router]);

	// Link expiry countdown
	useEffect(() => {
		if (linkExpiryTime <= 0) return;
		expiryIntervalRef.current = setInterval(() => {
			setLinkExpiryTime((prev) => {
				if (prev <= 1) {
					if (expiryIntervalRef.current)
						clearInterval(expiryIntervalRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => {
			if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
		};
	}, [linkExpiryTime]);

	// Resend cooldown countdown
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (resendCooldown && cooldownTime > 0) {
			interval = setInterval(() => {
				setCooldownTime((prev) => prev - 1);
			}, 1000);
		} else if (cooldownTime === 0) {
			setResendCooldown(false);
			setCooldownTime(60);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [resendCooldown, cooldownTime]);

	const handleResendVerification = async () => {
		if (!email || resendCooldown) return;
		setIsResending(true);
		try {
			await resendVerification(email);
			showToast({
				title: "Verification email sent!",
				description: "Please check your inbox for the new verification link.",
				variant: "success",
			});
			setResendCooldown(true);
			setCooldownTime(60);
			// Reset link expiry timer
			const now = Date.now();
			localStorage.setItem("verificationSentAt", now.toString());
			setLinkExpiryTime(300);
		} catch (error) {
			console.error("Error resending verification email:", error);
			showToast({
				title: "Failed to resend",
				description:
					"Could not resend the verification email. Please try again later.",
				variant: "error",
			});
		} finally {
			setIsResending(false);
		}
	};

	const handleBackToSignup = () => {
		router.push("/auth?mode=signup");
	};

	if (!email) {
		return (
			<div className="min-h-screen flex flex-col">
				<div className="p-4">
					<Brand />
				</div>
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base mx-auto" />
						<p className="mt-4">Loading...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<div className="p-4">
				<Brand />
			</div>
			<div className="flex-1 flex items-center justify-center p-8">
				<EmailVerificationPending
					email={email}
					onResendVerification={handleResendVerification}
					onBackToSignup={handleBackToSignup}
					resendComingSoon={resendCooldown}
					cooldownTime={cooldownTime}
					linkExpiryTime={linkExpiryTime}
					isLoading={isResending}
				/>
			</div>
		</div>
	);
}
