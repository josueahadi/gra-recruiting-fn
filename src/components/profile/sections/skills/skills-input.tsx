import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SkillPill from "./skill-pill";
import type { Skill } from "@/hooks/use-profile";

interface SkillsInputProps {
	skills: Skill[];
	onAddSkill: (skillName: string) => void;
	onRemoveSkill: (id: string) => void;
	title?: string;
	placeholder?: string;
	className?: string;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
	skills,
	onAddSkill,
	onRemoveSkill,
	title = "Skills",
	placeholder = "Enter Skill",
	className,
}) => {
	const [newSkill, setNewSkill] = useState("");

	const handleAddSkill = () => {
		if (newSkill.trim()) {
			onAddSkill(newSkill.trim());
			setNewSkill("");
		}
	};

	const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddSkill();
		}
	};

	return (
		<div className={className}>
			<h3 className="text-lg font-medium mb-4">{title}</h3>

			<div className="flex gap-2 mb-4">
				<Input
					value={newSkill}
					onChange={(e) => setNewSkill(e.target.value)}
					placeholder={placeholder}
					onKeyPress={handleInputKeyPress}
					className="flex-grow"
				/>
				<Button
					onClick={handleAddSkill}
					size="sm"
					className="bg-sky-500 hover:bg-sky-600"
				>
					<Plus className="h-4 w-4 mr-1" />
					Add Skill
				</Button>
			</div>

			<div className="flex flex-wrap gap-2 mt-4">
				{skills.map((skill) => (
					<SkillPill
						key={skill.id}
						skill={skill.name}
						isEditing={true}
						onRemove={() => onRemoveSkill(skill.id)}
					/>
				))}
			</div>
		</div>
	);
};

export default SkillsInput;
