"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Mail, Phone, Trash2 } from "lucide-react";
import Image from "next/image";
import type React from "react";
import ApplicantSkills from "./applicant-detail/applicant-skills";
import ApplicantEducation from "./applicant-detail/applicant-education";
import ApplicantWorkExperience from "./applicant-detail/applicant-work-experience";
import ApplicantPersonalInfo from "./applicant-detail/applicant-personal-info";
import ApplicantDocuments from "./applicant-detail/applicant-documents";

export interface ApplicantData {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: "success" | "fail" | "waiting";
	department: string;
	dateApplied: string;
	bio?: string;
	location?: {
		country: string;
		city: string;
		address: string;
		postalCode: string;
	};
	skills?: string[];
	languages?: Array<{ language: string; level: string }>;
	education?: Array<{
		institution: string;
		degree: string;
		field: string;
		startDate: string;
		endDate: string;
	}>;
	experience?: Array<{
		position: string;
		company: string;
		type: string;
		startDate: string;
		endDate: string;
	}>;
	documents?: Array<{ name: string; url: string }>;
	links?: Record<string, string>;
	avatarSrc?: string;
}

interface ApplicantDetailProps {
	isOpen: boolean;
	onClose: () => void;
	applicant: ApplicantData | null;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

const ApplicantDetail: React.FC<ApplicantDetailProps> = ({
	isOpen,
	onClose,
	applicant,
	onEdit,
	onDelete,
}) => {
	if (!applicant) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Applicant Detail</span>
						<Badge
							className={
								applicant.status === "success"
									? "bg-green-100 text-green-800"
									: applicant.status === "fail"
										? "bg-red-100 text-red-800"
										: "bg-yellow-100 text-yellow-800"
							}
						>
							{applicant.status === "success"
								? "Success"
								: applicant.status === "fail"
									? "Failed"
									: "Waiting"}
						</Badge>
					</DialogTitle>
				</DialogHeader>

				<div className="flex items-center mb-6">
					<div className="relative">
						<Image
							src={applicant.avatarSrc || "/images/avatar.jpg"}
							alt={applicant.name}
							width={80}
							height={80}
							priority
							className="rounded-full object-cover"
						/>
					</div>
					<div className="ml-4">
						<h2 className="text-2xl font-bold">{applicant.name}</h2>
						<div className="flex items-center text-gray-500 mt-1">
							<Mail className="h-4 w-4 mr-1" />
							<span className="mr-4">{applicant.email}</span>
							<Phone className="h-4 w-4 mr-1" />
							<span>{applicant.phone}</span>
						</div>
						<div className="mt-1">
							<Badge variant="outline">{applicant.department}</Badge>
							<span className="text-sm text-gray-500 ml-2">
								Applied: {applicant.dateApplied}
							</span>
						</div>
					</div>
				</div>

				<Tabs defaultValue="personal">
					<TabsList className="w-full">
						<TabsTrigger value="personal">Personal Info</TabsTrigger>
						<TabsTrigger value="skills">Skills</TabsTrigger>
						<TabsTrigger value="education">Education</TabsTrigger>
						<TabsTrigger value="work">Work Experience</TabsTrigger>
						<TabsTrigger value="documents">Documents</TabsTrigger>
					</TabsList>

					<TabsContent value="personal" className="py-4">
						<ApplicantPersonalInfo applicant={applicant} />
					</TabsContent>

					<TabsContent value="skills" className="py-4">
						<ApplicantSkills
							skills={applicant.skills}
							languages={applicant.languages}
						/>
					</TabsContent>

					<TabsContent value="education" className="py-4">
						<ApplicantEducation education={applicant.education} />
					</TabsContent>

					<TabsContent value="work" className="py-4">
						<ApplicantWorkExperience experience={applicant.experience} />
					</TabsContent>

					<TabsContent value="documents" className="py-4">
						<ApplicantDocuments
							documents={applicant.documents}
							links={applicant.links}
						/>
					</TabsContent>
				</Tabs>

				<div className="flex justify-end space-x-2 mt-4">
					<Button
						variant="outline"
						onClick={() => onEdit(applicant.id)}
						className="flex items-center"
					>
						<FileEdit className="h-4 w-4 mr-2" />
						Edit
					</Button>
					<Button
						variant="destructive"
						onClick={() => onDelete(applicant.id)}
						className="flex items-center"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ApplicantDetail;
