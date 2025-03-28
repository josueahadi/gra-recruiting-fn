"use client";

import React from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import ApplicantProfileView from "@/components/admin/applicants/applicant-profile-view";

const ApplicantProfilePage = () => {
	const params = useParams();
	const id = params?.id as string;

	return (
		<AppLayout userType="admin">
			<ApplicantProfileView id={id} />
		</AppLayout>
	);
};

export default ApplicantProfilePage;
