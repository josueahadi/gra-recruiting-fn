"use client";

// import SkillsSection from "@/components/applicant/profile/skills";
import AppLayout from "@/components/layout/app-layout";
import ProfileContent from '@/components/applicant/profile/profile-content';

// export default function ApplicantSkillsPage() {
// 	return (
// 		<AppLayout userType="applicant">
// 			<SkillsSection />
// 		</AppLayout>
// 	);
// }
export default function ApplicantSkillsPage() {
  return (
    <AppLayout userType="applicant">
      <ProfileContent />
    </AppLayout>
  );
}