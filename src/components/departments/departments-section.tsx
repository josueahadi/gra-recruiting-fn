"use client";

import {
	FaCalculator,
	FaGlobe,
	FaPaintBrush,
	FaShareAlt,
} from "react-icons/fa";
import SectionWrapper from "@/components/common/section-wrapper";
import DepartmentCard from "@/components/departments/department-card";

const departments = [
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

const DepartmentsSection = () => {
	return (
		<SectionWrapper
			title="Departments"
			subtitle={[
				"Join our network of talented professionals and explore",
				"exciting job opportunities today!",
			]}
			className=""
		>
			<div className="flex flex-wrap justify-center gap-8">
				{departments.map((department) => (
					<DepartmentCard key={department.id} {...department} />
				))}
			</div>
		</SectionWrapper>
	);
};

export default DepartmentsSection;
