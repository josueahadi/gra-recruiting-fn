"use client";

import ApplicantDashboard from "@/components/applicant/applicant-dashboard";
import AppLayout from "@/components/layout/app-layout";
import React from "react";
import { useAuthStore } from "@/store/auth";

export default function ApplicantDashboardPage() {
	const { user } = useAuthStore();

	return (
		<AppLayout
			userType="applicant"
			userName={user ? `${user.firstName} ${user.lastName}` : "John Doe"}
			avatarSrc={user?.profilePictureUrl || undefined}
		>
			<ApplicantDashboard />
		</AppLayout>
	);
}
