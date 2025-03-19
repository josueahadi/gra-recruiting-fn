"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import SectionLayout, {
	SectionItem,
} from "@/components/layout/applicant/section-layout";
import { Edit1 } from "../icons/edit-1";

const ProfileSection = () => {
	const [personalInfo, setPersonalInfo] = useState({
		firstName: "John",
		lastName: "Doe",
		email: "johndoe01@gmail.com",
		phone: "+250 787 435 382",
		bio: "Doe",
	});

	const [addressInfo, setAddressInfo] = useState({
		country: "Rwanda",
		city: "Kigali",
		postalCode: "00000",
		taxId: "A54eufds",
	});

	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
	const [isEditingAddress, setIsEditingAddress] = useState(false);
	const [avatarSrc, setAvatarSrc] = useState("/images/avatar.jpg");
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPersonalInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddressInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAddressInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleSavePersonal = () => {
		// Here you would normally call an API to save the changes
		setIsEditingPersonal(false);
	};

	const handleSaveAddress = () => {
		// Here you would normally call an API to save the changes
		setIsEditingAddress(false);
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setIsUploadingAvatar(true);

			// Create a URL for the selected image
			const reader = new FileReader();
			reader.onload = (event) => {
				// Simulate upload delay
				setTimeout(() => {
					setAvatarSrc(event.target?.result as string);
					setIsUploadingAvatar(false);
				}, 1000);
			};
			reader.readAsDataURL(file);
		}
	};

	// User profile top section with avatar and name
	const userProfileTop = (
		<div className="flex flex-col items-center md:flex-row md:gap-6">
			<div className="relative group">
				<Avatar className="h-24 w-24 mb-4 md:mb-0">
					<AvatarImage src={avatarSrc} alt="John Doe" />
					<AvatarFallback className="text-xl">
						{isUploadingAvatar
							? "..."
							: personalInfo.firstName[0] + personalInfo.lastName[0]}
					</AvatarFallback>
				</Avatar>

				{/* Edit overlay with icon */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
					onClick={handleAvatarClick}
				>
					<Edit1 className="h-8 w-8 text-white" />
				</div>

				{/* Hidden file input */}
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleAvatarChange}
					accept="image/*"
					className="hidden"
				/>
			</div>

			<div className="text-center md:text-left">
				<h2 className="text-xl font-semibold">
					{personalInfo.firstName} {personalInfo.lastName}
				</h2>
				<p className="text-custom-darkGray font-regular text-base">
					{addressInfo.city}/{addressInfo.country}
				</p>
			</div>
		</div>
	);

	return (
		<SectionLayout title="User Profile" topSection={userProfileTop}>
			{/* Personal Information Section */}
			<SectionItem
				title="Personal Information"
				showEditButton={true}
				onEdit={() => setIsEditingPersonal(!isEditingPersonal)}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8 ">
					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">First Name</h3>
						{isEditingPersonal ? (
							<Input
								name="firstName"
								value={personalInfo.firstName}
								onChange={handlePersonalInfoChange}
								className="mt-1"
							/>
						) : (
							<p className="font-medium">{personalInfo.firstName}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">Last Name</h3>
						{isEditingPersonal ? (
							<Input
								name="lastName"
								value={personalInfo.lastName}
								onChange={handlePersonalInfoChange}
								className="mt-1"
							/>
						) : (
							<p className="font-medium">{personalInfo.lastName}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">Email Address</h3>
						{isEditingPersonal ? (
							<Input
								name="email"
								value={personalInfo.email}
								onChange={handlePersonalInfoChange}
								className="mt-1"
								type="email"
							/>
						) : (
							<p className="font-medium">{personalInfo.email}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">Phone Number</h3>
						{isEditingPersonal ? (
							<Input
								name="phone"
								value={personalInfo.phone}
								onChange={handlePersonalInfoChange}
								className="mt-1"
								type="tel"
							/>
						) : (
							<p className="font-medium">{personalInfo.phone}</p>
						)}
					</div>

					<div className="md:col-span-2">
						<h3 className="text-sm text-custom-darkGray mb-1">Bio</h3>
						{isEditingPersonal ? (
							<Input
								name="bio"
								value={personalInfo.bio}
								onChange={handlePersonalInfoChange}
								className="mt-1"
							/>
						) : (
							<p className="font-medium">{personalInfo.bio}</p>
						)}
					</div>

					{isEditingPersonal && (
						<div className="md:col-span-2 flex justify-end mt-4">
							<Button
								onClick={handleSavePersonal}
								className="bg-primary-base hover:bg-primary-dark"
							>
								<Check className="h-4 w-4 mr-2" />
								Save Changes
							</Button>
						</div>
					)}
				</div>
			</SectionItem>

			{/* Address Section */}
			<SectionItem
				title="Address"
				showEditButton={true}
				onEdit={() => setIsEditingAddress(!isEditingAddress)}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8">
					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">Country</h3>
						{isEditingAddress ? (
							<Input
								name="country"
								value={addressInfo.country}
								onChange={handleAddressInfoChange}
								className="mt-1"
							/>
						) : (
							<p className="font-medium">{addressInfo.country}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">City/State</h3>
						{isEditingAddress ? (
							<Input
								name="city"
								value={addressInfo.city}
								onChange={handleAddressInfoChange}
								className="mt-1"
							/>
						) : (
							<p className="font-medium">{addressInfo.city}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">Postal Code</h3>
						{isEditingAddress ? (
							<Input
								name="postalCode"
								value={addressInfo.postalCode}
								onChange={handleAddressInfoChange}
								className="mt-1"
							/>
						) : (
							<p className="font-medium">{addressInfo.postalCode}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm text-custom-darkGray mb-1">TAX ID</h3>
						{isEditingAddress ? (
							<Input
								name="taxId"
								value={addressInfo.taxId}
								onChange={handleAddressInfoChange}
								className="mt-1"
							/>
						) : (
							<p className="font-medium">{addressInfo.taxId}</p>
						)}
					</div>

					{isEditingAddress && (
						<div className="md:col-span-2 flex justify-end mt-4">
							<Button
								onClick={handleSaveAddress}
								className="bg-primary-base hover:bg-primary-dark"
							>
								<Check className="h-4 w-4 mr-2" />
								Save Changes
							</Button>
						</div>
					)}
				</div>
			</SectionItem>
		</SectionLayout>
	);
};

export default ProfileSection;
