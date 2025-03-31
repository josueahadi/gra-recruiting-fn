import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Edit1 } from "@/components/icons/edit-1";

interface ProfileSectionProps {
	title: string;
	children: React.ReactNode;
	canEdit?: boolean;
	isEditing: boolean;
	onEdit: () => void;
	onSave: () => void;
	className?: string;
	contentClassName?: string;
}

/**
 * Consistent section wrapper for profile sections with edit functionality
 */
const ProfileSection: React.FC<ProfileSectionProps> = ({
	title,
	children,
	canEdit = false,
	isEditing,
	onEdit,
	onSave,
	className,
	contentClassName,
}) => {
	return (
		<div className={cn("mb-8 px-2 md:px-4", className)}>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl text-primary-base font-semibold">{title}</h2>

				{canEdit && (
					<button
						type="button"
						className="text-primary-500 hover:text-primary-600"
						aria-label={isEditing ? "Save changes" : `Edit ${title}`}
						onClick={isEditing ? onSave : onEdit}
					>
						{isEditing ? (
							<Check className="h-5 w-5" />
						) : (
							<Edit1 className="h-5 w-5" />
						)}
					</button>
				)}
			</div>

			<div className={cn("px-6", contentClassName)}>{children}</div>

			{isEditing && (
				<div className="flex justify-end mt-6 px-6">
					<Button
						onClick={onSave}
						className="bg-primary-base hover:bg-primary-dark"
					>
						<Check className="h-4 w-4 mr-2" />
						Save Changes
					</Button>
				</div>
			)}
		</div>
	);
};

export default ProfileSection;
