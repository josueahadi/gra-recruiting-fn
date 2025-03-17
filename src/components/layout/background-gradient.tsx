export const BackgroundGradient = () => {
	return (
		<div className="fixed inset-0 -z-10">
			<div
				className="absolute inset-0"
				style={{
					background: "linear-gradient(135deg, #E6E7F2 0%, #DFE0F9 100%)",
				}}
			/>
		</div>
	);
};
