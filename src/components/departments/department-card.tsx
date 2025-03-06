import ErrorBoundary from "@/components/error-boundary";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PrimaryActionButton from "@/components/primary-action-button";

interface CardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

const DepartmentCard = ({ icon, title, description }: CardProps) => {
	return (
		<ErrorBoundary>
			<Card className="flex flex-col justify-between items-center text-center shadow-lg md:max-w-72 px-2 bg-gradient-to-t from-primary-dark to-primary-base">
				<CardHeader className="flex flex-col items-center">
					<div className="mb-2 text-white">{icon}</div>
					<CardTitle className="text-lg sm:text-2xl font-bold uppercase text-white">
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent className="w-full">
					<CardDescription className="text-base sm:text-base font-medium text-white">
						{description}
					</CardDescription>
				</CardContent>
				<CardFooter className="mt-auto w-full">
					<PrimaryActionButton className="capitalize w-full bg-white text-black text-sm font-medium hover:text-black focus:outline-none">
						Learn More
					</PrimaryActionButton>
				</CardFooter>
			</Card>
		</ErrorBoundary>
	);
};

export default DepartmentCard;
