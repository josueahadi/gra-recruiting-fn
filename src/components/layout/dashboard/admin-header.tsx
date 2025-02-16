"use client";

import { signOut } from "next-auth/react";

interface AdminHeaderProps {
	title?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
	title = "Admin Dashboard",
}) => {
	const handleLogout = async () => {
		console.log("Logging out...");
	};

	return (
		<header className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
					</div>
					<div className="flex items-center space-x-4">
						<button
							type="submit"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default AdminHeader;
