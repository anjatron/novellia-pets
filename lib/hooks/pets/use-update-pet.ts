"use client";
import { useState } from "react";
import { updatePet } from "@/lib/api/pets";
import { UpdatePetRequest } from "@/types/pet";
import { handleApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUpdatePet(id: string) {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string[]
	> | null>(null);

	const submit = async (data: UpdatePetRequest) => {
		setSubmitting(true);
		setError(null);
		setFieldErrors(null);

		try {
			await updatePet(id, data);
			toast.success("Pet updated successfully!");
			router.push("/pets");
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage: "An unexpected error occurred while updating pet.",
				onUnauthorized: () => router.push("/login"),
				setFieldErrors,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return { submit, submitting, error, fieldErrors };
}
