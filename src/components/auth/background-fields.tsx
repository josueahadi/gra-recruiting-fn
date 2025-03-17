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
import { BsGithub, BsLinkedin } from "react-icons/bs";

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) =>
	(new Date().getFullYear() - i).toString(),
);

export const EducationBackgroundFields = ({
	onBack,
	isLoading,
}: { onBack: () => void; isLoading: boolean }) => (
	<div className="space-y-6">
		<div>
			<label
				htmlFor="career"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Career
			</label>
			<Select name="department">
				<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
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
		</div>

		<div>
			<label
				htmlFor="institution"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Add Education History
			</label>
			<Select name="institution">
				<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
					<SelectValue placeholder="Select your institution" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="university1">University 1</SelectItem>
					<SelectItem value="university2">University 2</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div>
			<label
				htmlFor="educationLevel"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Education Level
			</label>
			<Select name="educationLevel">
				<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
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
		</div>

		<div>
			<label
				htmlFor="program"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Program
			</label>
			<Input
				type="text"
				name="program"
				placeholder="Education Program"
				className="w-full h-12 rounded-xl border-gray-400 bg-white"
			/>
		</div>

		<div>
			<label
				htmlFor="graduationYear"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Graduation Date
			</label>
			<Select name="graduationYear">
				<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
					<SelectValue placeholder="2018" />
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

		<div>
			<label
				htmlFor="cvUpload"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Your CV
			</label>
			<div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-shades-500 transition-colors cursor-pointer">
				<div className="flex flex-col items-center">
					<svg
						className="w-8 h-8 text-primary-shades-500 mb-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-label="Upload icon"
					>
						<title>Upload icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
					<p className="font-medium">Click to Upload</p>
					<p className="text-sm text-gray-500">Drag and drop file here</p>
				</div>
			</div>
		</div>

		<div className="space-y-4">
			<label
				htmlFor="optionalInfo"
				className="block text-sm font-medium text-gray-700"
			>
				Add Optional Information
			</label>
			<Button
				variant="outline"
				className="w-full h-12 rounded-xl border-gray-400 bg-white hover:bg-gray-50"
			>
				<BsLinkedin className="mr-2 text-[#0077B5]" />
				LinkedIn Profile Link
			</Button>
			<Button
				variant="outline"
				className="w-full h-12 rounded-xl border-gray-400 bg-white hover:bg-gray-50"
			>
				<BsGithub className="mr-2" />
				GitHub Profile Link
			</Button>
		</div>

		<div className="flex gap-4">
			<Button
				type="button"
				variant="outline"
				className="flex-1 h-12 rounded-xl border-gray-400"
				onClick={onBack}
			>
				Back
			</Button>
			<Button
				type="submit"
				className="flex-1 h-12 rounded-xl bg-primary-base hover:bg-primary-base text-white font-semibold"
				disabled={isLoading}
			>
				Create Account
			</Button>
		</div>
	</div>
);
