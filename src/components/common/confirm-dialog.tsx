"use client";

import type React from "react";
import { AlertCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	type?: "delete" | "warning" | "info";
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	type = "warning",
}) => {
	// Determine button styles based on type
	const getButtonStyles = () => {
		switch (type) {
			case "delete":
				return {
					variant: "destructive" as const,
					className: "bg-red-600 hover:bg-red-700",
				};
			case "warning":
				return {
					variant: "default" as const,
					className: "bg-amber-500 hover:bg-amber-600",
				};
			default:
				return {
					variant: "default" as const,
					className: "",
				};
		}
	};

	const buttonStyles = getButtonStyles();

	// Handle confirm button click
	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader className="flex flex-col items-center gap-2 text-center">
					{type === "delete" && (
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							<AlertCircle className="h-6 w-6 text-red-600" />
						</div>
					)}
					{type === "warning" && (
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
							<AlertCircle className="h-6 w-6 text-amber-600" />
						</div>
					)}
					{type === "info" && (
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
							<AlertCircle className="h-6 w-6 text-blue-600" />
						</div>
					)}
					<DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
				</DialogHeader>

				<div className="py-4 text-center">
					<p className="text-sm text-gray-600">{message}</p>
				</div>

				<DialogFooter className="flex flex-row sm:justify-center gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						className="w-full sm:w-auto"
					>
						{cancelLabel}
					</Button>
					<Button
						variant={buttonStyles.variant}
						onClick={handleConfirm}
						className={`w-full sm:w-auto ${buttonStyles.className}`}
					>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationDialog;
