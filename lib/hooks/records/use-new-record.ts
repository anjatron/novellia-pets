"use client";
import { useState } from "react";
import { createMedicalRecord } from "@/lib/api/records";
import { CreateMedicalRecordRequest } from "@/types/record";
import { handleApiError } from "@/lib/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useNewRecord(petId: string, onSuccess?: () => void) {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string[]
	> | null>(null);
	const router = useRouter();

	const submit = async (data: CreateMedicalRecordRequest) => {
		setSubmitting(true);
		setError(null);
		setFieldErrors(null);

		try {
			await createMedicalRecord(petId, data);
			toast.success("Record added successfully!");

			// Callback to trigger whatever is needed after success
			onSuccess?.();
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage:
					"An unexpected error occurred while creating the record.",
				onUnauthorized: () => router.push("/login"),
				setFieldErrors,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return { submit, submitting, error, fieldErrors };
}
