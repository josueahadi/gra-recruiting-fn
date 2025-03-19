"use client";

import React, { useState } from "react";
import { Bell, X, Check, Calendar, FileText, AlertCircle } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationType = "info" | "warning" | "success";

interface Notification {
	id: string;
	title: string;
	message: string;
	time: string;
	read: boolean;
	type: NotificationType;
}

export const Notifications = () => {
	// Example notifications - in a real app these would come from an API/context
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: "1",
			title: "Profile Update",
			message: "Please complete your profile to unlock the assessment",
			time: "10 minutes ago",
			read: false,
			type: "info",
		},
		{
			id: "2",
			title: "Assessment Ready",
			message: "Your assessment is now available to take",
			time: "1 hour ago",
			read: false,
			type: "success",
		},
		{
			id: "3",
			title: "Application Deadline",
			message: "The application deadline is tomorrow at 5 PM",
			time: "5 hours ago",
			read: true,
			type: "warning",
		},
	]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification,
			),
		);
	};

	const markAllAsRead = () => {
		setNotifications(
			notifications.map((notification) => ({ ...notification, read: true })),
		);
	};

	const deleteNotification = (id: string) => {
		setNotifications(
			notifications.filter((notification) => notification.id !== id),
		);
	};

	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case "info":
				return <FileText className="text-blue-500" />;
			case "warning":
				return <AlertCircle className="text-amber-500" />;
			case "success":
				return <Check className="text-green-500" />;
			default:
				return <Bell className="text-gray-500" />;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5 text-gray-600" />
					{unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
					<span className="sr-only">Notifications</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-sm font-medium">Notifications</h2>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={markAllAsRead}
							className="text-xs text-primary-base hover:text-primary-dark"
						>
							Mark all as read
						</Button>
					)}
				</div>

				<div className="max-h-[300px] overflow-y-auto">
					{notifications.length === 0 ? (
						<div className="p-4 text-center text-sm text-gray-500">
							No notifications
						</div>
					) : (
						notifications.map((notification) => (
							<div
								key={notification.id}
								className={cn(
									"flex items-start p-4 border-b last:border-b-0 hover:bg-gray-50",
									!notification.read && "bg-blue-50/30",
								)}
							>
								<div className="mr-3 mt-1">
									{getNotificationIcon(notification.type)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start">
										<h3
											className={cn(
												"text-sm font-medium",
												!notification.read && "font-semibold",
											)}
										>
											{notification.title}
										</h3>
										<div className="flex space-x-1">
											{!notification.read && (
												<Button
													variant="ghost"
													size="icon"
													className="h-5 w-5 text-gray-400 hover:text-gray-600"
													onClick={() => markAsRead(notification.id)}
												>
													<Check className="h-3 w-3" />
													<span className="sr-only">Mark as read</span>
												</Button>
											)}
											<Button
												variant="ghost"
												size="icon"
												className="h-5 w-5 text-gray-400 hover:text-gray-600"
												onClick={() => deleteNotification(notification.id)}
											>
												<X className="h-3 w-3" />
												<span className="sr-only">Delete</span>
											</Button>
										</div>
									</div>
									<p className="text-xs text-gray-600 mt-1">
										{notification.message}
									</p>
									<p className="text-xs text-gray-400 mt-1 flex items-center">
										<Calendar className="h-3 w-3 mr-1" />
										{notification.time}
									</p>
								</div>
							</div>
						))
					)}
				</div>

				<div className="p-2 border-t">
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-xs justify-center text-primary-base hover:text-primary-dark"
					>
						View all notifications
					</Button>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Notifications;
