"use client";

import AuthForm from "@/components/auth/auth-form";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

function AuthContent() {
	const searchParams = useSearchParams();
	const mode = (searchParams.get("mode") as "login" | "signup") || "login";
	const { isAuthenticated, user } = useAuth();

	useEffect(() => {
		if (isAuthenticated && user) {
			const redirectPath =
				user.role.toLowerCase() === "admin"
					? "/admin/dashboard"
					: "/applicant/dashboard";
			window.location.href = redirectPath;
		}
	}, [isAuthenticated, user]);

	return (
		<div className="min-h-screen flex">
			<div className="hidden lg:block lg:fixed lg:w-1/2 h-screen">
				<Image
					width={500}
					height={500}
					src={
						mode === "login"
							? "/images/placeholder.svg"
							: "/images/placeholder.svg"
					}
					alt="Grow Rwanda"
					className={`w-full h-full ${
						mode === "login" ? "object-cover" : "object-cover"
					}`}
					priority
				/>
			</div>

			<div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 bg-white">
				<AuthForm mode={mode} />
			</div>
		</div>
	);
}

function AuthFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-pulse flex space-x-4">
				<div className="rounded-full bg-gray-200 h-12 w-12" />
				<div className="flex-1 space-y-4 py-1">
					<div className="h-4 bg-gray-200 rounded w-3/4" />
					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded" />
						<div className="h-4 bg-gray-200 rounded w-5/6" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default function AuthPage() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return <AuthFallback />;
	}

	return (
		<Suspense fallback={<AuthFallback />}>
			<AuthContent />
		</Suspense>
	);
}
