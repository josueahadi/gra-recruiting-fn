"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, Check, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Education {
	id: string;
	institution: string;
	degree: string;
	fieldOfStudy: string;
	startYear: string;
	endYear: string;
}

interface WorkExperience {
	id: string;
	company: string;
	position: string;
	location: string;
	startDate: string;
	endDate: string;
	description: string;
	current: boolean;
}

const WorkEducationSection = () => {
	const [isEditingEducation, setIsEditingEducation] = useState(false);
	const [isEditingWork, setIsEditingWork] = useState(false);

	const [educationList, setEducationList] = useState<Education[]>([
		{
			id: "1",
			institution: "UR- College of Science and Technology(CST)",
			degree: "Bachelor's Degree",
			fieldOfStudy: "Computer and Software Engineering",
			startYear: "2018",
			endYear: "2023",
		},
	]);

	const [workList, setWorkList] = useState<WorkExperience[]>([
		{
			id: "1",
			company: "Grow Rwanda Advisors",
			position: "Software Engineer",
			location: "Kigali, Rwanda",
			startDate: "Jan 2023",
			endDate: "Present",
			description: "Developing web applications using React and Node.js",
			current: true,
		},
	]);

	const [newEducation, setNewEducation] = useState<Education>({
		id: "",
		institution: "",
		degree: "",
		fieldOfStudy: "",
		startYear: "",
		endYear: "",
	});

	const [newWork, setNewWork] = useState<WorkExperience>({
		id: "",
		company: "",
		position: "",
		location: "",
		startDate: "",
		endDate: "",
		description: "",
		current: false,
	});

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
		if (newEducation.institution && newEducation.fieldOfStudy) {
			setEducationList([
				...educationList,
				{ ...newEducation, id: Date.now().toString() },
			]);
			setNewEducation({
				id: "",
				institution: "",
				degree: "",
				fieldOfStudy: "",
				startYear: "",
				endYear: "",
			});
		}
	};

	const handleAddWork = () => {
		if (newWork.company && newWork.position) {
			setWorkList([...workList, { ...newWork, id: Date.now().toString() }]);
			setNewWork({
				id: "",
				company: "",
				position: "",
				location: "",
				startDate: "",
				endDate: "",
				description: "",
				current: false,
			});
		}
	};

	const handleRemoveEducation = (id: string) => {
		setEducationList(educationList.filter((edu) => edu.id !== id));
	};

	const handleRemoveWork = (id: string) => {
		setWorkList(workList.filter((work) => work.id !== id));
	};

	const handleWorkCurrentChange = (id: string, checked: boolean) => {
		setWorkList(
			workList.map((work) =>
				work.id === id
					? { ...work, current: checked, endDate: checked ? "Present" : "" }
					: work,
			),
		);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-primary-600">
					Work & Education
				</h1>
			</div>

			<div className="space-y-8">
				{/* Education Section */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl text-primary-500">
							Education
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsEditingEducation(!isEditingEducation)}
						>
							<Pencil className="h-5 w-5 text-primary-500" />
						</Button>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="space-y-8">
							{educationList.map((education) => (
								<div key={education.id} className="border-b pb-6 last:border-0">
									{isEditingEducation ? (
										<div className="space-y-4">
											<div className="flex justify-between items-start">
												<div className="space-y-4 w-full">
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

													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<Label htmlFor={`degree-${education.id}`}>
																Degree
															</Label>
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
															<Label htmlFor={`fieldOfStudy-${education.id}`}>
																Field of Study
															</Label>
															<Input
																id={`fieldOfStudy-${education.id}`}
																name="fieldOfStudy"
																value={education.fieldOfStudy}
																onChange={(e) =>
																	handleEducationChange(e, education.id)
																}
																className="mt-1"
															/>
														</div>
													</div>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<Label htmlFor={`startYear-${education.id}`}>
																Start Year
															</Label>
															<Input
																id={`startYear-${education.id}`}
																name="startYear"
																value={education.startYear}
																onChange={(e) =>
																	handleEducationChange(e, education.id)
																}
																className="mt-1"
															/>
														</div>

														<div>
															<Label htmlFor={`endYear-${education.id}`}>
																End Year
															</Label>
															<Input
																id={`endYear-${education.id}`}
																name="endYear"
																value={education.endYear}
																onChange={(e) =>
																	handleEducationChange(e, education.id)
																}
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
									) : (
										<div>
											<h3 className="text-lg font-semibold">
												{education.institution}
											</h3>
											<p className="text-gray-600">
												{education.degree} in {education.fieldOfStudy}
											</p>
											<p className="text-gray-500 text-sm">
												{education.startYear} - {education.endYear}
											</p>
										</div>
									)}
								</div>
							))}

							{isEditingEducation && (
								<div className="mt-6 p-4 border border-dashed rounded-md">
									<h3 className="text-lg font-medium mb-4">Add Education</h3>

									<div className="space-y-4">
										<div>
											<Label htmlFor="new-institution">Institution</Label>
											<Input
												id="new-institution"
												name="institution"
												value={newEducation.institution}
												onChange={handleNewEducationChange}
												placeholder="e.g. University of Rwanda"
												className="mt-1"
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="new-degree">Degree</Label>
												<Input
													id="new-degree"
													name="degree"
													value={newEducation.degree}
													onChange={handleNewEducationChange}
													placeholder="e.g. Bachelor's Degree"
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor="new-fieldOfStudy">Field of Study</Label>
												<Input
													id="new-fieldOfStudy"
													name="fieldOfStudy"
													value={newEducation.fieldOfStudy}
													onChange={handleNewEducationChange}
													placeholder="e.g. Computer Science"
													className="mt-1"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="new-startYear">Start Year</Label>
												<Input
													id="new-startYear"
													name="startYear"
													value={newEducation.startYear}
													onChange={handleNewEducationChange}
													placeholder="e.g. 2018"
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor="new-endYear">End Year</Label>
												<Input
													id="new-endYear"
													name="endYear"
													value={newEducation.endYear}
													onChange={handleNewEducationChange}
													placeholder="e.g. 2022"
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
							)}

							{isEditingEducation && (
								<div className="flex justify-end mt-4">
									<Button
										onClick={() => setIsEditingEducation(false)}
										className="bg-primary-base hover:bg-primary-dark"
									>
										<Check className="h-4 w-4 mr-2" />
										Save Changes
									</Button>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Work Experience Section */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl text-primary-500">
							Work Experience
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsEditingWork(!isEditingWork)}
						>
							<Pencil className="h-5 w-5 text-primary-500" />
						</Button>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="space-y-8">
							{workList.map((work) => (
								<div key={work.id} className="border-b pb-6 last:border-0">
									{isEditingWork ? (
										<div className="space-y-4">
											<div className="flex justify-between items-start">
												<div className="space-y-4 w-full">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<Label htmlFor={`company-${work.id}`}>
																Company
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
															<Label htmlFor={`position-${work.id}`}>
																Position
															</Label>
															<Input
																id={`position-${work.id}`}
																name="position"
																value={work.position}
																onChange={(e) => handleWorkChange(e, work.id)}
																className="mt-1"
															/>
														</div>
													</div>

													<div>
														<Label htmlFor={`location-${work.id}`}>
															Location
														</Label>
														<Input
															id={`location-${work.id}`}
															name="location"
															value={work.location}
															onChange={(e) => handleWorkChange(e, work.id)}
															className="mt-1"
														/>
													</div>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<Label htmlFor={`startDate-${work.id}`}>
																Start Date
															</Label>
															<Input
																id={`startDate-${work.id}`}
																name="startDate"
																value={work.startDate}
																onChange={(e) => handleWorkChange(e, work.id)}
																className="mt-1"
																placeholder="e.g. Jan 2022"
															/>
														</div>

														<div>
															<Label htmlFor={`endDate-${work.id}`}>
																End Date
															</Label>
															<div className="flex items-center mt-1">
																<Input
																	id={`endDate-${work.id}`}
																	name="endDate"
																	value={work.endDate}
																	onChange={(e) => handleWorkChange(e, work.id)}
																	disabled={work.current}
																	placeholder="e.g. Dec 2023"
																	className="flex-1"
																/>
															</div>
															<div className="flex items-center mt-2">
																<input
																	type="checkbox"
																	id={`current-${work.id}`}
																	checked={work.current}
																	onChange={(e) =>
																		handleWorkCurrentChange(
																			work.id,
																			e.target.checked,
																		)
																	}
																	className="mr-2"
																/>
																<Label
																	htmlFor={`current-${work.id}`}
																	className="text-sm"
																>
																	I currently work here
																</Label>
															</div>
														</div>
													</div>

													<div>
														<Label htmlFor={`description-${work.id}`}>
															Description
														</Label>
														<Input
															id={`description-${work.id}`}
															name="description"
															value={work.description}
															onChange={(e) => handleWorkChange(e, work.id)}
															className="mt-1"
														/>
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
									) : (
										<div>
											<h3 className="text-lg font-semibold">{work.position}</h3>
											<p className="text-gray-600">
												{work.company} · {work.location}
											</p>
											<p className="text-gray-500 text-sm">
												{work.startDate} - {work.endDate}
											</p>
											<p className="mt-2">{work.description}</p>
										</div>
									)}
								</div>
							))}

							{isEditingWork && (
								<div className="mt-6 p-4 border border-dashed rounded-md">
									<h3 className="text-lg font-medium mb-4">
										Add Work Experience
									</h3>

									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="new-company">Company</Label>
												<Input
													id="new-company"
													name="company"
													value={newWork.company}
													onChange={handleNewWorkChange}
													placeholder="e.g. Grow Rwanda Advisors"
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor="new-position">Position</Label>
												<Input
													id="new-position"
													name="position"
													value={newWork.position}
													onChange={handleNewWorkChange}
													placeholder="e.g. Software Engineer"
													className="mt-1"
												/>
											</div>
										</div>

										<div>
											<Label htmlFor="new-location">Location</Label>
											<Input
												id="new-location"
												name="location"
												value={newWork.location}
												onChange={handleNewWorkChange}
												placeholder="e.g. Kigali, Rwanda"
												className="mt-1"
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="new-startDate">Start Date</Label>
												<Input
													id="new-startDate"
													name="startDate"
													value={newWork.startDate}
													onChange={handleNewWorkChange}
													placeholder="e.g. Jan 2022"
													className="mt-1"
												/>
											</div>

											<div>
												<Label htmlFor="new-endDate">End Date</Label>
												<Input
													id="new-endDate"
													name="endDate"
													value={newWork.endDate}
													onChange={handleNewWorkChange}
													disabled={newWork.current}
													placeholder="e.g. Dec 2023"
													className="mt-1"
												/>
												<div className="flex items-center mt-2">
													<input
														type="checkbox"
														id="new-current"
														checked={newWork.current}
														onChange={(e) =>
															setNewWork({
																...newWork,
																current: e.target.checked,
																endDate: e.target.checked ? "Present" : "",
															})
														}
														className="mr-2"
													/>
													<Label htmlFor="new-current" className="text-sm">
														I currently work here
													</Label>
												</div>
											</div>
										</div>

										<div>
											<Label htmlFor="new-description">Description</Label>
											<Input
												id="new-description"
												name="description"
												value={newWork.description}
												onChange={handleNewWorkChange}
												placeholder="Brief description of your responsibilities"
												className="mt-1"
											/>
										</div>

										<Button onClick={handleAddWork} className="mt-2">
											<Plus className="h-4 w-4 mr-2" />
											Add Work Experience
										</Button>
									</div>
								</div>
							)}

							{isEditingWork && (
								<div className="flex justify-end mt-4">
									<Button
										onClick={() => setIsEditingWork(false)}
										className="bg-primary-base hover:bg-primary-dark"
									>
										<Check className="h-4 w-4 mr-2" />
										Save Changes
									</Button>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default WorkEducationSection;
