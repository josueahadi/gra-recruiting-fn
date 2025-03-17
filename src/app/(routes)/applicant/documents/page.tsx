"use client";

import DashboardLayout from "@/components/layout/applicant/dashboard-layout";
import DocumentsSection from "@/components/applicant/documents";

export default function ApplicantDocumentsPage() {
	return (
		<DashboardLayout userType="applicant">
			<DocumentsSection />
		</DashboardLayout>
	);
}
