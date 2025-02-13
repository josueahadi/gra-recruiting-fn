import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import SignUpForm from "./signup-form";
import LoginForm from "./login-form";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/error-boundary";
export type AuthMode = "login" | "signup";

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
					<Suspense fallback={<LoadingSpinner />} />
					<VisuallyHidden>
						<h2 id="auth-title">
							{currentMode === "login" ? "Login" : "Sign Up"}
						</h2>
					</VisuallyHidden>

					{currentMode === "login" ? (
						<LoginForm
							onSuccess={onSuccess}
							onError={onError}
							onOpenChange={onOpenChange}
							onModeChange={toggleMode}
						/>
					) : (
						<SignUpForm
							onSuccess={onSuccess}
							onError={onError}
							onOpenChange={onOpenChange}
							onModeChange={toggleMode}
						/>
					)}
				</ErrorBoundary>
			</DialogContent>
		</Dialog>
	);
};
