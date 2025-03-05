import ErrorBoundary from "@/components/error-boundary";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PrimaryActionButton from "../primary-action-button";

interface CardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

const OpportunityCard = ({ icon, title, description }: CardProps) => {
	return (
		<ErrorBoundary>
			<Card className="flex flex-col justify-between items-center text-center shadow-lg md:max-w-72 bg-gray-200 px-2">
				<CardHeader className="flex flex-col items-center">
					<div className="mb-4">{icon}</div>
					<CardTitle className="text-base sm:text-base font-bold uppercase text-gray-900">
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className="text-xs sm:text-sm font-medium text-gray-900">
						{description}
					</CardDescription>
				</CardContent>
				<CardFooter className="mt-auto">
					<PrimaryActionButton className="capitalize">
						Apply
					</PrimaryActionButton>
				</CardFooter>
			</Card>
		</ErrorBoundary>
	);
};

export default OpportunityCard;
