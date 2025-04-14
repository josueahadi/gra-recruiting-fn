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
import { useAppSelector } from "@/redux/hooks";

export function AuthErrorDialog() {
	const [open, setOpen] = useState(false);
	const authError = useAppSelector((state) => state.auth.error);

	useEffect(() => {
		if (authError) {
			setOpen(true);
		} else {
			setOpen(false);
		}
	}, [authError]);

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
					<Button onClick={() => setOpen(false)}>Dismiss</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
