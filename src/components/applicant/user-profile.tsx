"use client";

import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Check, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-primary-600 mb-6">
					User Profile
				</h1>

				<div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
					<Avatar className="h-24 w-24 border-4 border-primary-100">
						<AvatarImage src="/images/avatar.jpg" alt="John Doe" />
						<AvatarFallback className="text-xl">JD</AvatarFallback>
					</Avatar>

					<div>
						<h2 className="text-2xl font-bold">
							{personalInfo.firstName} {personalInfo.lastName}
						</h2>
						<p className="text-gray-600">Kigali/Rwanda</p>
					</div>
				</div>
			</div>

			<div className="space-y-8">
				{/* Personal Information */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl text-primary-500">
							Personal Information
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsEditingPersonal(!isEditingPersonal)}
						>
							<Pencil className="h-5 w-5 text-primary-500" />
						</Button>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									First Name
								</Label>
								{isEditingPersonal ? (
									<Input
										name="firstName"
										value={personalInfo.firstName}
										onChange={handlePersonalInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{personalInfo.firstName}</p>
								)}
							</div>

							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									Last Name
								</Label>
								{isEditingPersonal ? (
									<Input
										name="lastName"
										value={personalInfo.lastName}
										onChange={handlePersonalInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{personalInfo.lastName}</p>
								)}
							</div>

							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									Email Address
								</Label>
								{isEditingPersonal ? (
									<Input
										name="email"
										value={personalInfo.email}
										onChange={handlePersonalInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{personalInfo.email}</p>
								)}
							</div>

							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									Phone Number
								</Label>
								{isEditingPersonal ? (
									<Input
										name="phone"
										value={personalInfo.phone}
										onChange={handlePersonalInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{personalInfo.phone}</p>
								)}
							</div>

							<div className="md:col-span-2">
								<Label className="text-sm text-gray-500 mb-1 block">Bio</Label>
								{isEditingPersonal ? (
									<Input
										name="bio"
										value={personalInfo.bio}
										onChange={handlePersonalInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{personalInfo.bio}</p>
								)}
							</div>

							{isEditingPersonal && (
								<div className="md:col-span-2 flex justify-end">
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
					</CardContent>
				</Card>

				{/* Address Information */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl text-primary-500">Address</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsEditingAddress(!isEditingAddress)}
						>
							<Pencil className="h-5 w-5 text-primary-500" />
						</Button>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									Country
								</Label>
								{isEditingAddress ? (
									<Input
										name="country"
										value={addressInfo.country}
										onChange={handleAddressInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{addressInfo.country}</p>
								)}
							</div>

							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									City/State
								</Label>
								{isEditingAddress ? (
									<Input
										name="city"
										value={addressInfo.city}
										onChange={handleAddressInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{addressInfo.city}</p>
								)}
							</div>

							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									Postal Code
								</Label>
								{isEditingAddress ? (
									<Input
										name="postalCode"
										value={addressInfo.postalCode}
										onChange={handleAddressInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{addressInfo.postalCode}</p>
								)}
							</div>

							<div>
								<Label className="text-sm text-gray-500 mb-1 block">
									TAX ID
								</Label>
								{isEditingAddress ? (
									<Input
										name="taxId"
										value={addressInfo.taxId}
										onChange={handleAddressInfoChange}
										className="mb-4"
									/>
								) : (
									<p className="font-medium">{addressInfo.taxId}</p>
								)}
							</div>

							{isEditingAddress && (
								<div className="md:col-span-2 flex justify-end">
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
					</CardContent>
				</Card>
			</div>

			<div className="mt-8">
				<Button
					variant="outline"
					className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
					onClick={() => console.log("Logging out...")}
				>
					<LogOut className="h-4 w-4 mr-2" />
					Logout
				</Button>
			</div>
		</div>
	);
};

export default ProfileSection;
