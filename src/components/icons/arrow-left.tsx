import type { IconProps } from "@/types";

export const ArrowLeft = ({
	size = 26,
	color = "#39ADE3",
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
		<title>Arrow Left</title>
		<path
			d="M7.62125 16.3083C7.87313 16.05 7.865 15.6417 7.62125 15.3667L2.22625 9.1672H25.35C25.7075 9.1672 26 8.86722 26 8.50058C26 8.13394 25.7075 7.83396 25.35 7.83396H2.22625L7.61313 1.63441C7.84875 1.35109 7.87313 0.959453 7.62125 0.701138C7.36938 0.442824 6.93063 0.426159 6.695 0.692806C6.695 0.692806 0.26 7.94228 0.195 8.02561C0.130001 8.10894 0 8.25893 0 8.50058C0 8.74223 0.130001 8.90888 0.195 8.97554C0.26 9.04221 6.695 16.3083 6.695 16.3083C6.81688 16.4333 6.9875 16.5 7.15813 16.5C7.32875 16.5 7.49125 16.4333 7.62125 16.3083Z"
			fill={color}
		/>
	</svg>
);
