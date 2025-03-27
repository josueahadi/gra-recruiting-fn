"use client";

// components/admin/applicant-detail/applicant-work-experience.tsx
import React from "react";

interface ExperienceItem {
	position: string;
	company: string;
	type: string;
	startDate: string;
	endDate: string;
}

interface ApplicantWorkExperienceProps {
	experience?: ExperienceItem[];
}

export const ApplicantWorkExperience: React.FC<
	ApplicantWorkExperienceProps
> = ({ experience }) => {
	if (!experience || experience.length === 0) {
		return (
			<div className="text-center p-4 text-gray-500">
				No work experience information available
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{experience.map((exp, index) => (
				<div
					key={index}
					className="p-4 bg-gray-50 rounded-md border border-gray-200"
				>
					<h3 className="font-medium text-lg">{exp.position}</h3>
					<p className="text-primary-base">
						{exp.company} • {exp.type}
					</p>
					<p className="text-sm text-gray-500 mt-1">
						{exp.startDate} - {exp.endDate}
					</p>
				</div>
			))}
		</div>
	);
};

export default ApplicantWorkExperience;
