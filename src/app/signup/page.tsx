import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const SignUpForm = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
				<div className="grid md:grid-cols-2 gap-0">
					{/* Left side with image */}
					<div className="relative bg-[#F5F7F6] p-8 flex items-center justify-center">
						<Image
							src="/images/contact-img.svg"
							alt="Person working on laptop"
							className="max-w-full rounded-lg"
						/>
					</div>

					{/* Right side with form */}
					<div className="p-8">
						<div className="space-y-6">
							{/* Progress indicator */}
							<div className="flex items-center gap-4 mb-8">
								<div className="flex items-center">
									<div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
										1
									</div>
									<span className="ml-2 text-blue-500 font-medium">
										Contact Info
									</span>
								</div>
								<div className="flex-1 h-px bg-gray-200" />
								<div className="flex items-center">
									<div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm">
										2
									</div>
									<span className="ml-2 text-gray-400">
										Education Background
									</span>
								</div>
							</div>

							<div className="space-y-4">
								<h1 className="text-2xl font-semibold">Create Account</h1>
								<p className="text-gray-500">Please Create Your Account</p>

								<div className="space-y-4">
									<Input
										type="text"
										placeholder="Full Names"
										className="w-full"
									/>
									<Input
										type="email"
										placeholder="Email Address"
										className="w-full"
									/>
									<Input
										type="password"
										placeholder="Password"
										className="w-full"
									/>

									<div className="flex items-center space-x-2">
										<Checkbox id="terms" />
										<label
											htmlFor="terms"
											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											I agree to the terms & conditions
										</label>
									</div>

									<Button className="w-full bg-green-500 hover:bg-green-600">
										Create Account
									</Button>

									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t" />
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-white px-2 text-gray-500">Or</span>
										</div>
									</div>

									<Button variant="outline" className="w-full">
										<Image
											src="/images/contact-img.svg"
											alt="Google logo"
											className="w-5 h-5 mr-2"
										/>
										Signup with google
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default SignUpForm;
