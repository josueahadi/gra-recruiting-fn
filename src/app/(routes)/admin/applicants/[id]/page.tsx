/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicantProfileClient } from "./client";
import AppLayoutWrapper from "@/components/layout/app-layout-wrapper";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function ApplicantProfilePage(props: any) {
	const { params } = props as { params: { id: string } };
	return (
		<AppLayoutWrapper>
			<ApplicantProfileClient id={params.id} />
		</AppLayoutWrapper>
	);
}
