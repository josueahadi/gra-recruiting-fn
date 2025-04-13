"use client";

import type React from "react";
import AppLayout from "@/components/layout/app-layout";
import { useAuth } from "@/hooks/use-auth";
import { formatUserName } from "@/lib/utils/auth-utils";

interface AppLayoutWrapperProps {
	children: React.ReactNode;
	forceUserType?: "admin" | "applicant"; // For testing/development
}

const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({
	children,
	forceUserType,
}) => {
	const { user, userType, isCheckingAuth } = useAuth();

	if (isCheckingAuth) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	const userName = formatUserName(user?.firstName, user?.lastName);

	const effectiveUserType = forceUserType || userType;

	return (
		<AppLayout
			userType={effectiveUserType}
			userName={userName}
			avatarSrc={user?.avatarUrl}
		>
			{children}
		</AppLayout>
	);
};

export default AppLayoutWrapper;
