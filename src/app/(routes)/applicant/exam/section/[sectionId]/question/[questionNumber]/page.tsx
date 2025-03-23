import { Suspense } from "react";
import ClientAssessmentPage from "./client-assessment-page";

interface PageParams {
	params: {
		sectionId: string;
		questionNumber: string;
	};
}

/**
 * Generate metadata for the page
 */
export function generateMetadata({ params }: PageParams) {
	const { sectionId, questionNumber } = params;

	return {
		title: `Question ${questionNumber} | Section ${sectionId} | Grow Rwanda Assessment`,
		description: `Grow Rwanda Assessment - Section ${sectionId}, Question ${questionNumber}`,
	};
}

/**
 * Dynamic route for exam questions
 * Path: /applicant/exam/section/[sectionId]/question/[questionNumber]
 * Renders the AssessmentPage component with the section and question parameters
 */
export default function Page({ params }: PageParams) {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
				</div>
			}
		>
			<ClientAssessmentPage params={params} />
		</Suspense>
	);
}
