import { cn } from "@/lib/utils";
import type { FormStepProps, ProgressIndicatorProps } from "@/types/auth";
import * as React from "react";

interface ExtendedFormStepProps extends FormStepProps {
	completed: boolean;
}

const FormStep = ({
	isActive,
	completed,
	stepNumber,
	label,
}: ExtendedFormStepProps) => (
	<div className="flex items-center">
		<div
			className={cn(
				"w-8 h-8 text-xl rounded-full text-center border-2 border-gray-400 font-bold	",
				{
					"border-sky-500 text-sky-500 bg-white": isActive && !completed,
					"bg-sky-500 text-white border-sky-500": completed,
					"bg-gray-200 text-gray-600": !isActive && !completed,
				},
			)}
			aria-current={isActive ? "step" : undefined}
		>
			{stepNumber}
		</div>
		<span
			className={cn(
				"ml-2 font-medium",
				isActive || completed ? "text-sky-500" : "text-gray-400",
			)}
		>
			{label}
		</span>
	</div>
);

const ProgressIndicator = ({ currentStep, steps }: ProgressIndicatorProps) => {
	return (
		<nav
			className="flex items-center justify-center gap-4 pb-8"
			aria-label="Registration progress"
		>
			{steps.map((step, index) => (
				<React.Fragment key={step.number}>
					<FormStep
						isActive={currentStep === step.number}
						completed={step.number < currentStep}
						stepNumber={step.number}
						label={step.label}
					/>
					{index < steps.length - 1 && (
						<div
							className="w-12 md:w-32 lg:w-52 h-[0.5px] bg-gray-400"
							aria-hidden="true"
						/>
					)}
				</React.Fragment>
			))}
		</nav>
	);
};

export default ProgressIndicator;
