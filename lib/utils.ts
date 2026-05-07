import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatUTCDate(dateString: string) {
	const date = new Date(dateString);
	return format(
		new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
		"MM/dd/yyyy",
	);
}
