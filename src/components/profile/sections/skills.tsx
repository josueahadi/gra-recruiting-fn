import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import type { Skill, LanguageProficiency } from "@/hooks/use-profile";

interface SkillsSectionProps {
	technicalSkills: Skill[];
	softSkills: Skill[];
	languages: LanguageProficiency[];
	canEdit: boolean;
	onUpdate: (data: {
		technical: Skill[];
		soft: Skill[];
		languages: LanguageProficiency[];
	}) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
	technicalSkills: initialTechnical,
	softSkills: initialSoft,
	languages: initialLanguages,
	canEdit,
	onUpdate,
}) => {
	const [isEditingSkills, setIsEditingSkills] = useState(false);
	const [isEditingLanguages, setIsEditingLanguages] = useState(false);

	const [technicalSkills, setTechnicalSkills] =
		useState<Skill[]>(initialTechnical);
	const [softSkills, setSoftSkills] = useState<Skill[]>(initialSoft);
	const [languages, setLanguages] =
		useState<LanguageProficiency[]>(initialLanguages);

	const [newTechnicalSkill, setNewTechnicalSkill] = useState("");
	const [newSoftSkill, setNewSoftSkill] = useState("");

	// Technical and soft skills handling
	const handleEditSkills = () => {
		setIsEditingSkills(true);
	};

	const handleSaveSkills = () => {
		setIsEditingSkills(false);
		onUpdate({
			technical: technicalSkills,
			soft: softSkills,
			languages,
		});
	};

	const handleAddTechnicalSkill = () => {
		if (newTechnicalSkill.trim()) {
			setTechnicalSkills([
				...technicalSkills,
				{ id: Date.now().toString(), name: newTechnicalSkill.trim() },
			]);
			setNewTechnicalSkill("");
		}
	};

	const handleAddSoftSkill = () => {
		if (newSoftSkill.trim()) {
			setSoftSkills([
				...softSkills,
				{ id: Date.now().toString(), name: newSoftSkill.trim() },
			]);
			setNewSoftSkill("");
		}
	};
	const handleRemoveTechnicalSkill = (id: string) => {
		setTechnicalSkills(technicalSkills.filter((skill) => skill.id !== id));
	};

	const handleRemoveSoftSkill = (id: string) => {
		setSoftSkills(softSkills.filter((skill) => skill.id !== id));
	};

	// Language proficiency handling
	const handleEditLanguages = () => {
		setIsEditingLanguages(true);
	};

	const handleSaveLanguages = () => {
		setIsEditingLanguages(false);
		onUpdate({
			technical: technicalSkills,
			soft: softSkills,
			languages,
		});
	};

	const handleLanguageLevelChange = (language: string, level: number) => {
		setLanguages(
			languages.map((lang) =>
				lang.language === language ? { ...lang, level } : lang,
			),
		);
	};

	const handleAddLanguage = () => {
		setLanguages([...languages, { language: "New Language", level: 1 }]);
	};

	const handleRemoveLanguage = (language: string) => {
		setLanguages(languages.filter((lang) => lang.language !== language));
	};

	return (
		<>
			<ProfileSection
				title="Skills"
				canEdit={canEdit}
				isEditing={isEditingSkills}
				onEdit={handleEditSkills}
				onSave={handleSaveSkills}
			>
				<div className="space-y-8">
					<div>
						<h3 className="text-lg font-medium mb-4">Technical Skills</h3>
						<div className="flex flex-wrap gap-2">
							{technicalSkills.map((skill) => (
								<div
									key={skill.id}
									className={cn(
										"bg-primary-base text-white px-5 py-2 rounded-full",
										isEditingSkills ? "flex items-center" : "",
									)}
								>
									<span>{skill.name}</span>
									{isEditingSkills && (
										<button
											type="button"
											onClick={() => handleRemoveTechnicalSkill(skill.id)}
											className="ml-2 text-white hover:text-red-100"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							))}
						</div>

						{isEditingSkills && (
							<div className="flex items-center gap-2 mt-4">
								<Input
									value={newTechnicalSkill}
									onChange={(e) => setNewTechnicalSkill(e.target.value)}
									placeholder="Add a new technical skill"
									className="max-w-xs"
								/>
								<Button onClick={handleAddTechnicalSkill} size="sm">
									<Plus className="h-4 w-4 mr-1" />
									Add
								</Button>
							</div>
						)}
					</div>

					<div>
						<h3 className="text-lg font-medium mb-4">Soft Skills</h3>
						<div className="flex flex-wrap gap-2">
							{softSkills.map((skill) => (
								<div
									key={skill.id}
									className={cn(
										"bg-primary-base text-white px-5 py-2 rounded-full",
										isEditingSkills ? "flex items-center" : "",
									)}
								>
									<span>{skill.name}</span>
									{isEditingSkills && (
										<button
											type="button"
											onClick={() => handleRemoveSoftSkill(skill.id)}
											className="ml-2 text-white hover:text-red-100"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							))}
						</div>

						{isEditingSkills && (
							<div className="flex items-center gap-2 mt-4">
								<Input
									value={newSoftSkill}
									onChange={(e) => setNewSoftSkill(e.target.value)}
									placeholder="Add a new soft skill"
									className="max-w-xs"
								/>
								<Button onClick={handleAddSoftSkill} size="sm">
									<Plus className="h-4 w-4 mr-1" />
									Add
								</Button>
							</div>
						)}
					</div>
				</div>
			</ProfileSection>

			<ProfileSection
				title="Language"
				canEdit={canEdit}
				isEditing={isEditingLanguages}
				onEdit={handleEditLanguages}
				onSave={handleSaveLanguages}
			>
				<div>
					<h3 className="text-lg font-medium mb-6">Language Proficiency</h3>

					<div className="space-y-8">
						{languages.map((lang) => (
							<div key={lang.language} className="space-y-2 max-w-64">
								<div className="flex justify-between items-center">
									<span className="font-medium">{lang.language}</span>
									{isEditingLanguages && (
										<Button
											variant="ghost"
											size="sm"
											className="text-red-500 hover:text-red-700 p-0 h-auto"
											onClick={() => handleRemoveLanguage(lang.language)}
										>
											Remove
										</Button>
									)}
								</div>

								<div className="flex items-center mb-2">
									{Array.from({ length: 10 }).map((_, i) => (
										// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={i}
											className={cn(
												"h-5 w-5 rounded-full mx-0.5",
												i < lang.level ? "bg-primary-base" : "bg-gray-200",
												isEditingLanguages ? "cursor-pointer" : "",
											)}
											onClick={() =>
												isEditingLanguages &&
												handleLanguageLevelChange(lang.language, i + 1)
											}
										/>
									))}
								</div>

								<div className="flex justify-between text-xs text-gray-500 w-full">
									<span>Beginner</span>
									<span>Intermediate</span>
									<span>Expert</span>
								</div>
							</div>
						))}

						{isEditingLanguages && (
							<div className="pt-4">
								<Button variant="outline" onClick={handleAddLanguage}>
									<Plus className="h-4 w-4 mr-2" />
									Add Language
								</Button>
							</div>
						)}
					</div>
				</div>
			</ProfileSection>
		</>
	);
};

export default SkillsSection;
