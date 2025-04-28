import type React from "react";
import { memo } from "react";
import SkillPill from "./skill-pill";
import type { Skill } from "@/hooks/use-profile";

interface SkillsDisplayProps {
	skills: Skill[];
	title?: string;
	emptyMessage?: string;
	className?: string;
}

const SkillsDisplay: React.FC<SkillsDisplayProps> = memo(
	({
		skills,
		title = "Skills",
		emptyMessage = "No skills added yet",
		className,
	}) => {
		if (!Array.isArray(skills)) {
			console.error("Skills is not an array:", skills);
			return (
				<div className={className}>
					<h3 className="text-lg font-medium mb-4">{title}</h3>
					<p className="text-red-500 italic">Error loading skills</p>
				</div>
			);
		}

		if (skills.length === 0) {
			return (
				<div className={className}>
					{title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
					<p className="text-gray-500 italic">{emptyMessage}</p>
				</div>
			);
		}

		return (
			<div className={className}>
				{title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
				<div className="flex flex-wrap gap-2">
					{skills.map((skill) => (
						<SkillPill
							key={skill.id}
							skill={skill.name}
							className="bg-slate-500"
						/>
					))}
				</div>
			</div>
		);
	},
);

// Display name for debugging
SkillsDisplay.displayName = "SkillsDisplay";

export default SkillsDisplay;
