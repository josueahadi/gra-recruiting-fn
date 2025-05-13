"use client";

import AppLayoutWrapper from "@/components/layout/app-layout-wrapper";
import { usePathname } from "next/navigation";
import React from "react";
import AdminDashboard from "@/components/admin/admin-dashboard";
import ApplicantsManagement from "@/components/admin/applicants-management";
import QuestionsManagement from "@/components/admin/questions-management";
import ResultsManagement from "@/components/admin/results-management";

const AdminPage = () => {
	const pathname = usePathname();

	const renderContent = () => {
		if (pathname.includes("/admin/applicants")) {
			return (
				<>
					<ApplicantsManagement />
				</>
			);
		}

		if (pathname.includes("/admin/questions")) {
			return (
				<>
					<QuestionsManagement />
				</>
			);
		}

		if (pathname.includes("/admin/results")) {
			return (
				<>
					<ResultsManagement />
				</>
			);
		}

		return (
			<>
				<AdminDashboard />
			</>
		);
	};

	return (
		<AppLayoutWrapper>
			<div className="space-y-6">{renderContent()}</div>
		</AppLayoutWrapper>
	);
};

export default AdminPage;
