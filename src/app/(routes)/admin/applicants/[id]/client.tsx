"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileContainer } from "@/components/profile";

interface ApplicantProfileClientProps {
	id: string;
}

export function ApplicantProfileClient({ id }: ApplicantProfileClientProps) {
	const router = useRouter();

	const handleGoBack = () => {
		router.push("/admin/applicants");
	};

	return (
		<ProfileContainer
			userId={id}
			userType="admin"
			onNavigateBack={handleGoBack}
			wrapperClassName=""
		/>
	);
}
