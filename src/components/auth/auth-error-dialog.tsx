"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

export function AuthErrorDialog() {
	const [open, setOpen] = useState(false);
	const authError = useAuthStore(state => state.error);
	const clearError = useAuthStore(state => state.clearError);

	useEffect(() => {
		if (authError) {
			setOpen(true);
		} else {
			setOpen(false);
		}
	}, [authError]);

	const handleDismiss = () => {
		setOpen(false);
		clearError();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Authentication Error</DialogTitle>
					<DialogDescription>
						{authError || "An error occurred during authentication."}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={handleDismiss}>Dismiss</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
