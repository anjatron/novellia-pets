import { handleApiError } from "@/lib/api/client";
import { deletePet } from "@/lib/api/pets";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useDeletePet(onSuccess?: () => void) {
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const submit = async (id: string) => {
		setSubmitting(true);
		setError(null);

		try {
			await deletePet(id);
			toast.success("Pet deleted successfully!");

			// Callback to trigger whatever is needed after success
			onSuccess?.();
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage: "Failed to delete pet. Please try again.",
				onUnauthorized: () => router.push("/login"),
				showToast: true,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return { submit, error, submitting };
}
