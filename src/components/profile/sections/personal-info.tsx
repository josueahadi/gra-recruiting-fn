"use client";

import React, { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Edit1 } from "@/components/icons/edit-1";
import type { ProfileInfo } from "@/hooks/use-profile";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoSectionProps {
	personalInfo: ProfileInfo;
	avatarSrc?: string;
	locationLabel?: string;
	canEdit: boolean;
	onInfoUpdate: (info: ProfileInfo) => void;
	onAvatarChange?: (file: File) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
	personalInfo: initialInfo,
	avatarSrc,
	locationLabel,
	canEdit,
	onInfoUpdate,
	onAvatarChange,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [personalInfo, setPersonalInfo] = useState<ProfileInfo>(initialInfo);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleInfoChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setPersonalInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		onInfoUpdate(personalInfo);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setPersonalInfo(initialInfo); // Reset to initial data
	};

	const handleAvatarClick = () => {
		if (canEdit && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		if (e.target.files && e.target.files[0] && onAvatarChange) {
			setIsUploading(true);
			const file = e.target.files[0];

			onAvatarChange(file);

			// In a real implementation, this would be done after upload completes
			setTimeout(() => setIsUploading(false), 1000);
		}
	};

	// User profile header with avatar
	const profileHeader = (
		<div className="md:px-10">
			<div className="flex flex-row items-center gap-6 mb-8 ">
				<div className="relative group flex items-center justify-center">
					<Avatar className="h-24 w-24 mb-4 md:mb-0 my-auto">
						<AvatarImage
							src={avatarSrc}
							alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
						/>
						<AvatarFallback className="text-xl">
							{isUploading
								? "..."
								: personalInfo.firstName[0] + personalInfo.lastName[0]}
						</AvatarFallback>
					</Avatar>

					{canEdit && (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
							onClick={handleAvatarClick}
						>
							<Edit1 className="h-8 w-8 !text-white" />
						</div>
					)}

					<input
						type="file"
						ref={fileInputRef}
						onChange={handleAvatarChange}
						accept="image/*"
						className="hidden"
					/>
				</div>

				<div className="text-left">
					<h2 className="text-xl md:text-2xl font-semibold">
						{personalInfo.firstName} {personalInfo.lastName}
					</h2>
					{locationLabel && (
						<p className="text-sm text-custom-darkGray font-regular">
							{locationLabel}
						</p>
					)}
				</div>
			</div>
			<Separator className="my-8 bg-custom-separator bg-opacity-50" />
		</div>
	);

	return (
		<>
			{profileHeader}

			<ProfileSection
				title="Personal Information"
				canEdit={canEdit}
				isEditing={isEditing}
				onEdit={handleEdit}
				onSave={handleSave}
				onCancel={handleCancel}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8 md:px-4">
					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							First Name
						</h3>
						{isEditing ? (
							<Input
								name="firstName"
								value={personalInfo.firstName}
								onChange={handleInfoChange}
								className="mt-1 border-gray-400/95"
							/>
						) : (
							<p className="font-normal">{personalInfo.firstName}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Last Name
						</h3>
						{isEditing ? (
							<Input
								name="lastName"
								value={personalInfo.lastName}
								onChange={handleInfoChange}
								className="mt-1 border-gray-400/95"
							/>
						) : (
							<p className="font-normal">{personalInfo.lastName}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Email Address
						</h3>
						{isEditing ? (
							<Input
								name="email"
								value={personalInfo.email}
								onChange={handleInfoChange}
								className="mt-1 border-gray-400/95"
								type="email"
							/>
						) : (
							<p className="font-normal">{personalInfo.email}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Phone Number
						</h3>
						{isEditing ? (
							<Input
								name="phone"
								value={personalInfo.phone}
								onChange={handleInfoChange}
								className="mt-1 border-gray-400/95"
								type="tel"
							/>
						) : (
							<p className="font-normal">{personalInfo.phone}</p>
						)}
					</div>

					<div className="md:col-span-2">
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Bio
						</h3>
						{isEditing ? (
							<Textarea
								name="bio"
								value={personalInfo.bio}
								onChange={handleInfoChange}
								className="mt-1 border-gray-400/95"
								rows={3}
								style={{ resize: "none" }}
							/>
						) : (
							<p className="font-normal">{personalInfo.bio}</p>
						)}
					</div>
				</div>
			</ProfileSection>
		</>
	);
};

export default PersonalInfoSection;
