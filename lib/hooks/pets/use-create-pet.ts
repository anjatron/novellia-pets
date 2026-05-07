"use client";
import { useState } from "react";
import { createPet } from "@/lib/api/pets";
import { CreatePetRequest } from "@/types/pet";
import { handleApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreatePet() {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string[]
	> | null>(null);

	const submit = async (data: CreatePetRequest) => {
		setSubmitting(true);
		setError(null);
		setFieldErrors(null);

		try {
			await createPet(data);
			toast.success("Pet created successfully!");
			router.push("/pets");
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage: "An unexpected error occurred while creating pet.",
				onUnauthorized: () => router.push("/login"),
				setFieldErrors,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return { submit, submitting, error, fieldErrors };
}
