import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { profileService } from "@/services/profile";
import { showToast } from "@/services/toast";

export function useProfilePicture() {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const queryClient = useQueryClient();
	const user = useAuthStore((state) => state.user);

	const uploadProfilePicture = async (file: File) => {
		if (!user?.id) {
			showToast({
				title: "Error",
				description: "You must be logged in to update your profile picture",
				variant: "error",
			});
			return;
		}

		try {
			setIsUploading(true);
			setUploadProgress(0);

			const profilePictureUrl = await profileService.uploadProfilePicture(
				file,
				user.id,
				(progress) => setUploadProgress(progress),
			);

			// Update the user's profile picture URL in the auth store
			useAuthStore.getState().setUser({
				...user,
				profilePictureUrl,
			});

			// Invalidate relevant queries to refresh the UI
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			queryClient.invalidateQueries({ queryKey: ["basicProfile"] });

			showToast({
				title: "Success",
				description: "Profile picture updated successfully",
				variant: "success",
			});

			return profilePictureUrl;
		} catch (error) {
			showToast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to update profile picture",
				variant: "error",
			});
			throw error;
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	return {
		uploadProfilePicture,
		isUploading,
		uploadProgress,
	};
}
