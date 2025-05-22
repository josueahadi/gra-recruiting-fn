import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ExitExamDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const ExitExamDialog: React.FC<ExitExamDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<div className="flex items-center gap-2 text-amber-600">
						<AlertTriangle className="h-5 w-5" />
						<DialogTitle>Warning: Leaving Exam</DialogTitle>
					</div>
					<DialogDescription className="pt-4">
						Are you sure you want to leave the exam? This will end your current
						session and you will not be able to return to it.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={onClose}>
						Stay on Exam
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Leave Exam
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ExitExamDialog;
