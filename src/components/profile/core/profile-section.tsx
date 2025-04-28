import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Edit1 } from "@/components/icons/edit-1";

interface ProfileSectionProps {
	title: string;
	children: React.ReactNode;
	canEdit?: boolean;
	isEditing: boolean;
	isSubmitting?: boolean;
	onEdit: () => void;
	onSave: () => void;
	onCancel?: () => void;
	className?: string;
	contentClassName?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
	title,
	children,
	canEdit = false,
	isEditing,
	isSubmitting = false,
	onEdit,
	onSave,
	onCancel,
	className,
	contentClassName,
}) => {
	return (
		<div className={cn("mb-8 md:px-10", className)}>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl text-black font-semibold">{title}</h2>

				{canEdit && (
					<button
						type="button"
						className={cn(
							"text-primary-500 hover:text-primary-600",
							(isSubmitting || (isEditing && !onCancel)) &&
								"opacity-50 cursor-not-allowed",
						)}
						aria-label={isEditing ? "Save changes" : `Edit ${title}`}
						onClick={isEditing ? onSave : onEdit}
						disabled={isSubmitting || (isEditing && !onCancel)}
					>
						{isEditing ? (
							isSubmitting ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								<Check className="h-5 w-5" />
							)
						) : (
							<Edit1 className="h-5 w-5" />
						)}
					</button>
				)}
			</div>

			<div className={cn("px-6", contentClassName)}>{children}</div>

			{isEditing && onCancel && (
				<div className="flex justify-end mt-6 px-6">
					<Button
						variant="outline"
						className="mr-4"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						onClick={onSave}
						className="bg-primary-base hover:bg-custom-skyBlue"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							"Save Changes"
						)}
					</Button>
				</div>
			)}
		</div>
	);
};

export default ProfileSection;
