"use client";

import DashboardLayout from "@/components/layout/applicant/dashboard-layout";
import ProfileSection from "@/components/applicant/user-profile";

export default function ApplicantProfilePage() {
	return (
		<>
			<DashboardLayout userType="applicant">
				<ProfileSection />
			</DashboardLayout>
		</>
	);
}

// "use client";

// import EmailSection from "@/components/applicant/email-section";
// import NotificationSection from "@/components/applicant/notification-section";
// import ProfileSection from "@/components/applicant/profile";
// import { ApplicantHeader } from "@/components/layout/applicant/applicant-header";
// import DashboardLayout from "@/components/layout/admin/dashboard-layout";
// import React, { useState } from "react";

// const ApplicantDashboard = () => {
// 	const [activeSection, setActiveSection] = useState("profile");

// 	const renderSection = () => {
// 		switch (activeSection) {
// 			case "profile":
// 				return <ProfileSection />;
// 			case "emails":
// 				return <EmailSection />;
// 			case "notifications":
// 				return <NotificationSection />;
// 			default:
// 				return <ProfileSection />;
// 		}
// 	};
// 	return (
// 		<DashboardLayout userType="applicant">
// 			<ApplicantHeader
// 				activeSection={activeSection}
// 				setActiveSection={setActiveSection}
// 			/>
// 			<main className="container mx-auto px-4 py-8 max-w-7xl">
// 				{renderSection()}
// 			</main>
// 		</DashboardLayout>
// 	);
// };

// export default ApplicantDashboard;
