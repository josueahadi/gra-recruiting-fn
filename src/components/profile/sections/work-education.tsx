import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import type { Education, WorkExperience } from "@/hooks/use-profile";
import { Separator } from "@/components/ui/separator";

interface WorkEducationSectionProps {
	education: Education[];
	experience: WorkExperience[];
	canEdit: boolean;
	onUpdate: (data: {
		education: Education[];
		experience: WorkExperience[];
	}) => void;
}

const WorkEducationSection: React.FC<WorkEducationSectionProps> = ({
	education: initialEducation,
	experience: initialExperience,
	canEdit,
	onUpdate,
}) => {
	const [isEditingEducation, setIsEditingEducation] = useState(false);
	const [isEditingWork, setIsEditingWork] = useState(false);

	const [education, setEducation] = useState<Education[]>(initialEducation);
	const [experience, setExperience] =
		useState<WorkExperience[]>(initialExperience);

	const [newEducation, setNewEducation] = useState<Education>({
		id: "",
		institution: "",
		degree: "",
		program: "",
		startYear: "",
		endYear: "",
	});

	const [newExperience, setNewExperience] = useState<WorkExperience>({
		id: "",
		company: "",
		role: "",
		duration: "",
		responsibilities: "",
	});

	// Work experience handlers
	const handleEditWork = () => {
		setIsEditingWork(true);
	};

	const handleSaveWork = () => {
		setIsEditingWork(false);
		onUpdate({
			education,
			experience,
		});
	};

	const handleExperienceChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		id: string,
	) => {
		const { name, value } = e.target;
		setExperience(
			experience.map((work) =>
				work.id === id ? { ...work, [name]: value } : work,
			),
		);
	};

	const handleNewExperienceChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const { name, value } = e.target;
		setNewExperience({ ...newExperience, [name]: value });
	};

	const handleAddExperience = () => {
		if (newExperience.company && newExperience.role) {
			setExperience([
				...experience,
				{ ...newExperience, id: Date.now().toString() },
			]);
			setNewExperience({
				id: "",
				company: "",
				role: "",
				duration: "",
				responsibilities: "",
			});
		}
	};

	const handleRemoveExperience = (id: string) => {
		setExperience(experience.filter((work) => work.id !== id));
	};

	// Education handlers
	const handleEditEducation = () => {
		setIsEditingEducation(true);
	};

	const handleSaveEducation = () => {
		setIsEditingEducation(false);
		onUpdate({
			education,
			experience,
		});
	};

	const handleEducationChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		id: string,
	) => {
		const { name, value } = e.target;
		setEducation(
			education.map((edu) => (edu.id === id ? { ...edu, [name]: value } : edu)),
		);
	};

	const handleYearChange = (id: string, value: string) => {
		const years = value.split("-");

		setEducation(
			education.map((edu) =>
				edu.id === id
					? {
							...edu,
							startYear: years[0] || "",
							endYear: years[1] || "",
						}
					: edu,
			),
		);
	};

	const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewEducation({ ...newEducation, [name]: value });
	};

	const handleNewYearChange = (value: string) => {
		const years = value.split("-");
		setNewEducation({
			...newEducation,
			startYear: years[0] || "",
			endYear: years[1] || "",
		});
	};

	const handleAddEducation = () => {
		if (newEducation.institution && newEducation.degree) {
			setEducation([
				...education,
				{ ...newEducation, id: Date.now().toString() },
			]);
			setNewEducation({
				id: "",
				institution: "",
				degree: "",
				program: "",
				startYear: "",
				endYear: "",
			});
		}
	};

	const handleRemoveEducation = (id: string) => {
		setEducation(education.filter((edu) => edu.id !== id));
	};

	const handleCancelWork = () => {
		setIsEditingWork(false);
		setExperience(initialExperience);
		setNewExperience({
			id: "",
			company: "",
			role: "",
			duration: "",
			responsibilities: "",
		});
	};

	const handleCancelEducation = () => {
		setIsEditingEducation(false);
		setEducation(initialEducation);
		setNewEducation({
			id: "",
			institution: "",
			degree: "",
			program: "",
			startYear: "",
			endYear: "",
		});
	};

	return (
		<>
			<ProfileSection
				title="Work Experience"
				canEdit={canEdit}
				isEditing={isEditingWork}
				onEdit={handleEditWork}
				onSave={handleSaveWork}
				onCancel={handleCancelWork}
			>
				{isEditingWork ? (
					<div className="space-y-4">
						{experience.map((work) => (
							<div key={work.id} className="border-b pb-6 last:border-0">
								<div className="flex justify-between items-start">
									<div className="space-y-4 w-full">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor={`company-${work.id}`}>
													Company Name
												</Label>
												<Input
													id={`company-${work.id}`}
													name="company"
													value={work.company}
													onChange={(e) => handleExperienceChange(e, work.id)}
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor={`role-${work.id}`}>Role</Label>
												<Input
													id={`role-${work.id}`}
													name="role"
													value={work.role}
													onChange={(e) => handleExperienceChange(e, work.id)}
													className="mt-1"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor={`duration-${work.id}`}>Duration</Label>
												<Input
													id={`duration-${work.id}`}
													name="duration"
													value={work.duration}
													onChange={(e) => handleExperienceChange(e, work.id)}
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor={`responsibilities-${work.id}`}>
													Key Responsibilities & Achievements
												</Label>
												<Input
													id={`responsibilities-${work.id}`}
													name="responsibilities"
													value={work.responsibilities}
													onChange={(e) => handleExperienceChange(e, work.id)}
													className="mt-1"
												/>
											</div>
										</div>
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveExperience(work.id)}
										className="text-red-500 hover:text-red-700 ml-4"
									>
										<X className="h-5 w-5" />
									</Button>
								</div>
							</div>
						))}

						<div className="mt-6 p-4 border border-dashed rounded-md">
							<h3 className="text-lg font-medium mb-4">Add Work Experience</h3>

							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="new-company">Company Name</Label>
										<Input
											id="new-company"
											name="company"
											value={newExperience.company}
											onChange={handleNewExperienceChange}
											placeholder="e.g. Tesla"
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="new-role">Role</Label>
										<Input
											id="new-role"
											name="role"
											value={newExperience.role}
											onChange={handleNewExperienceChange}
											placeholder="e.g. Web Developer"
											className="mt-1"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="new-duration">Duration</Label>
										<Input
											id="new-duration"
											name="duration"
											value={newExperience.duration}
											onChange={handleNewExperienceChange}
											placeholder="e.g. 2 years"
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="new-responsibilities">
											Key Responsibilities
										</Label>
										<Input
											id="new-responsibilities"
											name="responsibilities"
											value={newExperience.responsibilities}
											onChange={handleNewExperienceChange}
											placeholder="e.g. Website Development"
											className="mt-1"
										/>
									</div>
								</div>

								<Button onClick={handleAddExperience} className="mt-2">
									<Plus className="h-4 w-4 mr-2" />
									Add Work Experience
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div>
						{experience.map((work) => (
							<div
								key={work.id}
								className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-y-4"
							>
								<div>
									<p className="text-gray-600 font-normal">Company Name</p>
									<p className="text-xl font-semibold">{work.company}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Role</p>
									<p className="text-xl font-semibold">{work.role}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Duration</p>
									<p className="text-xl font-semibold">{work.duration}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">
										Key Responsibilities & Achievements
									</p>
									<p className="text-xl font-semibold">
										{work.responsibilities}
									</p>
								</div>
							</div>
						))}

						{experience.length === 0 && (
							<p className="text-gray-500 italic">
								No work experience added yet.
							</p>
						)}
					</div>
				)}
			</ProfileSection>

			<Separator className="my-8" />

			<ProfileSection
				title="Education"
				canEdit={canEdit}
				isEditing={isEditingEducation}
				onEdit={handleEditEducation}
				onSave={handleSaveEducation}
				onCancel={handleCancelEducation}
			>
				{isEditingEducation ? (
					<div className="space-y-4">
						{education.map((edu) => (
							<div key={edu.id} className="border-b pb-6 last:border-0">
								<div className="flex justify-between items-start">
									<div className="space-y-4 w-full">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor={`degree-${edu.id}`}>Degree</Label>
												<Input
													id={`degree-${edu.id}`}
													name="degree"
													value={edu.degree}
													onChange={(e) => handleEducationChange(e, edu.id)}
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor={`institution-${edu.id}`}>
													Institution
												</Label>
												<Input
													id={`institution-${edu.id}`}
													name="institution"
													value={edu.institution}
													onChange={(e) => handleEducationChange(e, edu.id)}
													className="mt-1"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor={`program-${edu.id}`}>Program</Label>
												<Input
													id={`program-${edu.id}`}
													name="program"
													value={edu.program}
													onChange={(e) => handleEducationChange(e, edu.id)}
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor={`years-${edu.id}`}>Year</Label>
												<Input
													id={`years-${edu.id}`}
													name="years"
													value={`${edu.startYear}-${edu.endYear}`}
													onChange={(e) =>
														handleYearChange(edu.id, e.target.value)
													}
													placeholder="e.g. 2016-2021"
													className="mt-1"
												/>
											</div>
										</div>
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveEducation(edu.id)}
										className="text-red-500 hover:text-red-700 ml-4"
									>
										<X className="h-5 w-5" />
									</Button>
								</div>
							</div>
						))}

						<div className="mt-6 p-4 border border-dashed rounded-md">
							<h3 className="text-lg font-medium mb-4">Add Education</h3>

							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="new-degree">Degree</Label>
										<Input
											id="new-degree"
											name="degree"
											value={newEducation.degree}
											onChange={handleNewEducationChange}
											placeholder="e.g. Bachelor Degree"
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="new-institution">Institution</Label>
										<Input
											id="new-institution"
											name="institution"
											value={newEducation.institution}
											onChange={handleNewEducationChange}
											placeholder="e.g. UR- Nyarugenge"
											className="mt-1"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="new-program">Program</Label>
										<Input
											id="new-program"
											name="program"
											value={newEducation.program}
											onChange={handleNewEducationChange}
											placeholder="e.g. Software Engineering"
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="new-years">Year</Label>
										<Input
											id="new-years"
											placeholder="e.g. 2016-2021"
											value={
												newEducation.startYear && newEducation.endYear
													? `${newEducation.startYear}-${newEducation.endYear}`
													: ""
											}
											onChange={(e) => handleNewYearChange(e.target.value)}
											className="mt-1"
										/>
									</div>
								</div>

								<Button onClick={handleAddEducation} className="mt-2">
									<Plus className="h-4 w-4 mr-2" />
									Add Education
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div>
						{education.map((edu) => (
							<div
								key={edu.id}
								className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-y-4"
							>
								<div>
									<p className="text-gray-600 font-normal">Degree</p>
									<p className="text-xl font-semibold">{edu.degree}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Institution</p>
									<p className="text-xl font-semibold">{edu.institution}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Program</p>
									<p className="text-xl font-semibold">{edu.program}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Year</p>
									<p className="text-xl font-semibold">
										{edu.startYear}-{edu.endYear}
									</p>
								</div>
							</div>
						))}

						{education.length === 0 && (
							<p className="text-gray-500 italic">
								No education history added yet.
							</p>
						)}
					</div>
				)}
			</ProfileSection>
		</>
	);
};

export default WorkEducationSection;
