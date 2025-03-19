"use client";

import React from "react";
import AppLayout from "@/components/layout/app-layout";
import ApplicantDashboard from "@/components/applicant/applicant-dashboard";

export default function ApplicantDashboardPage() {
	return (
		<AppLayout userType="applicant">
			<ApplicantDashboard />
		</AppLayout>
	);
}
