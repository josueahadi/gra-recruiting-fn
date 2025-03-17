"use client";

import DashboardLayout from "@/components/layout/applicant/dashboard-layout";
import SettingsSection from "@/components/applicant/settings";

export default function ApplicantSettingsPage() {
	return (
		<DashboardLayout userType="applicant">
			<SettingsSection />
		</DashboardLayout>
	);
}
