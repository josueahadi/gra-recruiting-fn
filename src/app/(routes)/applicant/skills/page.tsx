"use client";

import SkillsSection from "@/components/applicant/skills";
import AppLayout from "@/components/layout/app-layout";

export default function ApplicantSkillsPage() {
	return (
		<AppLayout userType="applicant">
			<SkillsSection />
		</AppLayout>
	);
}
