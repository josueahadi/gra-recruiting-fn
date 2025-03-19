"use client";

import AppLayout from "@/components/layout/app-layout";
import SkillsSection from "@/components/applicant/skills";

export default function ApplicantSkillsPage() {
	return (
		<AppLayout userType="applicant">
			<SkillsSection />
		</AppLayout>
	);
}
