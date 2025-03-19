"use client";

import WorkEducationSection from "@/components/applicant/work-education";
import AppLayout from "@/components/layout/app-layout";

export default function ApplicantEducationPage() {
	return (
		<AppLayout userType="applicant">
			<WorkEducationSection />
		</AppLayout>
	);
}
