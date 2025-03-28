import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { Edit1 } from "@/components/icons/edit-1";
import { cn } from "@/lib/utils";

// Shared types for profile data
export interface PersonalInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	bio: string;
}

export interface AddressInfo {
	country: string;
	city: string;
	postalCode: string;
	address: string;
}

interface ProfileInfoSectionProps {
	title: string;
	children: React.ReactNode;
	canEdit?: boolean;
	onEdit?: () => void;
	isEditing?: boolean;
	onSave?: () => void;
	className?: string;
}

/**
 * Reusable section component for profile sections with optional edit functionality
 */
export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
	title,
	children,
	canEdit = false,
	onEdit,
	isEditing = false,
	onSave,
	className,
}) => {
	return (
		<div className={cn("mb-6", className)}>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-primary-base">{title}</h2>
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
			<div className="px-2">{children}</div>
			{isEditing && onSave && (
				<div className="flex justify-end mt-4">
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

interface ProfileFieldProps {
	label: string;
	value: string | undefined;
	isEditing?: boolean;
	name?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	placeholder?: string;
	className?: string;
}

/**
 * Reusable component for displaying a field in either view or edit mode
 */
export const ProfileField: React.FC<ProfileFieldProps> = ({
	label,
	value,
	isEditing = false,
	name,
	onChange,
	type = "text",
	placeholder,
	className,
}) => {
	return (
		<div className={className}>
			<h3 className="text-sm text-custom-darkGray mb-1">{label}</h3>
			{isEditing ? (
				<Input
					name={name}
					value={value || ""}
					onChange={onChange}
					type={type}
					placeholder={placeholder}
					className="mt-1"
				/>
			) : (
				<p className="font-medium">{value || "-"}</p>
			)}
		</div>
	);
};

interface ProfileAvatarProps {
	avatarSrc?: string;
	firstName: string;
	lastName: string;
	canEdit?: boolean;
	onAvatarChange?: (file: File) => void;
	isUploading?: boolean;
}

/**
 * Reusable profile avatar component with optional edit functionality
 */
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
	avatarSrc,
	firstName,
	lastName,
	canEdit = false,
	onAvatarChange,
	isUploading = false,
}) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleAvatarClick = () => {
		if (canEdit) {
			fileInputRef.current?.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && onAvatarChange) {
			onAvatarChange(file);
		}
	};

	return (
		<div className="relative group">
			<Avatar className="h-24 w-24">
				<AvatarImage src={avatarSrc} alt={`${firstName} ${lastName}`} />
				<AvatarFallback className="text-xl">
					{isUploading ? "..." : (firstName?.[0] || "") + (lastName?.[0] || "")}
				</AvatarFallback>
			</Avatar>

			{canEdit && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				<div
					className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
					onClick={handleAvatarClick}
				>
					<Edit1 className="h-8 w-8 text-white" />
				</div>
			)}

			{canEdit && (
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					className="hidden"
				/>
			)}
		</div>
	);
};
