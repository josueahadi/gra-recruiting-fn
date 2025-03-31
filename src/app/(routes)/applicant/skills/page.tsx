"use client";

import AppLayout from "@/components/layout/app-layout";
import ProfileContent from "@/components/applicant/profile/profile-content";

export default function ApplicantSkillsPage() {
	return (
		<AppLayout userType="applicant">
			<ProfileContent />
		</AppLayout>
	);
}
