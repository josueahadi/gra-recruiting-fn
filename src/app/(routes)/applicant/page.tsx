"use client";

import ProfileSection from "@/components/applicant/user-profile";
import AppLayout from "@/components/layout/app-layout-updated";

export default function ApplicantProfilePage() {
	return (
		<>
			<AppLayout userType="applicant">
				<ProfileSection />
			</AppLayout>
		</>
	);
}
