"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileContainer } from "@/components/profile";
import { useAuth } from "@/hooks/use-auth";

interface ApplicantProfileClientProps {
	id: string;
}

export function ApplicantProfileClient({ id }: ApplicantProfileClientProps) {
	const router = useRouter();
	const { userType } = useAuth();

	const handleGoBack = () => {
		router.push("/admin/applicants");
	};

	return (
		<ProfileContainer
			userId={id}
			userType={userType}
			onNavigateBack={handleGoBack}
			wrapperClassName=""
		/>
	);
}
