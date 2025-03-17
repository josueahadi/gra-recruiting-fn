"use client";

import PrimaryCTAButton from "@/components/common/primary-cta-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useState } from "react";

const ContactSection = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Add your contact form submission logic here
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: "Success!",
				description: "Your message has been sent successfully.",
			});

			// Reset form
			(e.target as HTMLFormElement).reset();
		} catch {
			toast({
				title: "Error",
				description: "Failed to send message. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="max-w-screen-2xl px-5 md:px-20 py-16 mb-8 flex justify-center items-center">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
				{/* Left Section */}
				<div className="rounded-2xl flex items-center justify-center w-full">
					<div className="rounded-2xl overflow-hidden w-full h-full">
						<Image
							src="/images/contact-img.png"
							alt="Contact Us"
							width={586}
							height={500}
							className="w-full h-full object-cover object-center"
						/>
					</div>
				</div>
				{/* Right Section */}
				<div className="flex flex-col justify-between">
					<h2 className="text-2xl md:text-3xl font-semibold text-black capitalize mb-4">
						Send Us A Message
					</h2>
					<p className="text-xs md:text-base font-regular text-black mb-5 md:mb-7 max-w-md capitalize">
						Your satisfaction is our top Priority, and we are comitted to
						Providing exceptional Service and support
					</p>
					<form onSubmit={handleSubmit} className="space-y-6 md:max-w-xl">
						<div>
							<Label htmlFor="name" className="block text-base font-bold">
								<span className="text-black font-medium">Your Name</span>{" "}
								<span className="text-red-500 font-bold">*</span>
							</Label>
							<Input
								type="text"
								id="name"
								name="name"
								className="block w-full border border-[#B1AEAE] h-12 md:h-14 focus:outline-none rounded-md md:rounded-2xl"
								placeholder="Name"
							/>
						</div>

						<div>
							<Label htmlFor="email" className="block text-base ">
								<span className="text-black font-medium">Email</span>{" "}
								<span className="text-red-500 font-bold">*</span>
							</Label>
							<Input
								type="email"
								id="email"
								name="email"
								className="mt-1 block w-full border border-[#B1AEAE] h-12 md:h-14 focus:outline-none rounded-md md:rounded-2xl"
								placeholder="Enter Email"
							/>
						</div>
						<div>
							<Label htmlFor="message" className="block text-base ">
								<span className="text-black font-medium">Message</span>{" "}
								<span className="text-red-500 font-bold">*</span>
							</Label>
							<Textarea
								id="message"
								name="message"
								rows={4}
								className="mt-1 block w-full resize-none border border-[#B1AEAE] focus:outline-none rounded-md md:rounded-2xl"
								placeholder="Enter Message"
							/>
						</div>
						<PrimaryCTAButton
							className="text-base w-full"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</PrimaryCTAButton>
					</form>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
