import { handleApiError } from "@/lib/api/client";
import { getPetsByTypeStats } from "@/lib/api/dashboard";
import { PetsByTypeStats } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function usePetsByType() {
	const [petsByType, setPetsByType] = useState<PetsByTypeStats[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const fetchPetsByType = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getPetsByTypeStats();
			setPetsByType(response.data);
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage:
					"An unexpected error occurred while fetching pets by type.",
				onUnauthorized: () => router.push("/login"),
			});
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		async function fetch() {
			await fetchPetsByType();
		}
		fetch();
	}, [fetchPetsByType]);

	return { petsByType, loading, error, retry: fetchPetsByType };
}
