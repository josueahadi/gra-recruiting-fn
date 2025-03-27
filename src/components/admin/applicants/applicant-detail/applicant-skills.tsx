import { Badge } from "@/components/ui/badge";
import type React from "react";

interface ApplicantSkillsProps {
	skills?: string[];
	languages?: Array<{ language: string; level: string }>;
}

export const ApplicantSkills: React.FC<ApplicantSkillsProps> = ({
	skills,
	languages,
}) => {
	return (
		<div className="space-y-6">
			{skills && skills.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
					<div className="flex flex-wrap gap-2">
						{skills.map((skill, index) => (
							<Badge
								key={index}
								variant="outline"
								className="bg-blue-50 text-blue-700 border-blue-200"
							>
								{skill}
							</Badge>
						))}
					</div>
				</div>
			)}

			{languages && languages.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Language Proficiency
					</h3>
					<div className="flex flex-wrap gap-2">
						{languages.map((lang, index) => (
							<div
								key={index}
								className="px-4 py-2 bg-gray-50 rounded-md flex flex-col items-center"
							>
								<span className="font-medium">{lang.language}</span>
								<span className="text-sm text-gray-600">{lang.level}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{(!skills || skills.length === 0) &&
				(!languages || languages.length === 0) && (
					<div className="text-center p-4 text-gray-500">
						No skills or languages information available
					</div>
				)}
		</div>
	);
};

export default ApplicantSkills;
