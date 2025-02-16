import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";

interface NavButtonProps {
	label: string;
	isActive: boolean;
	onClick: () => void;
}

interface NavigationProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
}

const navItems = [
	{ label: "Profile", section: "profile" },
	{ label: "Emails", section: "emails" },
	{ label: "Notifications", section: "notifications" },
];

interface ApplicantHeaderProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onClick }) => {
	return (
		<Button
			className={`px-4 py-2 !rounded-xl border-2 !bg-transparent !text-black font-medium hover:!text-secondary-base ${isActive ? "border-secondary-base !bg-transparent" : ""}`}
			onClick={onClick}
		>
			{label}
		</Button>
	);
};

const Navigation: React.FC<NavigationProps> = ({
	activeSection,
	setActiveSection,
}) => {
	return (
		<nav className="flex space-x-4">
			{navItems.map((item) => (
				<NavButton
					key={item.section}
					label={item.label}
					isActive={activeSection === item.section}
					onClick={() => setActiveSection(item.section)}
				/>
			))}
		</nav>
	);
};

export const ApplicantHeader: React.FC<ApplicantHeaderProps> = ({
	activeSection,
	setActiveSection,
}) => {
	const [isEditingName, setIsEditingName] = useState(false);
	const [name, setName] = useState("Ishimwe Kevin");

	return (
		<header className="w-full bg-white border-b">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
						{name.charAt(0)}
					</div>
					<div className="relative flex items-center gap-2">
						{isEditingName ? (
							<div className="flex items-center gap-2">
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="h-8 w-48"
								/>
								<Button
									size="sm"
									onClick={() => setIsEditingName(false)}
									className="h-8"
								>
									Save
								</Button>
							</div>
						) : (
							<>
								<span className="font-medium">{name}</span>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={() => setIsEditingName(true)}
								>
									<Edit2 className="h-4 w-4" />
								</Button>
							</>
						)}
					</div>
				</div>

				<Navigation
					activeSection={activeSection}
					setActiveSection={setActiveSection}
				/>
			</div>
		</header>
	);
};
