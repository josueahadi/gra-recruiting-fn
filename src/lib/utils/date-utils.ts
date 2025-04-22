/**
 * Format a date string to "Month Year" format
 * @param dateStr ISO date string or other parseable date format
 * @returns Formatted date string (e.g., "Jan 2021")
 */
export function formatDateString(dateStr?: string): string {
	if (!dateStr) return "";

	try {
		const date = new Date(dateStr);
		if (Number.isNaN(date.getTime())) return dateStr;

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
		return `${months[date.getMonth()]} ${date.getFullYear()}`;
	} catch (e) {
		return dateStr;
	}
}

/**
 * Format a date range as a string
 * @param startDate Start date string
 * @param endDate End date string (or undefined for "Present")
 * @returns Formatted date range (e.g., "Jan 2020 - Present")
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
	const start = formatDateString(startDate);
	const end = endDate ? formatDateString(endDate) : "Present";

	return `${start} - ${end}`;
}

/**
 * Convert UI-friendly date formats to API-compatible format (YYYY-MM-DD)
 * @param uiDate Date string in UI format
 * @returns ISO date string (YYYY-MM-DD)
 */
export function convertUIDateToApiDate(uiDate: string): string {
	try {
		// If it's just a year (e.g., "2021")
		if (/^\d{4}$/.test(uiDate)) {
			return `${uiDate}-01-01`;
		}

		// If it's in "Month Year" format (e.g., "Jun 2021")
		const monthYearMatch = uiDate.match(/^([A-Za-z]{3}) (\d{4})$/);
		if (monthYearMatch) {
			const monthMap: Record<string, string> = {
				Jan: "01",
				Feb: "02",
				Mar: "03",
				Apr: "04",
				May: "05",
				Jun: "06",
				Jul: "07",
				Aug: "08",
				Sep: "09",
				Oct: "10",
				Nov: "11",
				Dec: "12",
			};

			const month = monthMap[monthYearMatch[1]];
			const year = monthYearMatch[2];

			return `${year}-${month}-01`;
		}

		// If it's already in ISO format or another parseable format
		const date = new Date(uiDate);
		if (!Number.isNaN(date.getTime())) {
			return date.toISOString().split("T")[0];
		}

		// If all parsing attempts fail, return original
		return uiDate;
	} catch (e) {
		console.error(`Error converting date: ${uiDate}`, e);
		return uiDate;
	}
}
