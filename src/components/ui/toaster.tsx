"use client";

import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";
import { useEffect } from "react";

export function Toaster() {
	const { toasts } = useToast();

	useEffect(() => {
		if (process.env.NODE_ENV === "development" && toasts.length > 0) {
			console.log("[Toaster] Current toasts:", toasts);
		}
	}, [toasts]);

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, ...props }) => (
				<Toast key={id} {...props}>
					<div className="grid gap-1">
						{title && <ToastTitle>{title}</ToastTitle>}
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
					{action}
					<ToastClose />
				</Toast>
			))}
			<ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:flex-col md:max-w-[420px]" />
		</ToastProvider>
	);
}
