"use client";

import AppLayout from "@/components/layout/app-layout";
import WorkEducationSection from "@/components/applicant/work-education";

export default function ApplicantEducationPage() {
	return (
		<AppLayout userType="applicant">
			<WorkEducationSection />
		</AppLayout>
	);
}
