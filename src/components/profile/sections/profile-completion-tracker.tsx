"use client";

// import type { FC } from 'react';
import { useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";

/**
 * Component that monitors profile completion and updates local storage
 * and URL parameters to communicate with other components
 */
export const ProfileCompletionTracker: React.FC = () => {
	const { profileData, isLoading, getProfileCompletion } = useProfile({
		userType: "applicant",
	});

	useEffect(() => {
		if (isLoading || !profileData) return;

		// Calculate profile completion percentage
		const completion = getProfileCompletion();

		// Update localStorage
		localStorage.setItem("profileCompletion", String(completion));

		// Update URL param for other components to detect
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.set("completion", String(completion));
			window.history.replaceState({}, "", url.toString());
		}

		// Log for debugging
		console.log(
			`[ProfileCompletionTracker] Profile completion: ${completion}%`,
		);
	}, [profileData, isLoading, getProfileCompletion]);

	// This is a utility component that doesn't render anything visible
	return null;
};

export default ProfileCompletionTracker;
