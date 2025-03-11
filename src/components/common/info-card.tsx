import type React from "react";

interface InfoCardProps {
	title: string;
	description: string;
	iconContent?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
	title,
	description,
	iconContent,
}) => {
	return (
		<div className="rounded-32 border border-custom-navyBlue px-6 py-8 backdrop-blur-sm">
			<div className="bg-primary-base rounded-full w-16 h-16 flex items-center justify-center mb-4 md:mb-10">
				{iconContent || (
					<div className="border border-white rounded-full w-8 h-8" />
				)}
			</div>
			<h3 className="text-xl font-semibold mb-3">{title}</h3>
			<p className="text-sm">{description}</p>
		</div>
	);
};

export default InfoCard;
