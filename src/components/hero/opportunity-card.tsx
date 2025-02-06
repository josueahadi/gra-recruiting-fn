import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface CardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

const OpportunityCard = ({ icon, title, description }: CardProps) => {
	return (
		<Card className="flex flex-col justify-between items-center text-center shadow-lg md:max-w-72 bg-gray-200">
			<CardHeader className="flex flex-col items-center">
				<div className="mb-4">{icon}</div>
				<CardTitle className="text-base sm:text-lg font-bold uppercase text-gray-900">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="text-xs sm:text-sm font-medium text-gray-800">
					{description}
				</CardDescription>
			</CardContent>
			<CardFooter className="mt-auto">
				<Button
					asChild
					className="px-6 py-3 rounded-3xl bg-secondary-base text-white transition-colors duration-300 hover:bg-secondary-light hover:text-white capitalize font-bold"
				>
					<Link href="/apply">Apply</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default OpportunityCard;
