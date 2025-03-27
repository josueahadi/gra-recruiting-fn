import React from "react";

interface EducationItem {
	institution: string;
	degree: string;
	field: string;
	startDate: string;
	endDate: string;
}

interface ApplicantEducationProps {
	education?: EducationItem[];
}

export const ApplicantEducation: React.FC<ApplicantEducationProps> = ({
	education,
}) => {
	if (!education || education.length === 0) {
		return (
			<div className="text-center p-4 text-gray-500">
				No education information available
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{education.map((edu, index) => (
				<div
					key={index}
					className="p-4 bg-gray-50 rounded-md border border-gray-200"
				>
					<h3 className="font-medium text-lg">{edu.institution}</h3>
					<p className="text-primary-base">
						{edu.degree} • {edu.field}
					</p>
					<p className="text-sm text-gray-500 mt-1">
						{edu.startDate} - {edu.endDate}
					</p>
				</div>
			))}
		</div>
	);
};

export default ApplicantEducation;
