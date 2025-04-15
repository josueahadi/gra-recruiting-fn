"use client";

import React, { useEffect } from "react";
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
	const { user, userType, isLoading, refreshProfile } = useAuth();

	console.log("[AppLayoutWrapper] Current auth state:", { 
		userType, 
		hasUser: !!user, 
		userRole: user?.role,
		isLoading
	});

	useEffect(() => {
		if (!user || user.isTemporary) {
			console.log("[AppLayoutWrapper] Loading user profile...");
			refreshProfile().catch(err => {
				console.error("[AppLayoutWrapper] Error loading profile:", err);
			});
		}
	}, [user, refreshProfile]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	const userName = formatUserName(user?.firstName, user?.lastName);

	const effectiveUserType = forceUserType || userType;
	
	console.log("[AppLayoutWrapper] Using userType:", effectiveUserType);

	return (
		<AppLayout
			userType={effectiveUserType}
			userName={userName}
			avatarSrc="/images/avatar.jpg" 
		>
			{children}
		</AppLayout>
	);
};

export default AppLayoutWrapper;
