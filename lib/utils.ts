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

export function isBirthdayUpcoming(dateString: string) {
	const date = new Date(dateString);

	const now = new Date();
	const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	const thirtyDaysFromNow = new Date(todayUTC.getTime() + 30 * 24 * 60 * 60 * 1000);

	const birthday = new Date(Date.UTC(
		todayUTC.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate()
	))

	if (birthday < todayUTC) {
		birthday.setUTCFullYear(todayUTC.getUTCFullYear() + 1);
	}

	return birthday <= thirtyDaysFromNow;
}