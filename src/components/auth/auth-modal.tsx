"use client";

import ErrorBoundary from "@/components/error-boundary";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { Suspense } from "react";
export type AuthMode = "login" | "signup";
import AuthForm from "./auth-form";

interface AuthModalProps {
	mode: AuthMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const AuthModal = ({
	mode,
	open,
	onOpenChange,
	onSuccess,
	onError,
}: AuthModalProps) => {
	const [currentMode, setCurrentMode] = useState<AuthMode>(mode);

	const toggleMode = () => {
		setCurrentMode(currentMode === "login" ? "signup" : "login");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-5xl px-10 py-10 overflow-y-auto max-h-[100vh]"
				aria-labelledby="auth-title"
			>
				<ErrorBoundary>
					<VisuallyHidden asChild>
						<DialogTitle id="auth-title">
							{currentMode === "login" ? "Login" : "Sign Up"}
						</DialogTitle>
					</VisuallyHidden>
					<Suspense fallback={<LoadingSpinner />} />
					<VisuallyHidden>
						<h2 id="auth-title">
							{currentMode === "login" ? "Login" : "Sign Up"}
						</h2>
					</VisuallyHidden>

					<AuthForm
						mode={currentMode}
						onSuccess={onSuccess}
						onError={onError}
						onOpenChange={onOpenChange}
						onModeChange={toggleMode}
					/>
				</ErrorBoundary>
			</DialogContent>
		</Dialog>
	);
};
