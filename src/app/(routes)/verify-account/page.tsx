"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth";

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

	const [verificationState, setVerificationState] = useState<
		"loading" | "success" | "error"
	>("loading");
	const [errorMessage, setErrorMessage] = useState("");
	const [hasSignupData, setHasSignupData] = useState(false);

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
							setTimeout(() => {
								if (!pendingDataStr) {
									setErrorMessage(
										"Your email has been verified, but we couldn't complete your profile automatically. Please log in and complete your profile.",
									);
									router.push("/auth?mode=login");
									return;
								}
								router.push("/applicant/dashboard");
							}, 3000);
							return;
						} catch (error) {
							console.error(
								"Error completing profile after verification:",
								error,
							);
						}
					}
				}

				setVerificationState("success");
				setTimeout(() => {
					router.push("/auth?mode=login");
				}, 3000);
			} catch (error: unknown) {
				setVerificationState("error");

				const apiError = error as {
					response?: { data?: { message?: string; error?: string } };
				};

				if (
					apiError.response?.data?.message?.toLowerCase().includes("expired") ||
					apiError.response?.data?.error?.toLowerCase().includes("expired")
				) {
					setErrorMessage(
						"Your verification link has expired. Verification links are only valid for 5 minutes. Please request a new verification email.",
					);
				} else {
					setErrorMessage(
						apiError.response?.data?.message ||
							"Failed to verify email. Please try again.",
					);
				}
			}
		};

		verifyEmail();
	}, [token, router, setToken]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#E0F5FF]">
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
						<CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
						<h2 className="mt-4 text-xl font-semibold text-green-700">
							Email Verified!
						</h2>
						<p className="mt-2 text-gray-600">
							{hasSignupData
								? "Your profile setup is complete. Redirecting you to your dashboard..."
								: "Your email has been successfully verified. Redirecting you to login..."}
						</p>
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
								className="w-full"
							>
								Back to Login
							</Button>
							<Button
								variant="outline"
								onClick={() => router.push("/auth/verification-pending")}
								className="w-full"
							>
								Request New Verification Email
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
