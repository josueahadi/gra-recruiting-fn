import type React from "react";
import { useState } from "react";
import { ProfileInfoSection } from "@/components/profile/core/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export interface Education {
	id: string;
	institution: string;
	degree: string;
	program: string;
	startYear: string;
	endYear: string;
}

export interface WorkExperience {
	id: string;
	company: string;
	role: string;
	duration: string;
	responsibilities: string;
}

interface WorkEducationSectionProps {
	educationList: Education[];
	workList: WorkExperience[];
	userType: "applicant" | "admin";
	onSave?: (data: {
		educationList: Education[];
		workList: WorkExperience[];
	}) => void;
}

/**
 * Reusable work and education section component that works for both applicant and admin views
 */
const WorkEducationSection: React.FC<WorkEducationSectionProps> = ({
	educationList: initialEducationList,
	workList: initialWorkList,
	userType,
	onSave,
}) => {
	const [isEditingEducation, setIsEditingEducation] = useState(false);
	const [isEditingWork, setIsEditingWork] = useState(false);

	const [educationList, setEducationList] =
		useState<Education[]>(initialEducationList);
	const [workList, setWorkList] = useState<WorkExperience[]>(initialWorkList);

	const [newEducation, setNewEducation] = useState<Education>({
		id: "",
		institution: "",
		degree: "",
		program: "",
		startYear: "",
		endYear: "",
	});

	const [newWork, setNewWork] = useState<WorkExperience>({
		id: "",
		company: "",
		role: "",
		duration: "",
		responsibilities: "",
	});

	const canEdit = userType === "applicant";

	const handleEducationChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		id: string,
	) => {
		const { name, value } = e.target;
		setEducationList(
			educationList.map((edu) =>
				edu.id === id ? { ...edu, [name]: value } : edu,
			),
		);
	};

	const handleWorkChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		id: string,
	) => {
		const { name, value } = e.target;
		setWorkList(
			workList.map((work) =>
				work.id === id ? { ...work, [name]: value } : work,
			),
		);
	};

	const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewEducation({ ...newEducation, [name]: value });
	};

	const handleNewWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewWork({ ...newWork, [name]: value });
	};

	const handleAddEducation = () => {
		if (newEducation.institution && newEducation.degree) {
			setEducationList([
				...educationList,
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

	const handleAddWork = () => {
		if (newWork.company && newWork.role) {
			setWorkList([...workList, { ...newWork, id: Date.now().toString() }]);
			setNewWork({
				id: "",
				company: "",
				role: "",
				duration: "",
				responsibilities: "",
			});
		}
	};

	const handleRemoveEducation = (id: string) => {
		setEducationList(educationList.filter((edu) => edu.id !== id));
	};

	const handleRemoveWork = (id: string) => {
		setWorkList(workList.filter((work) => work.id !== id));
	};

	const handleSaveEducation = () => {
		setIsEditingEducation(false);
		if (onSave) {
			onSave({ educationList, workList });
		}
	};

	const handleSaveWork = () => {
		setIsEditingWork(false);
		if (onSave) {
			onSave({ educationList, workList });
		}
	};

	return (
		<>
			{/* Work Experience Section */}
			<ProfileInfoSection
				title="Work Experience"
				canEdit={canEdit}
				isEditing={isEditingWork}
				onEdit={() => setIsEditingWork(true)}
				onSave={handleSaveWork}
			>
				{isEditingWork ? (
					<div className="space-y-4">
						{workList.map((work) => (
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
													onChange={(e) => handleWorkChange(e, work.id)}
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor={`role-${work.id}`}>Role</Label>
												<Input
													id={`role-${work.id}`}
													name="role"
													value={work.role}
													onChange={(e) => handleWorkChange(e, work.id)}
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
													onChange={(e) => handleWorkChange(e, work.id)}
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
													onChange={(e) => handleWorkChange(e, work.id)}
													className="mt-1"
												/>
											</div>
										</div>
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveWork(work.id)}
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
											value={newWork.company}
											onChange={handleNewWorkChange}
											placeholder="e.g. Tesla"
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="new-role">Role</Label>
										<Input
											id="new-role"
											name="role"
											value={newWork.role}
											onChange={handleNewWorkChange}
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
											value={newWork.duration}
											onChange={handleNewWorkChange}
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
											value={newWork.responsibilities}
											onChange={handleNewWorkChange}
											placeholder="e.g. Website Development"
											className="mt-1"
										/>
									</div>
								</div>

								<Button onClick={handleAddWork} className="mt-2">
									<Plus className="h-4 w-4 mr-2" />
									Add Work Experience
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div>
						{workList.map((work) => (
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
					</div>
				)}
			</ProfileInfoSection>

			{/* Education Section */}
			<ProfileInfoSection
				title="Education"
				canEdit={canEdit}
				isEditing={isEditingEducation}
				onEdit={() => setIsEditingEducation(true)}
				onSave={handleSaveEducation}
			>
				{isEditingEducation ? (
					<div className="space-y-4">
						{educationList.map((education) => (
							<div key={education.id} className="border-b pb-6 last:border-0">
								<div className="flex justify-between items-start">
									<div className="space-y-4 w-full">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor={`degree-${education.id}`}>Degree</Label>
												<Input
													id={`degree-${education.id}`}
													name="degree"
													value={education.degree}
													onChange={(e) =>
														handleEducationChange(e, education.id)
													}
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor={`institution-${education.id}`}>
													Institution
												</Label>
												<Input
													id={`institution-${education.id}`}
													name="institution"
													value={education.institution}
													onChange={(e) =>
														handleEducationChange(e, education.id)
													}
													className="mt-1"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor={`program-${education.id}`}>
													Program
												</Label>
												<Input
													id={`program-${education.id}`}
													name="program"
													value={education.program}
													onChange={(e) =>
														handleEducationChange(e, education.id)
													}
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor={`years-${education.id}`}>Year</Label>
												<Input
													id={`years-${education.id}`}
													name="endYear"
													value={`${education.startYear}-${education.endYear}`}
													onChange={(e) => {
														const value = e.target.value;
														const years = value.split("-");
														handleEducationChange(
															{
																target: {
																	name: "startYear",
																	value: years[0] || "",
																},
															} as React.ChangeEvent<HTMLInputElement>,
															education.id,
														);
														handleEducationChange(
															{
																target: {
																	name: "endYear",
																	value: years[1] || "",
																},
															} as React.ChangeEvent<HTMLInputElement>,
															education.id,
														);
													}}
													placeholder="e.g. 2016-2021"
													className="mt-1"
												/>
											</div>
										</div>
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveEducation(education.id)}
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
											onChange={(e) => {
												const value = e.target.value;
												const years = value.split("-");
												setNewEducation({
													...newEducation,
													startYear: years[0] || "",
													endYear: years[1] || "",
												});
											}}
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
						{educationList.map((education) => (
							<div
								key={education.id}
								className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-y-4"
							>
								<div>
									<p className="text-gray-600 font-normal">Degree</p>
									<p className="text-xl font-semibold">{education.degree}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Institution</p>
									<p className="text-xl font-semibold">
										{education.institution}
									</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Program</p>
									<p className="text-xl font-semibold">{education.program}</p>
								</div>
								<div>
									<p className="text-gray-600 font-normal">Year</p>
									<p className="text-xl font-semibold">
										{education.startYear}-{education.endYear}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</ProfileInfoSection>
		</>
	);
};

export default WorkEducationSection;
