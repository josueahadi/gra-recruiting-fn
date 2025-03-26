"use client";

import SkillsSection from "@/components/applicant/skills";
import AppLayout from "@/components/layout/app-layout-updated";

export default function ApplicantSkillsPage() {
	return (
		<AppLayout userType="applicant">
			<SkillsSection />
		</AppLayout>
	);
}
