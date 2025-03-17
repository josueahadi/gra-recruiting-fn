"use client";

import { cn } from "@/lib/utils";
import type { BackgroundShapeProps } from "@/types";

export const BackgroundShape = ({
	className,
	fill = "#2B9AC9",
	fillOpacity = 1,
	stroke = "#2B9AC9",
	strokeWidth = 1,
	variant = "filled",
	width = 407,
	height = 418,
}: BackgroundShapeProps) => {
	return (
		<div className={cn("absolute", className)}>
			<svg
				width={width}
				height={height}
				viewBox={variant === "filled" ? "0 0 407 418" : "0 0 410 416"}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Background Shape</title>
				{variant === "filled" ? (
					<path
						d="M0.916748 200.459C0.916748 90.0017 90.4598 0.458496 200.917 0.458496H386.411C397.456 0.458496 406.411 9.4128 406.411 20.4585V277.292C406.411 354.612 343.731 417.292 266.411 417.292H20.9167C9.87105 417.292 0.916748 408.338 0.916748 397.292V200.459Z"
						fill={fill}
						fillOpacity={fillOpacity}
					/>
				) : (
					<path
						d="M200.889 1.2085H389.75C400.52 1.2085 409.25 9.93894 409.25 20.7085V275.264C409.25 352.308 346.794 414.764 269.75 414.764H20.8889C10.1194 414.764 1.38892 406.034 1.38892 395.264V200.708C1.38892 90.5276 90.7081 1.2085 200.889 1.2085Z"
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				)}
			</svg>
		</div>
	);
};
