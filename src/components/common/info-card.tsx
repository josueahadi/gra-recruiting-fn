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
		<div className="rounded-32 border border-custom-navyBlue px-6 py-8 backdrop-blur-sm max-w-sm">
			<div className="flex flex-col justify-center items-center text-center md:text-left md:inline-block py-6 md:py-0">
				<div className="bg-primary-base rounded-full w-16 h-16 flex items-center justify-center mb-4 md:mb-10 p-0 md:py-6">
					{iconContent || (
						<div className="border border-white rounded-full w-8 h-8" />
					)}
				</div>
				<h3 className="text-xl md:text-3xl font-semibold mb-6">{title}</h3>
				<p className="text-sm md:text-base text-black">{description}</p>
			</div>
		</div>
	);
};

export default InfoCard;
