"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
	Navigation,
	Pagination,
	EffectCoverflow,
	Autoplay,
} from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface JobCard {
	id: number;
	title: string;
	type: string;
	description: string;
	openedDate: string;
}

export const JobCarousel = () => {
	const jobs: JobCard[] = [
		{
			id: 1,
			title: "Junior Back-End Developer",
			type: "Part-Time",
			description:
				"We're Looking For A Junior Back-End Developer To Work With Our Dev Team To Create Solution Based Software.",
			openedDate: "20 March 2025",
		},
		{
			id: 2,
			title: "Junior Back-End Developer",
			type: "Part-Time",
			description:
				"We're Looking For A Junior Back-End Developer To Work With Our Dev Team To Create Solution Based Software.",
			openedDate: "25 March 2025",
		},
		{
			id: 3,
			title: "Junior Back-End Developer",
			type: "Part-Time",
			description:
				"We're Looking For A Junior Back-End Developer To Work With Our Dev Team To Create Solution Based Software.",
			openedDate: "30 March 2025",
		},
		{
			id: 4,
			title: "Junior Back-End Developer",
			type: "Part-Time",
			description:
				"We're Looking For A Junior Back-End Developer To Work With Our Dev Team To Create Solution Based Software.",
			openedDate: "31 March 2025",
		},
		{
			id: 5,
			title: "Junior Back-End Developer",
			type: "Part-Time",
			description:
				"We're Looking For A Junior Back-End Developer To Work With Our Dev Team To Create Solution Based Software.",
			openedDate: "1 April 2025",
		},
	];

	const [swiper, setSwiper] = useState<any>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<div className="relative py-0">
			<div className="mx-auto">
				<div className="relative">
					<Swiper
						modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
						effect="coverflow"
						grabCursor={true}
						centeredSlides={true}
						loop={true}
						slidesPerView="auto"
						coverflowEffect={{
							rotate: 0,
							stretch: 50,
							depth: 80,
							modifier: 3,
							slideShadows: true,
						}}
						pagination={{
							clickable: true,
							el: ".swiper-pagination",
							bulletActiveClass: "bg-secondary-base !w-5 !h-5",
							bulletClass:
								"inline-block w-4 h-4 rounded-full bg-gray-300 mx-1 cursor-pointer transition-colors",
						}}
						onSwiper={(swiperInstance) => setSwiper(swiperInstance)}
						onSlideChange={(swiperInstance) =>
							setActiveIndex(swiperInstance.activeIndex)
						}
						className="w-full !overflow-hidden"
					>
						{jobs.map((job) => (
							<SwiperSlide
								key={job.id}
								className="w-full max-w-xs md:max-w-[467px]"
							>
								<div className="bg-gradient-to-r from-primary-base to-primary-dark rounded-lg shadow-xl text-white px-8 py-9 h-full">
									<div className="flex justify-between gap-4">
										<div>
											<h3 className="text-xl md:text-2xl font-bold">
												{job.title}
											</h3>
											<p className="text-sm opacity-90">{job.type}</p>
										</div>
										<div className="text-right text-xs">
											<p>Opened</p>
											<p>{job.openedDate}</p>
										</div>
									</div>

									<p className="my-4">{job.description}</p>

									<button
										type="button"
										className="bg-white text-cyan-600 font-medium px-4 py-2 rounded-md hover:bg-cyan-50 transition-colors w-full"
									>
										Apply
									</button>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				{/* Navigation controls and pagination grouped together */}
				<div className="flex items-center justify-center mt-10 gap-2">
					{/* Left navigation button */}
					<button
						type="button"
						onClick={() => swiper?.slidePrev()}
						className="z-40 p-2 focus:outline-none"
						aria-label="Previous slide"
					>
						<ArrowLeft className="h-5 w-5 text-primary-base" />
					</button>

					{/* Pagination dots */}
					<div className="swiper-pagination !w-fit !flex !items-center" />

					{/* Right navigation button */}
					<button
						type="button"
						onClick={() => swiper?.slideNext()}
						className="z-40 p-2 focus:outline-none"
						aria-label="Next slide"
					>
						<ArrowRight className="h-5 w-5 text-primary-base" />
					</button>
				</div>
			</div>

			{/* Custom CSS for Swiper */}
			<style jsx global>{`
				.swiper-slide {
				transition: transform 0.3s;
				opacity: 1;
				}
				
				.swiper-slide-active {
				opacity: 1;
				}
				
				.swiper-slide-shadow-left,
				.swiper-slide-shadow-right {
				border-radius: 0.75rem;
				}
				
				/* Center the pagination bullets */
				.swiper-pagination {
				position: relative;
				bottom: 0 !important;
				// display: inline-flex;
				align-items: center;
				}
			`}</style>
		</div>
	);
};

export default JobCarousel;
