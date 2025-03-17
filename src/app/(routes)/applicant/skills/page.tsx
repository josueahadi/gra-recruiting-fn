"use client";

import DashboardLayout from "@/components/layout/applicant/dashboard-layout";
import SkillsSection from "@/components/applicant/skills";

export default function ApplicantSkillsPage() {
	return (
		<DashboardLayout userType="applicant">
			<SkillsSection />
		</DashboardLayout>
	);
}
