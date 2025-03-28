"use client";

import SettingsSection from "@/components/applicant/settings";
import AppLayout from "@/components/layout/app-layout";

export default function ApplicantSettingsPage() {
	return (
		<AppLayout userType="applicant">
			<SettingsSection />
		</AppLayout>
	);
}
