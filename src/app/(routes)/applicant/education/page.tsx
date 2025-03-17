"use client";

import DashboardLayout from "@/components/layout/applicant/dashboard-layout";
import WorkEducationSection from "@/components/applicant/work-education";

export default function ApplicantEducationPage() {
	return (
		<DashboardLayout userType="applicant">
			<WorkEducationSection />
		</DashboardLayout>
	);
}
