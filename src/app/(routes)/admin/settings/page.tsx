"use client";

import AdminSettingsSection from "@/components/admin/settings";
import AppLayoutWrapper from "@/components/layout/app-layout-wrapper";

export default function AdminSettingsPage() {
	return (
		<AppLayoutWrapper forceUserType="admin">
			<AdminSettingsSection />
		</AppLayoutWrapper>
	);
} 