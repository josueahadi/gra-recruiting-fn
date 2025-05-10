import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import type { PasswordUpdateData } from "@/types/profile";

export function usePassword() {
	const updatePassword = useMutation({
		mutationFn: async (data: PasswordUpdateData) => {
			return api.patch("/api/v1/users/update-user-profile", {
				oldPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
		},
		onSuccess: () => {
			showToast({
				title: "Password updated successfully!",
				variant: "success",
			});
		},
		onError: (error: unknown) => {
			const apiError = error as { response?: { data?: { message?: string } } };
			const errorMessage =
				apiError.response?.data?.message || "Failed to update password";

			showToast({
				title: `${errorMessage}. Please try again!`,
				variant: "error",
			});
		},
	});

	return {
		updatePassword: (data: PasswordUpdateData) => updatePassword.mutate(data),
		isLoading: updatePassword.isPending,
		isError: updatePassword.isError,
		error: updatePassword.error,
	};
}
