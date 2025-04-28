import type React from "react";
import { useState, useCallback } from "react";
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
	const [isAdding, setIsAdding] = useState(false);

	const handleAddSkill = useCallback(
		(skillName: string) => {
			if (!skillName.trim()) return;

			setIsAdding(true);

			try {
				onAddSkill(skillName.trim());
				setNewSkill("");
			} catch (error) {
				console.error("Error adding skill:", error);
			} finally {
				setIsAdding(false);
			}
		},
		[onAddSkill],
	);

	const handleInputKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleAddSkill(newSkill);
			}
		},
		[newSkill, handleAddSkill],
	);

	return (
		<div className={className}>
			{title && <h3 className="text-lg font-medium mb-4">{title}</h3>}

			<div className="flex gap-2 mb-4">
				<Input
					value={newSkill}
					onChange={(e) => setNewSkill(e.target.value)}
					placeholder={placeholder}
					onKeyPress={handleInputKeyPress}
					className="flex-grow"
					disabled={isAdding}
				/>
				<Button
					onClick={() => handleAddSkill(newSkill)}
					size="sm"
					className="bg-sky-500 hover:bg-sky-600"
					disabled={isAdding || !newSkill.trim()}
				>
					{isAdding ? (
						<div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
					) : (
						<Plus className="h-4 w-4 mr-1" />
					)}
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
