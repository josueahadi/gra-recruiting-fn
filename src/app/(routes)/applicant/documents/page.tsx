"use client";

import AppLayout from "@/components/layout/app-layout";
import DocumentsSection from "@/components/applicant/documents";

export default function ApplicantDocumentsPage() {
	return (
		<AppLayout userType="applicant">
			<DocumentsSection />
		</AppLayout>
	);
}
