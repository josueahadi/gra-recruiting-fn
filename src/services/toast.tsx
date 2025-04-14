"use client";

import { Toaster, toast } from "react-hot-toast";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 5000,
					style: {
						background: "#fff",
						color: "#333",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						borderRadius: "8px",
						padding: "12px 20px",
					},
					success: {
						style: {
							borderLeft: "4px solid #16a34a",
						},
						iconTheme: {
							primary: "#16a34a",
							secondary: "#fff",
						},
					},
					error: {
						style: {
							borderLeft: "4px solid #dc2626",
						},
						iconTheme: {
							primary: "#dc2626",
							secondary: "#fff",
						},
					},
				}}
			/>
		</>
	);
};

type ToastType = "success" | "error" | "loading" | "default";

interface ShowToastOptions {
	type?: ToastType;
	duration?: number;
}

export const showToast = (
	message: string,
	options: ShowToastOptions = { type: "default", duration: 5000 },
) => {
	const { type = "default", duration = 5000 } = options;

	switch (type) {
		case "success":
			return toast.success(message, { duration });
		case "error":
			return toast.error(message, { duration });
		case "loading":
			return toast.loading(message, { duration });
		default:
			return toast(message, { duration });
	}
};

export const dismissToast = (toastId: string) => {
	toast.dismiss(toastId);
};

export { toast };
