"use client";

import DashboardLayout from "@/components/layout/dashboard/dashboard-layout";
import React, { useState } from "react";
import { ApplicantHeader } from "@/components/layout/dashboard/applicant-header";
import ProfileSection from "@/components/dashboard/applicant/profile-section";
import EmailSection from "@/components/dashboard/applicant/email-section";
import NotificationSection from "@/components/dashboard/applicant/notification-section";

const ApplicantDashboard = () => {
	const [activeSection, setActiveSection] = useState("profile");

	const renderSection = () => {
		switch (activeSection) {
			case "profile":
				return <ProfileSection />;
			case "emails":
				return <EmailSection />;
			case "notifications":
				return <NotificationSection />;
			default:
				return <ProfileSection />;
		}
	};
	return (
		<DashboardLayout userType="applicant">
			<ApplicantHeader
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
			<main className="container mx-auto px-4 py-8 max-w-7xl">
				{renderSection()}
			</main>
		</DashboardLayout>
	);
};

export default ApplicantDashboard;
