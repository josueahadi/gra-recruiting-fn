"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AUTH_CONSTANTS } from "@/constants";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import SocialInputField from "./social-input-field";

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) =>
	(new Date().getFullYear() - i).toString(),
);

interface EducationBackgroundFieldsProps {
	career?: string;
	levelOfEducation?: string;
	university?: string;
	graduationDate?: string;
	major?: string;
	linkedinProfileUrl?: string;
	githubProfileUrl?: string;
	errors?: Record<string, string>;
	onInputChange?: (name: string, value: string) => void;
	onSelectChange?: (name: string, value: string) => void;
	onBack?: () => void;
	isLoading?: boolean;
}

export const EducationBackgroundFields = ({
	career = "",
	levelOfEducation = "",
	university = "",
	graduationDate = "",
	major = "",
	linkedinProfileUrl = "",
	githubProfileUrl = "",
	errors = {},
	onInputChange = () => {},
	onSelectChange = () => {},
	onBack = () => {},
	isLoading = false,
}: EducationBackgroundFieldsProps) => {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<label
					htmlFor="career"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Career
				</label>
				<Select
					name="career"
					value={career}
					onValueChange={(value) => onSelectChange("career", value)}
				>
					<SelectTrigger
						className={`w-full h-12 rounded-xl border-gray-400 bg-white ${
							errors.career ? "border-red-500" : ""
						}`}
					>
						<SelectValue placeholder="Department" />
					</SelectTrigger>
					<SelectContent>
						{AUTH_CONSTANTS.SIGNUP.steps.education.departments.map((dept) => (
							<SelectItem key={dept} value={dept.toLowerCase()}>
								{dept}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.career && (
					<p className="text-red-500 text-xs mt-1">{errors.career}</p>
				)}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="institution"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Add Education History
				</label>
				<Input
					id="university"
					name="university"
					value={university}
					onChange={(e) => onInputChange("university", e.target.value)}
					placeholder="Enter your institution"
					className={`w-full h-12 rounded-xl border-gray-400 bg-white ${
						errors.university ? "border-red-500" : ""
					}`}
				/>
				{errors.university && (
					<p className="text-red-500 text-xs mt-1">{errors.university}</p>
				)}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="educationLevel"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Education Level
				</label>
				<Select
					name="levelOfEducation"
					value={levelOfEducation}
					onValueChange={(value) => onSelectChange("levelOfEducation", value)}
				>
					<SelectTrigger
						className={`w-full h-12 rounded-xl border-gray-400 bg-white ${
							errors.levelOfEducation ? "border-red-500" : ""
						}`}
					>
						<SelectValue placeholder="Select your Education Level" />
					</SelectTrigger>
					<SelectContent>
						{AUTH_CONSTANTS.SIGNUP.steps.education.education_levels.map(
							(level) => (
								<SelectItem key={level} value={level.toLowerCase()}>
									{level}
								</SelectItem>
							),
						)}
					</SelectContent>
				</Select>
				{errors.levelOfEducation && (
					<p className="text-red-500 text-xs mt-1">{errors.levelOfEducation}</p>
				)}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="program"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Program
				</label>
				<Input
					type="text"
					id="major"
					name="major"
					value={major}
					onChange={(e) => onInputChange("major", e.target.value)}
					placeholder="Education Program/Major"
					className="w-full h-12 rounded-xl border-gray-400 bg-white"
				/>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="graduationYear"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Graduation Date
				</label>
				<Select
					name="graduationDate"
					value={graduationDate}
					onValueChange={(value) => onSelectChange("graduationDate", value)}
				>
					<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
						<SelectValue placeholder="Select graduation year" />
					</SelectTrigger>
					<SelectContent>
						{GRADUATION_YEARS.map((year) => (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-4">
				<label
					htmlFor="optionalInfo"
					className="block text-sm font-medium text-gray-700"
				>
					Add Optional Information
				</label>
				<SocialInputField
					name="linkedinProfileUrl"
					icon={<BsLinkedin className="text-[#0077B5]" size={20} />}
					placeholder="https://linkedin.com/in/yourprofile"
					value={linkedinProfileUrl}
					onChange={(value) => onInputChange("linkedinProfileUrl", value)}
				/>
				<SocialInputField
					name="githubProfileUrl"
					icon={<BsGithub size={20} />}
					placeholder="https://github.com/yourusername"
					value={githubProfileUrl}
					onChange={(value) => onInputChange("githubProfileUrl", value)}
				/>
			</div>

			<div className="flex gap-4">
				<Button
					type="button"
					variant="outline"
					className="flex-1 h-12 rounded-xl border-gray-400"
					onClick={onBack}
					disabled={isLoading}
				>
					<ArrowLeftIcon className="h-4 w-4 mr-2" />
					Back
				</Button>

				<Button
					type="submit"
					className="flex-1 h-12 rounded-xl bg-primary-base hover:bg-primary-dark text-white font-semibold"
					disabled={isLoading}
				>
					{isLoading ? (
						<span className="flex items-center justify-center">
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Creating Account...
						</span>
					) : (
						"Create Account"
					)}
				</Button>
			</div>
		</div>
	);
};

export default EducationBackgroundFields;
