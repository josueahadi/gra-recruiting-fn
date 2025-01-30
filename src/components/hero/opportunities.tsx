import {
	FaCalculator,
	FaGlobe,
	FaPaintBrush,
	FaShareAlt,
} from "react-icons/fa";
import OpportunityCard from "./opportunity-card";

const categories = [
	{
		id: 1,
		icon: <FaCalculator size={32} />,
		title: "Accounting & Bookkeeping",
		description:
			"We help businesses to maintain their financial health with reporting and analysis.",
	},
	{
		id: 2,
		icon: <FaGlobe size={32} />,
		title: "Web Application Development",
		description:
			"We create web applications with technical skills and problem-solving to deliver top solutions.",
	},
	{
		id: 3,
		icon: <FaPaintBrush size={32} />,
		title: "Website Design",
		description:
			"We bring your creativity to life by designing impactful websites using innovative solutions.",
	},
	{
		id: 4,
		icon: <FaShareAlt size={32} />,
		title: "Marketing & Social Media",
		description:
			"Support our clients by providing essential administrative assistance and managing tasks efficiently.",
	},
];

const JobOpportunitiesSection = () => {
	return (
		<section className="mb-10">
			<div className="container bg-primary-base py-16 md:px-16 md:py-16 xl:rounded-3xl">
				<div className="container mx-auto flex flex-col items-center justify-center text-center mb-12 sm:max-w-xl">
					<h2 className="text-3xl md:text-4l text-gray-50 font-extrabold mb-4 uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)]">
						Ready to Take the Next Step in Your Career?
					</h2>
					<p className="text-base text-gray-50 max-w-sm drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)]">
						Join our network of talented professionals and explore exciting job
						opportunities today!
					</p>
				</div>
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{categories.map((category) => (
						<OpportunityCard key={category.id} {...category} />
					))}
				</div>
			</div>
		</section>
	);
};

export default JobOpportunitiesSection;
