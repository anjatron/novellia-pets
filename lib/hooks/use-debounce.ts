"use client";
import { useEffect, useState } from "react";

// helper to handle debounce logic for things like search on input
// we dont want to trigger fetching data for every character
export function useDebounce<T>(value: T, delay = 300): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debounced;
}
