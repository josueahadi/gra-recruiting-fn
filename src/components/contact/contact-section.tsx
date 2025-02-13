"use client";

import PrimaryActionButton from "@/components/primary-action-button";
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
		<section className="bg-gray-200 mb-16">
			<div className="2xl:max-w-screen-2xl mx-auto px-4 md:px-10 xl:px-20 py-16">
				<div className="p-6 shadow-2xl rounded-xl bg-white">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
						{/* Left Section */}
						<div className="md:px-8 md:py-8">
							<h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-black uppercase mb-4">
								CONTACT US NOW, FOR ANY QUESTIONS OR SUGGESTIONS!
							</h2>
							<p className="text-lg font-regular text-black mb-8">
								Fill out this form, we will get back to you shortly!
							</p>
							<form onSubmit={handleSubmit} className="space-y-6 md:max-w-xl">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<Label
											htmlFor="first-name"
											className="block text-base font-bold text-black"
										>
											First Name
										</Label>
										<Input
											type="text"
											id="first-name"
											name="first-name"
											className="mt-1 block w-full"
										/>
									</div>
									<div>
										<Label
											htmlFor="last-name"
											className="block text-base font-bold text-black"
										>
											Last Name
										</Label>
										<Input
											type="text"
											id="last-name"
											name="last-name"
											className="mt-1 block w-full  "
										/>
									</div>
								</div>
								<div>
									<Label
										htmlFor="email"
										className="block text-base font-bold text-black"
									>
										Email
									</Label>
									<Input
										type="email"
										id="email"
										name="email"
										className="mt-1 block w-full  "
									/>
								</div>
								<div>
									<Label
										htmlFor="message"
										className="block text-base font-bold text-black"
									>
										Message
									</Label>
									<Textarea
										id="message"
										name="message"
										rows={5}
										className="mt-1 block w-full resize-none"
									/>
								</div>
								<PrimaryActionButton
									className="text-base"
									type="submit"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Submitting..." : "Submit"}
								</PrimaryActionButton>
							</form>
						</div>
						{/* Right Section */}
						<div className="rounded-3xl flex items-center justify-center w-full">
							<div className="rounded-3xl overflow-hidden w-full h-full">
								<Image
									src="/images/contact-img.svg"
									alt="Contact Us"
									width={400}
									height={400}
									className="w-full h-full object-cover object-center"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
