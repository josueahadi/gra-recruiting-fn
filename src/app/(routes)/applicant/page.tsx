"use client";

// import ProfileSection from "@/components/applicant/profile/user-profile";
// import AppLayout from "@/components/layout/app-layout";
import AppLayout from '@/components/layout/app-layout';
import ProfileContent from '@/components/applicant/profile/profile-content';

// export default function ApplicantProfilePage() {
// 	return (
// 		<>
// 			<AppLayout userType="applicant">
// 				<ProfileSection />
// 			</AppLayout>
// 		</>
// 	);
// }

export default function ApplicantProfilePage() {
  return (
    <AppLayout userType="applicant">
      <ProfileContent />
    </AppLayout>
  );
}