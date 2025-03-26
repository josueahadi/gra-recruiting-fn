"use client";

import ApplicantDashboard from "@/components/applicant/applicant-dashboard";
import AppLayout from "@/components/layout/app-layout";
import React from "react";

export default function ApplicantDashboardPage() {
	return (
		<AppLayout
			userType="applicant"
			userName="John Doe"
			avatarSrc="/images/avatar.jpg"
		>
			<ApplicantDashboard />
		</AppLayout>
	);
}
