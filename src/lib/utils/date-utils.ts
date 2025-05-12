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
		console.error(`Error formatting date: ${dateStr}`, e);
		return dateStr;
	}
}

export function formatDateRange(startDate?: string, endDate?: string): string {
	const start = formatDateString(startDate);
	const end = endDate ? formatDateString(endDate) : "Present";

	return `${start} - ${end}`;
}

export function convertUIDateToApiDate(uiDate: string): string {
	try {
		if (/^\d{4}$/.test(uiDate)) {
			return `${uiDate}-01-01`;
		}

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

		const date = new Date(uiDate);
		if (!Number.isNaN(date.getTime())) {
			return date.toISOString().split("T")[0];
		}

		return uiDate;
	} catch (e) {
		console.error(`Error converting date: ${uiDate}`, e);
		return uiDate;
	}
}
