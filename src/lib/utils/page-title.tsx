export function getPageTitle(
	pathname: string,
	userType: "applicant" | "admin",
): string {
	if (userType === "admin") {
		if (pathname.includes("/dashboard")) return "Dashboard";
		if (pathname.includes("/applicants")) return "Applicants";
		if (pathname.includes("/questions")) return "Questions";
		if (pathname.includes("/results")) return "Results";
		return "Dashboard";
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		if (pathname.includes("/dashboard")) return "Dashboard";
		if (pathname.includes("/exam")) return "Exam";
		if (pathname === "/applicant") return "Profile";
		if (pathname.includes("/skills")) return "Skills & Competence";
		if (pathname.includes("/education")) return "Work & Education";
		if (pathname.includes("/documents")) return "Documents & Portfolio";

		const lastPathSegment = pathname.split("/").pop() || "";
		return (
			lastPathSegment.charAt(0).toUpperCase() + lastPathSegment.slice(1) ||
			"Dashboard"
		);
	}
}
