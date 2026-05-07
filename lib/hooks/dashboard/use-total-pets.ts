"use client";
import { useEffect, useState, useCallback } from "react";
import { getTotalPetsStats } from "@/lib/api/dashboard";
import { handleApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export function useTotalPets() {
	const [totalPets, setTotalPets] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const fetchTotalPets = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getTotalPetsStats();
			setTotalPets(response.data.totalPets);
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage:
					"An unexpected error occurred while fetching total pets.",
				onUnauthorized: () => router.push("/login"),
			});
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		async function fetch() {
			await fetchTotalPets();
		}
		fetch();
	}, [fetchTotalPets]);

	return { totalPets, loading, error, retry: fetchTotalPets };
}
