/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicantProfileClient } from "./client";
import AppLayout from "@/components/layout/app-layout";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function ApplicantProfilePage(props: any) {
	const { params } = props as { params: { id: string } };
	return (
		<AppLayout userType="admin">
			<ApplicantProfileClient id={params.id} />
		</AppLayout>
	);
}
