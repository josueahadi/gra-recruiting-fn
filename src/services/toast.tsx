"use client";

import { Toaster, toast } from "react-hot-toast";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<Toaster
				position="top-center"
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

interface ToastObject {
	title: string;
	description?: string;
	variant?: ToastType;
}

interface ShowToastOptions {
	type?: ToastType;
	duration?: number;
}

export const showToast = (
	message: string | ToastObject,
	options: ShowToastOptions = { type: "default", duration: 5000 },
) => {
	const { type = "default", duration = 5000 } = options;

	if (typeof message === "object" && message !== null) {
		const toastType = message.variant || type;
		const toastContent = (
			<div>
				{message.title && <div className="font-semibold">{message.title}</div>}
				{message.description && (
					<div className="text-sm mt-1">{message.description}</div>
				)}
			</div>
		);

		switch (toastType) {
			case "success":
				return toast.success(toastContent, { duration });
			case "error":
				return toast.error(toastContent, { duration });
			case "loading":
				return toast.loading(toastContent, { duration });
			default:
				return toast(toastContent, { duration });
		}
	}

	// Handle simple string messages
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
