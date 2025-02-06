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
		<section className="mb-10 px-4 md:px-12 w-full 2xl:max-w-screen-2xl mx-auto">
			<div className="px-4 py-8 md:p-16 bg-primary-light rounded-3xl">
				<div className="mx-auto text-center mb-12 sm:max-w-xl">
					<h2 className="text-2xl sm:text-3xl md:text-4l text-[#215C75] font-extrabold mb-4 uppercase">
						Ready to Take the Next Step in Your Career?
					</h2>
					<p className="text-base font-medium text-gray-600 mx-auto max-w-sm">
						Join our network of talented professionals and explore exciting job
						opportunities today!
					</p>
				</div>
				<div className="flex flex-wrap justify-center gap-8">
					{categories.map((category) => (
						<OpportunityCard key={category.id} {...category} />
					))}
				</div>
			</div>
		</section>
	);
};

export default JobOpportunitiesSection;
