import { handleApiError } from "@/lib/api/client";
import { getPet } from "@/lib/api/pets";
import { Pet } from "@/types/pet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function usePetDetails(id: string) {
	const [pet, setPet] = useState<Pet | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	useEffect(() => {
		async function fetchPet() {
			try {
				setError(null);
				setLoading(true);
				const response = await getPet(id);
				setPet(response.data);
			} catch (err) {
				handleApiError(err, setError, {
					fallbackMessage:
						"An unexpected error occurred while fetching pet details.",
					onUnauthorized: () => router.push("/login"),
				});
			} finally {
				setLoading(false);
			}
		}

		fetchPet();
	}, [id, router]);

	return { pet, loading, error };
}
