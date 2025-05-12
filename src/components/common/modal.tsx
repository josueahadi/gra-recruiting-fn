import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({
	open,
	onClose,
	title,
	children,
}: {
	open: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			className="fixed z-50 inset-0 flex items-center justify-center"
		>
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
			<Dialog.Panel className="relative bg-white rounded-lg p-6 shadow-lg max-w-lg w-full border-2 border-primary-base">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-3 right-3 text-primary-base hover:text-custom-skyBlue"
				>
					<X size={20} />
				</button>
				<Dialog.Title className="text-xl font-bold text-primary-base mb-4">
					{title}
				</Dialog.Title>
				{children}
			</Dialog.Panel>
		</Dialog>
	);
}
