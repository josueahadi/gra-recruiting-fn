"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, LogOut, Shield, Lock, Trash2, Save } from "lucide-react";

const SettingsSection = () => {
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
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
		console.log("Password change submitted:", passwordForm);
		// Reset form after submission
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
				{/* Password Settings */}
				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Lock className="h-5 w-5 text-primary-500" />
						<CardTitle className="text-xl text-primary-500">
							Change Password
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<form onSubmit={handlePasswordSubmit} className="space-y-4">
							<div>
								<Label htmlFor="currentPassword">Current Password</Label>
								<Input
									id="currentPassword"
									name="currentPassword"
									type="password"
									value={passwordForm.currentPassword}
									onChange={handlePasswordChange}
									className="mt-1"
									required
								/>
							</div>

							<div>
								<Label htmlFor="newPassword">New Password</Label>
								<Input
									id="newPassword"
									name="newPassword"
									type="password"
									value={passwordForm.newPassword}
									onChange={handlePasswordChange}
									className="mt-1"
									required
								/>
								<p className="text-xs text-gray-500 mt-1">
									Password must be at least 8 characters long and include
									uppercase, lowercase, numbers, and special characters.
								</p>
							</div>

							<div>
								<Label htmlFor="confirmPassword">Confirm New Password</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									value={passwordForm.confirmPassword}
									onChange={handlePasswordChange}
									className="mt-1"
									required
								/>
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

				{/* Notification Settings */}
				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Bell className="h-5 w-5 text-primary-500" />
						<CardTitle className="text-xl text-primary-500">
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

				{/* Privacy Settings */}
				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Shield className="h-5 w-5 text-primary-500" />
						<CardTitle className="text-xl text-primary-500">Privacy</CardTitle>
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

				{/* Account Actions */}
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

export default SettingsSection;
