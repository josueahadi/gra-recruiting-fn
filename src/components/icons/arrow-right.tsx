import type { IconProps } from "@/types";

export const ArrowRight = ({
	size = 26,
	color = "#FFFFFF",
	className,
	...props
}: IconProps) => (
	<svg
		width={size}
		height={size * 0.65} // Preserving aspect ratio (17/26)
		viewBox="0 0 26 17"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		{...props}
	>
		<title>Arrow Right</title>
		<path
			d="M18.3787 16.3083C18.1269 16.05 18.135 15.6417 18.3787 15.3667L23.7738 9.1672H0.65C0.2925 9.1672 0 8.86722 0 8.50058C0 8.13394 0.2925 7.83396 0.65 7.83396H23.7738L18.3869 1.63441C18.1512 1.35109 18.1269 0.959453 18.3787 0.701138C18.6306 0.442824 19.0694 0.426159 19.305 0.692806C19.305 0.692806 25.74 7.94228 25.805 8.02561C25.87 8.10894 26 8.25893 26 8.50058C26 8.74223 25.87 8.90888 25.805 8.97554C25.74 9.04221 19.305 16.3083 19.305 16.3083C19.1831 16.4333 19.0125 16.5 18.8419 16.5C18.6712 16.5 18.5087 16.4333 18.3787 16.3083Z"
			fill={color}
		/>
	</svg>
);
