"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, Check, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

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
	const [isEditingSoft, setIsEditingSoft] = useState(false);
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
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-primary-600">
					Skills & Competence
				</h1>
			</div>

			<div className="space-y-8">
				{/* Technical Skills */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl text-primary-500">Skills</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsEditingTechnical(!isEditingTechnical)}
						>
							<Pencil className="h-5 w-5 text-primary-500" />
						</Button>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<h3 className="text-lg font-medium mb-4">Technical Skills</h3>

						{isEditingTechnical ? (
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2">
									{technicalSkills.map((skill) => (
										<div
											key={skill.id}
											className="flex items-center bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full"
										>
											<span>{skill.name}</span>
											<button
												type="button"
												onClick={() => handleRemoveTechnicalSkill(skill.id)}
												className="ml-2 text-primary-500 hover:text-primary-700"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>

								<div className="flex items-center gap-2">
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

								<div className="flex justify-end">
									<Button
										onClick={() => setIsEditingTechnical(false)}
										className="bg-primary-base hover:bg-primary-dark"
									>
										<Check className="h-4 w-4 mr-2" />
										Save Changes
									</Button>
								</div>
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{technicalSkills.map((skill) => (
									<span
										key={skill.id}
										className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full"
									>
										{skill.name}
									</span>
								))}
							</div>
						)}

						<h3 className="text-lg font-medium mt-8 mb-4">Soft Skills</h3>

						{isEditingSoft ? (
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2">
									{softSkills.map((skill) => (
										<div
											key={skill.id}
											className="flex items-center bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full"
										>
											<span>{skill.name}</span>
											<button
												type="button"
												onClick={() => handleRemoveSoftSkill(skill.id)}
												className="ml-2 text-primary-500 hover:text-primary-700"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>

								<div className="flex items-center gap-2">
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

								<div className="flex justify-end">
									<Button
										onClick={() => setIsEditingSoft(false)}
										className="bg-primary-base hover:bg-primary-dark"
									>
										<Check className="h-4 w-4 mr-2" />
										Save Changes
									</Button>
								</div>
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{softSkills.map((skill) => (
									<span
										key={skill.id}
										className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full"
									>
										{skill.name}
									</span>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Language Proficiency */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl text-primary-500">Language</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsEditingLanguages(!isEditingLanguages)}
						>
							<Pencil className="h-5 w-5 text-primary-500" />
						</Button>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<h3 className="text-lg font-medium mb-6">Language Proficiency</h3>

						<div className="space-y-8">
							{languages.map((lang, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={index} className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="font-medium">{lang.language}</span>
										{isEditingLanguages && (
											<Button
												variant="ghost"
												size="sm"
												className="text-red-500 hover:text-red-700 p-0 h-auto"
												onClick={() =>
													setLanguages(languages.filter((_, i) => i !== index))
												}
											>
												Remove
											</Button>
										)}
									</div>

									<div className="flex items-center gap-4">
										<div className="flex-1 flex items-center gap-1">
											{Array.from({ length: 10 }).map((_, i) => (
												// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
													key={i}
													className={`h-4 w-4 rounded-full ${
														i < lang.level ? "bg-primary-500" : "bg-gray-200"
													} ${isEditingLanguages ? "cursor-pointer" : ""}`}
													onClick={() =>
														isEditingLanguages &&
														handleLanguageLevelChange(lang.language, i + 1)
													}
												/>
											))}
										</div>

										<div className="flex justify-between text-xs text-gray-500 w-full max-w-[180px]">
											<span>Beginner</span>
											<span>Intermediate</span>
											<span>Expert</span>
										</div>
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
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default SkillsSection;
