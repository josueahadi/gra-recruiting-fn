"use client";

import AppLayout from "@/components/layout/app-layout";
import ProfileContent from "@/components/applicant/profile/profile-content";

export default function ApplicantProfilePage() {
	return (
		<AppLayout userType="APPLICANT">
			<ProfileContent />
		</AppLayout>
	);
}
