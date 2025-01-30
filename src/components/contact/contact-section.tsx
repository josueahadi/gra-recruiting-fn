import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const ContactSection = () => {
	return (
		<section className="container mx-auto py-16 md:px-16 md:py-16 mb-20 shadow-2xl rounded-3xl">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Left Section */}
				<div className="">
					<h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-black uppercase mb-4">
						CONTACT US NOW, FOR ANY QUESTION OR SUGGESTION!
					</h2>
					<p className="text-lg font-regular text-black mb-8">
						Fill out this form, we will get back to you shortly!
					</p>
					<form className="space-y-6 max-w-md:max-w-[448px]">
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
								rows={4}
								className="mt-1 block w-full  "
							/>
						</div>
						<Button
							type="submit"
							className="px-6 py-3 rounded-3xl bg-green-600 text-white transition-colors duration-300 hover:bg-green-500 hover:text-white capitalize font-bold"
						>
							Submit
						</Button>
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
		</section>
	);
};

export default ContactSection;
