"use client";
import { useEffect, useState, useCallback } from "react";
import { getUpcomingVaccines } from "@/lib/api/dashboard";
import { UpcomingVaccineStats } from "@/types/dashboard";
import { handleApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export function useUpcomingVaccines() {
	const [data, setData] = useState<UpcomingVaccineStats[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const fetchUpcomingVaccines = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getUpcomingVaccines();
			setData(response.data);
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage:
					"An unexpected error occurred while fetching upcoming vaccines.",
				onUnauthorized: () => router.push("/login"),
			});
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		async function fetch() {
			await fetchUpcomingVaccines();
		}
		fetch();
	}, [fetchUpcomingVaccines]);

	return { data, loading, error, retry: fetchUpcomingVaccines };
}
