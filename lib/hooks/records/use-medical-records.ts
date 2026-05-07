"use client";
import { useEffect, useState } from "react";
import { handleApiError } from "@/lib/api/client";
import { getMedicalRecordsForPet } from "@/lib/api/records";
import { MedicalRecord } from "@/types/record";
import { RecordType } from "@/types/enums";
import { useRouter } from "next/navigation";

export function useMedicalRecords(params: {
	petId: string;
	recordType?: RecordType;
	page?: number;
	limit?: number;
}) {
	const [records, setRecords] = useState<MedicalRecord[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [refetchFlag, setRefetchFlag] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const router = useRouter();
	useEffect(() => {
		async function fetchRecords() {
			try {
				setError(null);
				setLoading(true);
				const response = await getMedicalRecordsForPet(params);
				setRecords(response.data);
				if (response.pagination) {
					setTotalPages(response.pagination.totalPages);
				}
			} catch (err) {
				handleApiError(err, setError, {
					fallbackMessage:
						"An unexpected error occurred while fetching medical records.",
					onUnauthorized: () => router.push("/login"),
				});
			} finally {
				setLoading(false);
			}
		}

		fetchRecords();
	}, [params.petId, params.page, refetchFlag, router]);

	// Explicit refetch functionality!!
	// Helps trigger useEffect when an action on a table row is performed and router cannot be used
	const refetch = () => setRefetchFlag((prev) => !prev);

	return { records, loading, error, refetch, totalPages };
}
