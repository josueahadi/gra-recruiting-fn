import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, X, Edit2, Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface InfoCardProps {
	title: string;
	children: React.ReactNode;
	className?: string;
	onEdit?: () => void;
	showEditButton?: boolean;
}

const FLUENCY_LEVELS = [
	"Native",
	"Fluent",
	"Intermediate",
	"Beginner",
] as const;

type FluencyLevel = (typeof FLUENCY_LEVELS)[number];

const InfoCard: React.FC<InfoCardProps> = ({
	title,
	children,
	className,
	onEdit,
	showEditButton = false,
}) => {
	return (
		<Card className={cn("p-6 relative", className)}>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-green-500">{title}</h2>
				{showEditButton && (
					<Button
						variant="ghost"
						size="icon"
						onClick={onEdit}
						className="absolute top-4 right-4"
					>
						<Edit2 className="h-4 w-4" />
					</Button>
				)}
			</div>
			{children}
		</Card>
	);
};

const ProfileSection = () => {
	const [isEditing, setIsEditing] = useState({
		contacts: false,
		languages: false,
		education: false,
	});
	const [uploadingCV, setUploadingCV] = useState(false);
	const [cvs, setCvs] = useState<string[]>([]);
	const [contactInfo, setContactInfo] = useState({
		email: "Kevin@gmail.com",
		phone: "0788886547",
	});
	const [languages, setLanguages] = useState([
		{ language: "English", proficiency: "Fluent" },
		{ language: "French", proficiency: "Intermediate" },
		{ language: "Kinyarwanda", proficiency: "Native" },
	]);
	const [educationInfo, setEducationInfo] = useState({
		institution: "UR- College of Science and Technology(CST)",
		level: "Computer and Software Engineering",
		startYear: "2018",
		graduationYear: "2023",
	});

	const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setUploadingCV(true);
			// Simulate upload delay
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setCvs([...cvs, file.name]);
			setUploadingCV(false);
		}
	};

	const handleCVRemove = (cvName: string) => {
		setCvs(cvs.filter((cv) => cv !== cvName));
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
			<div className="md:cols-span-1 space-y-8">
				{/* CV Upload Status */}
				<InfoCard title="Your CVs">
					<div className="space-y-4">
						<div className="flex justify-end">
							<Button
								variant="outline"
								size="sm"
								onClick={() => document.getElementById("cv-upload")?.click()}
								disabled={uploadingCV}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add CV
							</Button>
							<input
								type="file"
								id="cv-upload"
								className="hidden"
								accept=".pdf,.doc,.docx"
								onChange={handleCVUpload}
							/>
						</div>
						{uploadingCV && (
							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>Uploading...</span>
							</div>
						)}
						{cvs.map((cv) => (
							<div
								key={cv}
								className="flex items-center justify-between p-2 bg-gray-50 rounded"
							>
								<span className="text-sm">{cv}</span>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleCVRemove(cv)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</InfoCard>

				{/* Contact Information */}
				<InfoCard
					title="Contacts"
					showEditButton={!isEditing.contacts}
					onEdit={() => setIsEditing({ ...isEditing, contacts: true })}
				>
					<div className="space-y-4">
						{isEditing.contacts ? (
							<>
								<div>
									<Label className="text-sm text-gray-500">Email</Label>
									<Input
										value={contactInfo.email}
										onChange={(e) =>
											setContactInfo({ ...contactInfo, email: e.target.value })
										}
									/>
								</div>
								<div>
									<Label className="text-sm text-gray-500">Phone</Label>
									<Input
										value={contactInfo.phone}
										onChange={(e) =>
											setContactInfo({ ...contactInfo, phone: e.target.value })
										}
									/>
								</div>
								<Button
									onClick={() =>
										setIsEditing({ ...isEditing, contacts: false })
									}
								>
									Save
								</Button>
							</>
						) : (
							<>
								<div>
									<Label className="text-sm text-gray-500">Email</Label>
									<p>{contactInfo.email}</p>
								</div>
								<div>
									<Label className="text-sm text-gray-500">Phone</Label>
									<p>{contactInfo.phone}</p>
								</div>
							</>
						)}
					</div>
				</InfoCard>

				{/* Languages */}
				<InfoCard
					title="Languages"
					showEditButton={!isEditing.languages}
					onEdit={() => setIsEditing({ ...isEditing, languages: true })}
				>
					<div className="space-y-4">
						{isEditing.languages ? (
							<>
								{languages.map((lang, index) => (
									<div key={index} className="space-y-2">
										<div>
											<Label className="text-sm text-gray-500">Language</Label>
											<Input
												value={lang.language}
												onChange={(e) => {
													const newLanguages = [...languages];
													newLanguages[index].language = e.target.value;
													setLanguages(newLanguages);
												}}
											/>
										</div>
										<div>
											<Label className="text-sm text-gray-500">
												Proficiency
											</Label>
											<Select
												value={lang.proficiency}
												onValueChange={(value) => {
													const newLanguages = [...languages];
													newLanguages[index].proficiency = value;
													setLanguages(newLanguages);
												}}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select proficiency level" />
												</SelectTrigger>
												<SelectContent>
													{FLUENCY_LEVELS.map((level) => (
														<SelectItem key={level} value={level.toLowerCase()}>
															{level}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								))}
								<div className="flex justify-between items-center">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setLanguages([
												...languages,
												{ language: "", proficiency: "beginner" },
											]);
										}}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Language
									</Button>
									<Button
										onClick={() =>
											setIsEditing({ ...isEditing, languages: false })
										}
									>
										Save
									</Button>
								</div>
							</>
						) : (
							<div className="space-y-4">
								{languages.map((lang, index) => (
									<div
										key={index}
										className="flex justify-between items-center"
									>
										<span className="text-sm font-medium">{lang.language}</span>
										<span className="text-sm text-gray-500 capitalize">
											{lang.proficiency}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</InfoCard>
			</div>

			<div className="md:col-span-2">
				{/* Education Background */}
				<InfoCard
					title="Education Background"
					className="md:col-span-2"
					showEditButton={!isEditing.education}
					onEdit={() => setIsEditing({ ...isEditing, education: true })}
				>
					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-4">
							{isEditing.education ? (
								<>
									<div>
										<Label className="text-sm text-gray-500">Institution</Label>
										<Input
											value={educationInfo.institution}
											onChange={(e) =>
												setEducationInfo({
													...educationInfo,
													institution: e.target.value,
												})
											}
										/>
									</div>
									<div>
										<Label className="text-sm text-gray-500">
											Education Level
										</Label>
										<Input
											value={educationInfo.level}
											onChange={(e) =>
												setEducationInfo({
													...educationInfo,
													level: e.target.value,
												})
											}
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label className="text-sm text-gray-500">
												Start Year
											</Label>
											<Input
												value={educationInfo.startYear}
												onChange={(e) =>
													setEducationInfo({
														...educationInfo,
														startYear: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label className="text-sm text-gray-500">
												Graduation Year
											</Label>
											<Input
												value={educationInfo.graduationYear}
												onChange={(e) =>
													setEducationInfo({
														...educationInfo,
														graduationYear: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<Button
										onClick={() =>
											setIsEditing({ ...isEditing, education: false })
										}
									>
										Save
									</Button>
								</>
							) : (
								<>
									<div>
										<Label className="text-sm text-gray-500">Institution</Label>
										<p>{educationInfo.institution}</p>
									</div>
									<div>
										<Label className="text-sm text-gray-500">
											Education Level
										</Label>
										<p>{educationInfo.level}</p>
									</div>
									<div>
										<Label className="text-sm text-gray-500">Start Year</Label>
										<p>{educationInfo.startYear}</p>
									</div>
									<div>
										<Label className="text-sm text-gray-500">
											Graduation Year
										</Label>
										<p>{educationInfo.graduationYear}</p>
									</div>
								</>
							)}
						</div>
					</div>
				</InfoCard>
			</div>
		</div>
	);
};

export default ProfileSection;
