"use client";

import AppLayout from "@/components/layout/app-layout";
import SettingsSection from "@/components/applicant/settings";

export default function ApplicantSettingsPage() {
	return (
		<AppLayout userType="applicant">
			<SettingsSection />
		</AppLayout>
	);
}
