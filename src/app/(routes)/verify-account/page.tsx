"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Brand } from "@/components/ui/brand";
import { Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function VerifyAccountPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	let token = searchParams.get("token");

	if (!token) {
		const raw = window.location.search;
		if (raw.startsWith("?") && raw.length > 1 && !raw.includes("=")) {
			token = raw.substring(1);
		}
	}
	const setToken = useAuthStore((state) => state.setToken);
	const { resendVerification } = useAuth();

	const [verificationState, setVerificationState] = useState<
		"loading" | "success" | "error"
	>("loading");
	const [errorMessage, setErrorMessage] = useState("");
	const [hasSignupData, setHasSignupData] = useState(false);
	const [alreadyVerified, setAlreadyVerified] = useState(false);
	const [resendStatus, setResendStatus] = useState<null | "success" | "error">(
		null,
	);
	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const [isResending, setIsResending] = useState(false);

	useEffect(() => {
		try {
			const pendingData = localStorage.getItem("signupPendingData");
			setHasSignupData(!!pendingData);
		} catch (error) {
			console.error("Error checking pending signup data:", error);
		}
	}, []);

	useEffect(() => {
		const verifyEmail = async () => {
			if (!token) {
				setVerificationState("error");
				setErrorMessage("No verification token found");
				return;
			}

			try {
				const response = await api.patch(
					"/api/v1/users/verify-email",
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (response.data?.accessToken) {
					setToken(response.data.accessToken);
					api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
					const pendingDataStr = localStorage.getItem("signupPendingData");
					if (pendingDataStr) {
						try {
							const pendingData = JSON.parse(pendingDataStr);
							if (pendingData.career) {
								await api.patch("/api/v1/users/update-user-profile", {
									careerName: pendingData.career,
								});
							}
							if (pendingData.levelOfEducation || pendingData.university) {
								await api.post("/api/v1/applicants/add-education", {
									institutionName: pendingData.university || "",
									educationLevel: pendingData.levelOfEducation || "",
									program: pendingData.major || "",
									dateJoined: pendingData.graduationDate
										? new Date(
												Number.parseInt(pendingData.graduationDate) - 4,
												8,
												1,
											)
												.toISOString()
												.split("T")[0]
										: "",
									dateGraduated: pendingData.graduationDate
										? `${pendingData.graduationDate}-06-30`
										: "",
								});
							}
							if (
								pendingData.linkedinProfileUrl ||
								pendingData.githubProfileUrl
							) {
								await api.post("/api/v1/applicants/add-documents", {
									linkedinProfileUrl: pendingData.linkedinProfileUrl || "",
									githubProfileUrl: pendingData.githubProfileUrl || "",
								});
							}
							localStorage.removeItem("signupPendingData");
							setVerificationState("success");
							return;
						} catch (error) {
							console.error(
								"Error completing profile after verification:",
								error,
							);
						}
					}
					setVerificationState("success");
					return;
				}
				// If no accessToken but no error, treat as success
				setVerificationState("success");
			} catch (error: unknown) {
				const apiError = error as {
					response?: {
						data?: { message?: string; error?: string };
						status?: number;
					};
				};
				const msg = apiError.response?.data?.message?.toLowerCase() || "";
				const status = apiError.response?.status;

				if (msg.includes("already verified")) {
					setAlreadyVerified(true);
					setVerificationState("success");
					setErrorMessage("Your email is already verified. Please log in.");
				} else if (
					status === 401 ||
					status === 403 ||
					msg.includes("expired") ||
					msg.includes("invalid")
				) {
					setVerificationState("error");
					setErrorMessage(
						"Verification link expired or invalid. Please request a new one.",
					);
				} else if (status === 500) {
					setVerificationState("error");
					setErrorMessage("Internal server error. Please try again later.");
				} else {
					setVerificationState("error");
					setErrorMessage(
						apiError.response?.data?.message ||
							"Failed to verify email. Please try again.",
					);
				}
			}
		};

		verifyEmail();
	}, [token, setToken]);

	return (
		<div className="min-h-screen flex flex-col">
			<div className="p-4">
				<Brand />
			</div>
			<div className="flex-1 flex items-center justify-center">
				<Suspense fallback={null}>
					<div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
						{verificationState === "loading" && (
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base mx-auto" />
								<h2 className="mt-4 text-xl font-semibold">
									Verifying your email...
								</h2>
								<p className="mt-2 text-gray-600">
									Please wait while we verify your email address.
								</p>
							</div>
						)}

						{verificationState === "success" && (
							<div className="text-center">
								{alreadyVerified ? (
									<>
										<CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
										<h2 className="mt-4 text-xl font-semibold text-green-700">
											Verification Complete
										</h2>
										<p className="mt-2 text-gray-600">{errorMessage}</p>
										<div className="mt-6 space-y-3">
											<Button
												onClick={() => router.push("/auth?mode=login")}
												className="w-full bg-primary-base hover:bg-custom-skyBlue font-bold"
											>
												Back to Login
											</Button>
										</div>
									</>
								) : (
									<>
										<CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
										<h2 className="mt-4 text-xl font-semibold text-green-700">
											Email Verified!
										</h2>
										<p className="mt-2 text-gray-600">
											{hasSignupData
												? "Your profile setup is complete. You can now log in."
												: "Your email has been successfully verified. You can now log in."}
										</p>
										<div className="mt-6 space-y-3">
											<Button
												onClick={() => router.push("/auth?mode=login")}
												className="w-full bg-primary-base hover:bg-custom-skyBlue font-bold"
											>
												Back to Login
											</Button>
										</div>
									</>
								)}
							</div>
						)}

						{verificationState === "error" && (
							<div className="text-center">
								<XCircle className="h-12 w-12 text-red-500 mx-auto" />
								<h2 className="mt-4 text-xl font-semibold text-red-700">
									Verification Failed
								</h2>
								<p className="mt-2 text-gray-600">{errorMessage}</p>
								<div className="mt-6 space-y-3">
									<Button
										onClick={() => router.push("/auth?mode=login")}
										className="w-full bg-primary-base hover:bg-custom-skyBlue font-bold"
									>
										Back to Login
									</Button>
									<Button
										variant="outline"
										onClick={async () => {
											setIsResending(true);
											setResendStatus(null);
											setResendMessage(null);
											try {
												// Try to get the email from localStorage or token
												let email = "";
												try {
													email =
														localStorage.getItem("pendingVerificationEmail") ||
														"";
												} catch {}
												if (!email) {
													setResendStatus("error");
													setResendMessage(
														"Could not determine your email. Please try logging in again.",
													);
													setIsResending(false);
													return;
												}
												await resendVerification(email);
												setResendStatus("success");
												setResendMessage(
													"Verification email resent! Please check your inbox.",
												);
											} catch (error) {
												console.error(
													"Error resending verification email:",
													error,
												);
												setResendStatus("error");
												setResendMessage(
													"Failed to resend verification email. Please try again later.",
												);
											} finally {
												setIsResending(false);
											}
										}}
										className="w-full"
										disabled={isResending}
									>
										{isResending ? "Resending..." : "Resend Verification Email"}
									</Button>
									{resendMessage && (
										<div
											className={`mt-2 text-sm ${resendStatus === "success" ? "text-green-600" : "text-red-600"}`}
										>
											{resendMessage}
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</Suspense>
			</div>
		</div>
	);
}
