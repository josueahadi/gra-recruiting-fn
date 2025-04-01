/**
 * Formats a date string to a more user-friendly format
 * If the input is just a year, it will be returned as is
 * If the input has a month and year format, it will be properly formatted
 *
 * @param dateStr The date string to format (could be year only or full date)
 * @returns Formatted date string
 */
export const formatDateString = (dateStr: string): string => {
	if (!dateStr) return "";

	// If it's just a 4-digit year
	if (/^\d{4}$/.test(dateStr)) {
		return dateStr;
	}

	// Check if it's already in Month Year format (e.g., "Jun 2021")
	if (/^[A-Za-z]{3} \d{4}$/.test(dateStr)) {
		return dateStr;
	}

	// Try to parse as a date
	try {
		const date = new Date(dateStr);
		// Check if date is valid
		if (!Number.isNaN(date.getTime())) {
			return date.toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		// If parsing fails, return original
		console.warn(`Failed to parse date: ${dateStr}`);
	}

	// Return the original if all else fails
	return dateStr;
};

/**
 * Creates a date range string in the format "Start - End (duration)"
 * Handles empty values and "Present" for end dates
 * Includes the calculated duration in parentheses
 *
 * @param startDate Start date string
 * @param endDate End date string
 * @returns Formatted date range with duration
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
	const formattedStart = formatDateString(startDate);
	const formattedEnd = endDate ? formatDateString(endDate) : "Present";

	if (!formattedStart) return formattedEnd ? formattedEnd : "";

	// Calculate duration if both dates are valid
	let durationText = "";
	try {
		const start = parseDate(startDate);
		const end = endDate ? parseDate(endDate) : new Date();

		if (start && !Number.isNaN(start.getTime())) {
			durationText = calculateDuration(start, end);
			if (durationText) {
				durationText = ` (${durationText})`;
			}
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		// Ignore duration calculation errors
	}

	return `${formattedStart} - ${formattedEnd}${durationText}`;
};

/**
 * Parses a date string into a Date object
 * Handles various date formats including "Month Year"
 *
 * @param dateStr The date string to parse
 * @returns Date object or null if invalid
 */
const parseDate = (dateStr: string): Date | null => {
	if (!dateStr) return null;

	// Handle 4-digit year
	if (/^\d{4}$/.test(dateStr)) {
		return new Date(Number.parseInt(dateStr, 10), 0, 1); // January 1st of the year
	}

	// Handle "Month Year" format (e.g., "Jun 2021")
	const monthYearMatch = dateStr.match(/^([A-Za-z]{3}) (\d{4})$/);
	if (monthYearMatch) {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const monthIndex = months.findIndex((m) => m === monthYearMatch[1]);
		if (monthIndex >= 0) {
			return new Date(Number.parseInt(monthYearMatch[2], 10), monthIndex, 1);
		}
	}

	// Try regular date parsing
	const date = new Date(dateStr);
	return !Number.isNaN(date.getTime()) ? date : null;
};

/**
 * Calculates the duration between two dates and formats it in a user-friendly way
 *
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted duration string (e.g., "3 yrs 2 mos")
 */
const calculateDuration = (
	startDate: Date | null,
	endDate: Date | null,
): string => {
	if (!startDate || !endDate) {
		return "Invalid dates";
	}

	// Get years difference
	let years = endDate.getFullYear() - startDate.getFullYear();

	// Adjust for months
	const months = endDate.getMonth() - startDate.getMonth();
	if (months < 0) {
		years--;
	}

	// Calculate total months for display
	const totalMonths =
		years * 12 + ((endDate.getMonth() - startDate.getMonth() + 12) % 12);

	// Format years and months
	const yearsText = years > 0 ? `${years} ${years === 1 ? "yr" : "yrs"}` : "";
	const monthsText =
		totalMonths % 12 > 0
			? `${totalMonths % 12} ${totalMonths % 12 === 1 ? "mo" : "mos"}`
			: "";

	if (yearsText && monthsText) {
		return `${yearsText} ${monthsText}`;
	}
	if (yearsText) {
		return yearsText;
	}
	if (monthsText) {
		return monthsText;
	}
	return "Less than a month";
};
