import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
	onClick: () => void;
}

const GoogleAuthButton = ({ onClick }: GoogleAuthButtonProps) => {
	return (
		<Button
			type="button"
			variant="outline"
			className="w-full h-12 rounded-xl border border-primary-shades-100 bg-primary-shades-50 hover:bg-primary-shades-50 text-gray-700 font-medium"
			onClick={onClick}
		>
			<FcGoogle className="mr-2" />
			Continue with Google
		</Button>
	);
};

export default GoogleAuthButton;
