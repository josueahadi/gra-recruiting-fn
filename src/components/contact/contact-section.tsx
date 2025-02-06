import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const ContactSection = () => {
	return (
		<section className="bg-gray-200 mb-16">
			<div className="2xl:max-w-screen-2xl mx-auto px-4 md:px-12 py-16">
				<div className="p-6 shadow-md shadow-gray-400/55 rounded-3xl bg-white">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
						{/* Left Section */}
						<div className="md:col-span-5 pl-0 xl:pl-16">
							<h2 className="text-2xl xl:text-3xl font-extrabold text-black uppercase mb-4">
								CONTACT US NOW, FOR ANY QUESTION OR SUGGESTION!
							</h2>
							<p className="text-base font-medium text-black mb-8">
								Fill out this form, we will get back to you shortly!
							</p>
							<form className="space-y-6 md:max-w-md">
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
											className="mt-1 block w-full border border-gray-400/55  shadow-md shadow-gray-400/55 placeholder:text-gray-400/55 placeholder:font-semibold"
											placeholder="First Name"
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
											className="mt-1 block w-full border border-gray-400/55  shadow-md shadow-gray-400/55 placeholder:text-gray-400/55 placeholder:font-semibold"
											placeholder="Last Name"
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
										className="mt-1 block w-full border border-gray-400/55  shadow-md shadow-gray-400/55 placeholder:text-gray-400/55 placeholder:font-semibold"
										placeholder="you@company.com"
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
										rows={6}
										className="mt-1 block w-full border border-gray-400/55 shadow-md shadow-gray-400/55 placeholder:text-gray-400/55 placeholder:font-semibold resize-none"
										placeholder="Leave us a message..."
									/>
								</div>
								<Button
									type="submit"
									className="px-6 py-3 rounded-3xl bg-secondary-base text-white transition-colors duration-300 hover:bg-secondary-light hover:text-white capitalize text-base font-bold"
								>
									Submit
								</Button>
							</form>
						</div>
						{/* Right Section */}
						<div className="md:col-span-7 h-[400px] md:!h-full relative rounded-3xl overflow-hidden">
							<Image
								src="/images/contact-img.svg"
								alt="Contact Us"
								fill
								className="rounded-3xl object-cover"
								priority
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
