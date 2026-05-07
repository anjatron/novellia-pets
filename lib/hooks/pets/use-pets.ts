"use client";
import { useEffect, useState } from "react";
import { getPets } from "@/lib/api/pets";
import { Pet } from "@/types/pet";
import { handleApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export function usePets(params?: { name?: string; animalType?: string }) {
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [refetchFlag, setRefetchFlag] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const router = useRouter();
	useEffect(() => {
		async function fetchPets() {
			try {
				setError(null);
				setLoading(true);
				const response = await getPets({ ...params, page });

				// deduplicate by most recent per vaccine name - since the MVP does not track "completed" or a more robust VaccineCatalog with
				// administration intervals, the active vaccines are derived
				// in Production, we would want to have a VaccineCatalog table tracking vaccines for animal type and an administration interval
				// to compute the overdue / upcoming needs
				const pets = response.data.map((pet) => {
					const latestPerVaccine = pet.records.reduce(
						(acc, record) => {
							if (!record.vaccine) return acc;
							const name = record.vaccine.vaccineName;
							if (
								!acc[name] ||
								new Date(record.vaccine.dateAdministered) >
									new Date(acc[name].vaccine.dateAdministered)
							) {
								acc[name] = record;
							}
							return acc;
						},
						{} as Record<string, (typeof pet.records)[0]>,
					);

					return {
						...pet,
						records: Object.values(latestPerVaccine),
					};
				});

				setPets(pets);
				if (response.pagination) {
					setTotalPages(response.pagination.totalPages);
				}
			} catch (err) {
				handleApiError(err, setError, {
					fallbackMessage: "An unexpected error occurred while fetching pets.",
					onUnauthorized: () => router.push("/login"),
				});
			} finally {
				setLoading(false);
			}
		}

		fetchPets();
	}, [params?.name, params?.animalType, page, refetchFlag, router]);

	// Explicit refetch functionality!!
	// Helps trigger useEffect when an action on a table row is performed and router cannot be used
	const refetch = () => setRefetchFlag((prev) => !prev);

	return { pets, loading, error, refetch, page, totalPages, setPage };
}
