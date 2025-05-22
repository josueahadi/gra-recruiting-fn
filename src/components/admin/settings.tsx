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
	Trash2,
	UserCog,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import toast from "react-hot-toast";
import type React from "react";

const AdminSettingsSection = () => {
	const { user, signOut } = useAuth();
	const { updatePassword } = useProfile({ userType: "admin" });

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

	const [adminSettings, setAdminSettings] = useState({
		emailNotifications: true,
		applicationUpdates: true,
		securityAlerts: true,
		autoApproveApplicants: false,
	});

	const [systemSettings, setSystemSettings] = useState({
		maintenanceMode: false,
		debugMode: false,
		allowNewRegistrations: true,
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

	const handleAdminToggle = (setting: keyof typeof adminSettings) => {
		setAdminSettings({
			...adminSettings,
			[setting]: !adminSettings[setting],
		});
	};

	const handleSystemToggle = (setting: keyof typeof systemSettings) => {
		setSystemSettings({
			...systemSettings,
			[setting]: !systemSettings[setting],
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

	const handleLogoutAllDevices = () => {
		// Implementation would go here
		console.log("Logging out from all devices");
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-primary-600">
					Admin Settings
				</h1>
				{user && (
					<p className="text-gray-500 mt-1">
						Logged in as {user.firstName} {user.lastName} ({user.email})
					</p>
				)}
			</div>

			<div className="space-y-8">
				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Lock className="h-5 w-5 text-primary-shades-500" />
						<CardTitle className="text-xl text-primary-shades-500">
							Security
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
									Password must be at least 8 characters long with a mix of
									letters, numbers, and symbols.
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
							Admin Notifications
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Email Notifications</h3>
									<p className="text-sm text-gray-500">
										Receive important system updates via email
									</p>
								</div>
								<Switch
									checked={adminSettings.emailNotifications}
									onCheckedChange={() =>
										handleAdminToggle("emailNotifications")
									}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Application Updates</h3>
									<p className="text-sm text-gray-500">
										Get notified when new applications are submitted
									</p>
								</div>
								<Switch
									checked={adminSettings.applicationUpdates}
									onCheckedChange={() =>
										handleAdminToggle("applicationUpdates")
									}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Security Alerts</h3>
									<p className="text-sm text-gray-500">
										Get notified about suspicious login attempts
									</p>
								</div>
								<Switch
									checked={adminSettings.securityAlerts}
									onCheckedChange={() => handleAdminToggle("securityAlerts")}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Auto-Approve Applicants</h3>
									<p className="text-sm text-gray-500">
										Automatically approve new applicant registrations
									</p>
								</div>
								<Switch
									checked={adminSettings.autoApproveApplicants}
									onCheckedChange={() =>
										handleAdminToggle("autoApproveApplicants")
									}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<UserCog className="h-5 w-5 text-primary-shades-500" />
						<CardTitle className="text-xl text-primary-shades-500">
							System Settings
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Maintenance Mode</h3>
									<p className="text-sm text-gray-500">
										Temporarily disable the site for maintenance
									</p>
								</div>
								<Switch
									checked={systemSettings.maintenanceMode}
									onCheckedChange={() => handleSystemToggle("maintenanceMode")}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Debug Mode</h3>
									<p className="text-sm text-gray-500">
										Enable detailed error messages and logging
									</p>
								</div>
								<Switch
									checked={systemSettings.debugMode}
									onCheckedChange={() => handleSystemToggle("debugMode")}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Allow New Registrations</h3>
									<p className="text-sm text-gray-500">
										Enable new applicant registrations
									</p>
								</div>
								<Switch
									checked={systemSettings.allowNewRegistrations}
									onCheckedChange={() =>
										handleSystemToggle("allowNewRegistrations")
									}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-red-200">
					<CardHeader className="flex flex-row items-center space-x-2">
						<Trash2 className="h-5 w-5 text-red-500" />
						<CardTitle className="text-xl text-red-500">
							Account Actions
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4 bg-red-100" />

					<CardContent>
						<div className="space-y-6">
							<div>
								<h3 className="font-medium text-gray-900">
									Log Out From All Devices
								</h3>
								<p className="text-sm text-gray-500 mb-3">
									This will end all active sessions for your account
								</p>
								<Button
									variant="outline"
									className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
									onClick={handleLogoutAllDevices}
								>
									<LogOut className="h-4 w-4 mr-2" />
									Log Out Everywhere
								</Button>
							</div>

							<Separator />

							<div>
								<h3 className="font-medium text-gray-900">Sign Out</h3>
								<p className="text-sm text-gray-500 mb-3">
									Log out from your current session
								</p>
								<Button
									variant="outline"
									className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
									onClick={signOut}
								>
									<LogOut className="h-4 w-4 mr-2" />
									Sign Out
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminSettingsSection;
