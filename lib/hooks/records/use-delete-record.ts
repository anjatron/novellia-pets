import { handleApiError } from "@/lib/api/client";
import { deleteMedicalRecord } from "@/lib/api/records";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useDeleteRecord(onSuccess?: () => void) {
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();
	const submit = async (petId: string, recordId: string) => {
		setSubmitting(true);
		setError(null);

		try {
			await deleteMedicalRecord(petId, recordId);
			toast.success("Record deleted successfully!");

			// Callback to trigger whatever is needed after success
			onSuccess?.();
		} catch (err) {
			handleApiError(err, setError, {
				fallbackMessage: "Failed to delete record. Please try again.",
				onUnauthorized: () => router.push("/login"),
				showToast: true,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return { submit, error, submitting };
}
