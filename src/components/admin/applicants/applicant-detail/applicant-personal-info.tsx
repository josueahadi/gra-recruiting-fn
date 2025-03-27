import { Badge } from "@/components/ui/badge";
import { ApplicantData } from "../applicant-detail";
import React from "react";

interface ApplicantPersonalInfoProps {
	applicant: ApplicantData;
}

export const ApplicantPersonalInfo: React.FC<ApplicantPersonalInfoProps> = ({
	applicant,
}) => {
	return (
		<div className="space-y-6">
			{applicant.bio && (
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
					<p className="text-gray-700">{applicant.bio}</p>
				</div>
			)}

			{applicant.location && (
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-xs text-gray-500">Country</p>
							<p>{applicant.location.country}</p>
						</div>
						<div>
							<p className="text-xs text-gray-500">City</p>
							<p>{applicant.location.city}</p>
						</div>
						<div>
							<p className="text-xs text-gray-500">Address</p>
							<p>{applicant.location.address}</p>
						</div>
						<div>
							<p className="text-xs text-gray-500">Postal Code</p>
							<p>{applicant.location.postalCode}</p>
						</div>
					</div>
				</div>
			)}

			<div>
				<h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
				<Badge variant="outline" className="text-base font-normal">
					{applicant.department}
				</Badge>
			</div>
		</div>
	);
};

export default ApplicantPersonalInfo;
