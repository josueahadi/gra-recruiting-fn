"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	Bell,
	Eye,
	EyeOff,
	Lock,
	LogOut,
	Save,
	Shield,
	Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import toast from "react-hot-toast";

const ApplicantSettingsSection = () => {
	const { updatePassword } = useProfile({ userType: "applicant" });

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	// Add state for password visibility
	const [showPasswords, setShowPasswords] = useState({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
	});

	const [notificationSettings, setNotificationSettings] = useState({
		emailAlerts: true,
		applicationUpdates: true,
		newOpportunities: true,
		marketingEmails: false,
	});

	const [privacySettings, setPrivacySettings] = useState({
		profileVisibility: true,
		showContactInfo: true,
		allowRecruiters: true,
	});

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordForm({
			...passwordForm,
			[name]: value,
		});
	};

	// Add toggle function for password visibility
	const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
		setShowPasswords({
			...showPasswords,
			[field]: !showPasswords[field],
		});
	};

	const handleNotificationToggle = (
		setting: keyof typeof notificationSettings,
	) => {
		setNotificationSettings({
			...notificationSettings,
			[setting]: !notificationSettings[setting],
		});
	};

	const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
		setPrivacySettings({
			...privacySettings,
			[setting]: !privacySettings[setting],
		});
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error("New password and confirmation don't match");
			return;
		}

		updatePassword({
			currentPassword: passwordForm.currentPassword,
			newPassword: passwordForm.newPassword,
			confirmPassword: passwordForm.confirmPassword,
		});

		setPasswordForm({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-primary-600">
					Account Settings
				</h1>
			</div>

			<div className="space-y-8">
				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Lock className="h-5 w-5 text-primary-shades-500" />
						<CardTitle className="text-xl text-primary-shades-500">
							Change Password
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<form onSubmit={handlePasswordSubmit} className="space-y-4">
							<div>
								<Label htmlFor="currentPassword">Current Password</Label>
								<div className="relative">
									<Input
										id="currentPassword"
										name="currentPassword"
										type={showPasswords.currentPassword ? "text" : "password"}
										value={passwordForm.currentPassword}
										onChange={handlePasswordChange}
										className="mt-1"
										required
									/>
									<button
										type="button"
										onClick={() => togglePasswordVisibility("currentPassword")}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
										aria-label={
											showPasswords.currentPassword
												? "Hide password"
												: "Show password"
										}
									>
										{showPasswords.currentPassword ? (
											<EyeOff size={20} />
										) : (
											<Eye size={20} />
										)}
									</button>
								</div>
							</div>

							<div>
								<Label htmlFor="newPassword">New Password</Label>
								<div className="relative">
									<Input
										id="newPassword"
										name="newPassword"
										type={showPasswords.newPassword ? "text" : "password"}
										value={passwordForm.newPassword}
										onChange={handlePasswordChange}
										className="mt-1"
										required
									/>
									<button
										type="button"
										onClick={() => togglePasswordVisibility("newPassword")}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
										aria-label={
											showPasswords.newPassword
												? "Hide password"
												: "Show password"
										}
									>
										{showPasswords.newPassword ? (
											<EyeOff size={20} />
										) : (
											<Eye size={20} />
										)}
									</button>
								</div>
								<p className="text-xs text-gray-500 mt-1">
									Password must be at least 8 characters long and include
									uppercase, lowercase, numbers, and special characters.
								</p>
							</div>

							<div>
								<Label htmlFor="confirmPassword">Confirm New Password</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type={showPasswords.confirmPassword ? "text" : "password"}
										value={passwordForm.confirmPassword}
										onChange={handlePasswordChange}
										className="mt-1"
										required
									/>
									<button
										type="button"
										onClick={() => togglePasswordVisibility("confirmPassword")}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
										aria-label={
											showPasswords.confirmPassword
												? "Hide password"
												: "Show password"
										}
									>
										{showPasswords.confirmPassword ? (
											<EyeOff size={20} />
										) : (
											<Eye size={20} />
										)}
									</button>
								</div>
							</div>

							<Button
								type="submit"
								className="bg-primary-base hover:bg-primary-dark"
							>
								<Save className="h-4 w-4 mr-2" />
								Update Password
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Bell className="h-5 w-5 text-primary-shades-500" />
						<CardTitle className="text-xl text-primary-shades-500">
							Notifications
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Email Alerts</h3>
									<p className="text-sm text-gray-500">
										Receive important account updates via email
									</p>
								</div>
								<Switch
									checked={notificationSettings.emailAlerts}
									onCheckedChange={() =>
										handleNotificationToggle("emailAlerts")
									}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Application Updates</h3>
									<p className="text-sm text-gray-500">
										Notifications about your job applications
									</p>
								</div>
								<Switch
									checked={notificationSettings.applicationUpdates}
									onCheckedChange={() =>
										handleNotificationToggle("applicationUpdates")
									}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">New Opportunities</h3>
									<p className="text-sm text-gray-500">
										Get notified about new job opportunities matching your
										profile
									</p>
								</div>
								<Switch
									checked={notificationSettings.newOpportunities}
									onCheckedChange={() =>
										handleNotificationToggle("newOpportunities")
									}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Marketing Emails</h3>
									<p className="text-sm text-gray-500">
										Receive promotional content and newsletters
									</p>
								</div>
								<Switch
									checked={notificationSettings.marketingEmails}
									onCheckedChange={() =>
										handleNotificationToggle("marketingEmails")
									}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Shield className="h-5 w-5 text-primary-shades-500" />
						<CardTitle className="text-xl text-primary-shades-500">
							Privacy
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Profile Visibility</h3>
									<p className="text-sm text-gray-500">
										Make your profile visible to employers
									</p>
								</div>
								<Switch
									checked={privacySettings.profileVisibility}
									onCheckedChange={() =>
										handlePrivacyToggle("profileVisibility")
									}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Show Contact Information</h3>
									<p className="text-sm text-gray-500">
										Allow employers to see your contact details
									</p>
								</div>
								<Switch
									checked={privacySettings.showContactInfo}
									onCheckedChange={() => handlePrivacyToggle("showContactInfo")}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">
										Allow Recruiters to Contact You
									</h3>
									<p className="text-sm text-gray-500">
										Receive messages from recruiters about job opportunities
									</p>
								</div>
								<Switch
									checked={privacySettings.allowRecruiters}
									onCheckedChange={() => handlePrivacyToggle("allowRecruiters")}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-red-200">
					<CardHeader className="flex flex-row items-center space-x-2">
						<Trash2 className="h-5 w-5 text-red-500" />
						<CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
					</CardHeader>

					<Separator className="mb-4 bg-red-100" />

					<CardContent>
						<div className="space-y-6">
							<div>
								<h3 className="font-medium text-gray-900">
									Log Out From All Devices
								</h3>
								<p className="text-sm text-gray-500 mb-3">
									This will log you out from all devices where you&apos;re
									currently signed in
								</p>
								<Button
									variant="outline"
									className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
								>
									<LogOut className="h-4 w-4 mr-2" />
									Log Out Everywhere
								</Button>
							</div>

							<Separator />

							<div>
								<h3 className="font-medium text-gray-900">Delete Account</h3>
								<p className="text-sm text-gray-500 mb-3">
									Permanently delete your account and all associated data. This
									action cannot be undone.
								</p>
								<Button
									variant="outline"
									className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete Account
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ApplicantSettingsSection;
