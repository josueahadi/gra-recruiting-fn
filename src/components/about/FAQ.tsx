"use client";

import ImageWithShape from "@/components/common/image-with-shape";
import SectionWrapper from "@/components/common/section-wrapper";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const faqItems = [
	{
		question: "How Do I Apply For A Job With Grow Rwanda?",
		answer:
			"Simply Fill Out The Application Form On Our Website And Submit Your Details. You'll Be Asked To Provide Your Resume And Take Skill-Based Assessments To Help Us Match You With The Best Opportunities.",
	},
	{
		question: "Do I Need Any Prior Experience To Apply?",
		answer:
			"While Some Positions May Require Experience, Many Entry-Level Roles Are Available For Fresh Graduates. We Value Skills, Potential, And Attitude More Than Years Of Experience In Many Cases.",
	},
	{
		question: "How Long Does The Recruitment Process Take?",
		answer:
			"Our Recruitment Process Typically Takes 2-3 Weeks. This Includes Application Review, Skills Assessment, Interviews, And Final Selection. We Strive To Keep Candidates Informed At Every Stage.",
	},
	{
		question: "What Kind Of Jobs Can I Expect?",
		answer:
			"We Offer Roles In Accounting, Web Development, Design, Marketing, And Administrative Support. All Positions Connect You With U.S. Companies And Provide Opportunities For Professional Growth.",
	},
	{
		question: "How Do I Get Paid?",
		answer:
			"Payments Are Made Directly To Your Bank Account On A Monthly Basis. We Offer Competitive Rates Based On Your Skills And Experience, With Opportunities For Raises As You Grow With Us.",
	},
];

const FAQ = () => {
	return (
		<SectionWrapper
			title="Questions & Answers"
			subtitle={[
				"Join our network of talented professionals and explore",
				"exciting job opportunities today!",
			]}
			className="py-16"
		>
			<div className="flex flex-col md:flex-row items-center gap-10">
				<div className="w-full md:w-1/2 lg:w-[38%] flex justify-center ">
					<div className="w-[300px] h-[400px] md:w-[350px] md:h-[450px]">
						<ImageWithShape
							imageSrc="/images/faq.png"
							imageAlt="Professional thinking"
							variant="square"
							className="h-full"
						/>
					</div>
				</div>

				<div className="w-full md:w-1/2 lg:w-[62%]">
					<Accordion type="single" collapsible className="space-y-4">
						{faqItems.map((item, index) => (
							<AccordionItem
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								value={`item-${index}`}
								className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
							>
								<AccordionTrigger className="px-6 py-4 text-base font-medium hover:no-underline data-[state=open]:text-primary-base">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-6 pt-0 text-base">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</SectionWrapper>
	);
};

export default FAQ;
