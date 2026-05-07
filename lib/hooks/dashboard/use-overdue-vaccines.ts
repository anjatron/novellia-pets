"use client";
import { useCallback, useEffect, useState } from "react";
import { getOverdueVaccines } from "@/lib/api/dashboard";
import { OverdueVaccineStats } from "@/types/dashboard";
import { handleApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export function useOverdueVaccines() {
	const [data, setData] = useState<OverdueVaccineStats[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const fetchOverdueVaccines = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getOverdueVaccines();

			// deduplicate by most recent per vaccine name - since the MVP does not track "completed" or a more robust VaccineCatalog with
			// administration intervals, the active vaccines are derived
			// in Production, we would want to have a VaccineCatalog table tracking vaccines for animal type and an administration interval
			// to compute the overdue / upcoming needs
			const latestPerVaccine = response.data.reduce(
				(acc, record) => {
					const name = record.vaccineName;
					if (
						!acc[name] ||
						new Date(record.dateAdministered) >
							new Date(acc[name].dateAdministered)
					) {
						acc[name] = record;
					}
					return acc;
				},
				{} as Record<string, (typeof response.data)[0]>,
			);
			const activeVaccines = Object.values(latestPerVaccine);
			setData(activeVaccines);
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage:
					"An unexpected error occurred while fetching overdue vaccines.",
				onUnauthorized: () => router.push("/login"),
			});
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		async function fetch() {
			await fetchOverdueVaccines();
		}
		fetch();
	}, [fetchOverdueVaccines]);

	return { data, loading, error, retry: fetchOverdueVaccines };
}
