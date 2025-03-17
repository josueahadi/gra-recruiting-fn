"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, X } from "lucide-react";
import SectionLayout, {
	SectionItem,
} from "@/components/layout/applicant/section-layout";
import { cn } from "@/lib/utils";

interface Skill {
	id: string;
	name: string;
}

interface LanguageProficiency {
	language: string;
	level: number; // 1-10 scale
}

const SkillsSection = () => {
	const [isEditingTechnical, setIsEditingTechnical] = useState(false);
	const [isEditingLanguages, setIsEditingLanguages] = useState(false);

	const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([
		{ id: "1", name: "Software Engineering" },
		{ id: "2", name: "Software Engineering" },
		{ id: "3", name: "Software Engineering" },
		{ id: "4", name: "Software Engineering" },
		{ id: "5", name: "Software Engineering" },
		{ id: "6", name: "Software Engineering" },
		{ id: "7", name: "Software Engineering" },
	]);

	const [softSkills, setSoftSkills] = useState<Skill[]>([
		{ id: "1", name: "Software Engineering" },
		{ id: "2", name: "Software Engineering" },
		{ id: "3", name: "Software Engineering" },
	]);

	const [languages, setLanguages] = useState<LanguageProficiency[]>([
		{ language: "English", level: 6 },
		{ language: "French", level: 4 },
	]);

	const [newTechnicalSkill, setNewTechnicalSkill] = useState("");
	const [newSoftSkill, setNewSoftSkill] = useState("");

	const handleAddTechnicalSkill = () => {
		if (newTechnicalSkill.trim()) {
			setTechnicalSkills([
				...technicalSkills,
				{ id: Date.now().toString(), name: newTechnicalSkill },
			]);
			setNewTechnicalSkill("");
		}
	};

	const handleAddSoftSkill = () => {
		if (newSoftSkill.trim()) {
			setSoftSkills([
				...softSkills,
				{ id: Date.now().toString(), name: newSoftSkill },
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

	const handleLanguageLevelChange = (language: string, level: number) => {
		setLanguages(
			languages.map((lang) =>
				lang.language === language ? { ...lang, level } : lang,
			),
		);
	};

	return (
		<SectionLayout title="Skills & Competence">
			{/* Skills Section with Technical and Soft Skills */}
			<SectionItem
				title="Skills"
				showEditButton={true}
				onEdit={() => setIsEditingTechnical(!isEditingTechnical)}
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
										isEditingTechnical ? "flex items-center" : "",
									)}
								>
									<span>{skill.name}</span>
									{isEditingTechnical && (
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

						{isEditingTechnical && (
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
										isEditingTechnical ? "flex items-center" : "",
									)}
								>
									<span>{skill.name}</span>
									{isEditingTechnical && (
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

						{isEditingTechnical && (
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

					{isEditingTechnical && (
						<div className="flex justify-end">
							<Button
								onClick={() => setIsEditingTechnical(false)}
								className="bg-primary-base hover:bg-primary-dark"
							>
								<Check className="h-4 w-4 mr-2" />
								Save Changes
							</Button>
						</div>
					)}
				</div>
			</SectionItem>

			{/* Language Section */}
			<SectionItem
				title="Language"
				showEditButton={true}
				onEdit={() => setIsEditingLanguages(!isEditingLanguages)}
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
											onClick={() =>
												setLanguages(
													languages.filter((l) => l.language !== lang.language),
												)
											}
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
								<Button
									variant="outline"
									onClick={() =>
										setLanguages([
											...languages,
											{ language: "New Language", level: 1 },
										])
									}
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Language
								</Button>

								<div className="flex justify-end mt-4">
									<Button
										onClick={() => setIsEditingLanguages(false)}
										className="bg-primary-base hover:bg-primary-dark"
									>
										<Check className="h-4 w-4 mr-2" />
										Save Changes
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</SectionItem>
		</SectionLayout>
	);
};

export default SkillsSection;
