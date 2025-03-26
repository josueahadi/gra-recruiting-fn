"use client";

import DocumentsSection from "@/components/applicant/documents";
import AppLayout from "@/components/layout/app-layout";

export default function ApplicantDocumentsPage() {
	return (
		<AppLayout userType="applicant">
			<DocumentsSection />
		</AppLayout>
	);
}
