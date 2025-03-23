"use client";

import AssessmentPage from "@/components/applicant/exam/assessment-page";

interface ClientAssessmentPageProps {
	params: {
		sectionId: string;
		questionNumber: string;
	};
}

/**
 * Client component wrapper for AssessmentPage
 */
export default function ClientAssessmentPage({
	params,
}: ClientAssessmentPageProps) {
	return <AssessmentPage params={params} />;
}
